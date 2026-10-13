(function(root) {
  'use strict';
  const policy = typeof module === 'object' && module.exports ? require('./location-policy') : root.ZooLocationPolicy;
  const DOMAINS = ['Con Ed', 'Animal Care', 'Public Safety', 'Garden Services / Facilities', 'Guest Services / Marketing / PR', 'IT / Platform Administration'];
  const TYPES = { landmark: 'Point', facility: 'Point', pathway: 'LineString', 'viewing-zone': 'Polygon' };
  const MAX_RECORDS = 100, MAX_POINTS = 200, MAX_TOTAL_POINTS = 1000;
  function validatePoint(point, ring) {
    if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng) || Math.abs(point.lat) > 90 || Math.abs(point.lng) > 180) throw new Error('Invalid survey coordinates.');
    if (!policy.contains([point.lat, point.lng], ring) && policy.edgeDistance([point.lat, point.lng], ring) > 1) throw new Error('Place survey points inside the approximate Zoo perimeter.');
    if (!['manual-map', 'gps'].includes(point.source) || !Number.isFinite(Date.parse(point.capturedAt))) throw new Error('Each point needs a valid source and capture time.');
    if (point.source === 'gps' && (!Number.isFinite(point.accuracy) || point.accuracy <= 0 || point.accuracy > 20 || !Number.isFinite(point.fixTimestamp) || Math.abs(Date.parse(point.capturedAt) - point.fixTimestamp) > 30000)) throw new Error('GPS survey points need a fresh fix with accuracy of 20 m or better.');
    return { lat: point.lat, lng: point.lng, source: point.source, capturedAt: point.capturedAt, accuracy: point.source === 'gps' ? point.accuracy : null, fixTimestamp: point.source === 'gps' ? point.fixTimestamp : null };
  }
  const text = (value, limit, label, required = false) => {
    if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) throw new Error(`Check ${label} (maximum ${limit} characters).`);
    return value.trim();
  };
  function createDraft(input, ring, now = Date.now()) {
    if (!Object.hasOwn(TYPES, input.kind) || !DOMAINS.includes(input.domain)) throw new Error('Choose a survey type and review domain.');
    const name = text(input.name, 120, 'name', true), notes = text(input.notes || '', 2000, 'notes');
    if (!Array.isArray(input.points) || input.points.length > MAX_POINTS) throw new Error('Too many survey vertices.');
    const points = input.points.map(point => validatePoint(point, ring));
    const count = points.length;
    if ((TYPES[input.kind] === 'Point' && count !== 1) || (input.kind === 'pathway' && count < 2) || (input.kind === 'viewing-zone' && count < 3)) throw new Error('Use one point for a landmark/facility, at least two for a path, or three for a viewing zone.');
    if (new Set(points.map(p => `${p.lat},${p.lng}`)).size !== count) throw new Error('Remove repeated vertices; the zone closes automatically.');
    if (input.kind === 'viewing-zone') {
      const xy = points.map(p => [p.lng, p.lat]);
      const cross = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
      const on = (a,b,p) => cross(a,b,p) === 0 && p[0]>=Math.min(a[0],b[0]) && p[0]<=Math.max(a[0],b[0]) && p[1]>=Math.min(a[1],b[1]) && p[1]<=Math.max(a[1],b[1]);
      const intersects = (a,b,c,d) => (cross(a,b,c)*cross(a,b,d)<0 && cross(c,d,a)*cross(c,d,b)<0) || on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);
      const area = xy.reduce((sum,p,i) => {const q=xy[(i+1)%count]; return sum+p[0]*q[1]-q[0]*p[1];},0);
      if (Math.abs(area)<1e-12) throw new Error('The viewing zone must enclose an area.');
      for(let i=0;i<count;i++) for(let j=i+1;j<count;j++) if(j!==i+1 && !(i===0 && j===count-1) && intersects(xy[i],xy[(i+1)%count],xy[j],xy[(j+1)%count])) throw new Error('Viewing-zone edges must not cross.');
    }
    const attrs = input.attributes || {};
    if (!['unknown','paved','gravel','earth','boardwalk'].includes(attrs.surface || 'unknown') || !['unknown','yes','no'].includes(attrs.stairs || 'unknown')) throw new Error('Invalid field attributes.');
    return { id: root.crypto.randomUUID(), revision: 1, status: 'draft', validation: 'unverified', kind: input.kind, name, notes, domain: input.domain,
      requestedReviews: [input.domain, 'Map Approver'], surveyorLabel: text(input.surveyorLabel || '',120,'surveyor label'), identityVerified: false,
      featureReference: text(input.featureReference || '',120,'feature reference'), createdAt: new Date(now).toISOString(), points,
      attributes: { surface: attrs.surface || 'unknown', stairs: attrs.stairs || 'unknown' } };
  }
  function toGeoJSON(records) {
    return { type: 'FeatureCollection', surveySchemaVersion: 1, reviewStatus: 'draft-only', features: records.map(record => {
      let coordinates = record.points.map(p => [p.lng,p.lat]);
      if (TYPES[record.kind] === 'Point') coordinates = coordinates[0];
      if (TYPES[record.kind] === 'Polygon') {
        const area = coordinates.reduce((sum,p,i) => { const q=coordinates[(i+1)%coordinates.length]; return sum+p[0]*q[1]-q[0]*p[1]; },0);
        if (area < 0) coordinates.reverse();
        coordinates = [[...coordinates, coordinates[0]]];
      }
      const { points, ...properties } = record;
      return { type: 'Feature', id: record.id, geometry: {type: TYPES[record.kind], coordinates}, properties: {...properties, pointEvidence: points} };
    }) };
  }
  function importGeoJSON(data, ring) {
    if (data?.type !== 'FeatureCollection' || data.surveySchemaVersion !== 1 || !Array.isArray(data.features) || data.features.length > MAX_RECORDS) throw new Error('Use a Survey Mode v1 GeoJSON export (maximum 100 drafts).');
    if (data.features.reduce((sum,f) => sum + (Array.isArray(f?.properties?.pointEvidence) ? f.properties.pointEvidence.length : 0),0) > MAX_TOTAL_POINTS) throw new Error('Maximum 1000 saved vertices per session.');
    const ids = new Set();
    return data.features.map(feature => {
      const p = feature.properties || {};
      // Imported status, approval claims and identity are never trusted.
      const record = createDraft({...p, points:p.pointEvidence}, ring);
      const expected = toGeoJSON([record]).features[0].geometry;
      if (JSON.stringify(expected) !== JSON.stringify(feature.geometry)) throw new Error('Geometry does not match its survey evidence.');
      if (typeof feature.id === 'string' && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(feature.id)) record.id = feature.id;
      if (ids.has(record.id)) throw new Error('Duplicate draft IDs in this file.');
      ids.add(record.id);
      if (typeof p.createdAt === 'string' && Number.isFinite(Date.parse(p.createdAt)) && Date.parse(p.createdAt) <= Date.now() + 1000) record.createdAt = p.createdAt;
      return record;
    });
  }
  const api = { DOMAINS, TYPES, MAX_RECORDS, MAX_POINTS, MAX_TOTAL_POINTS, createDraft, toGeoJSON, importGeoJSON, validatePoint };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZooSurveyModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
