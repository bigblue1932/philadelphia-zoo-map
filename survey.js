/* Browser-local draft surveying. No network submission or approval actions. */
(() => {
  'use strict';
  window.ZooSurvey = { mount(map, getFix, ring) {
    const model = window.ZooSurveyModel;
    const get = id => document.getElementById(`survey-${id}`);
    const message = value => { get('message').textContent = value; };
    const KEY = 'philadelphia-zoo-survey-v1';
    let active = false, points = [], records = [], remembering = false;
    const savedLayer = L.layerGroup().addTo(map), drawing = L.layerGroup().addTo(map);
    const purple = { color: '#8242a0', weight: 3, dashArray: '5 4', fillOpacity: 0.12 };
    const renderGeometry = (kind, vertices, layer) => {
      const coords = vertices.map(p => [p.lat,p.lng]);
      if (kind === 'viewing-zone' && coords.length >= 3) L.polygon(coords, purple).addTo(layer);
      else if (coords.length >= 2) L.polyline(coords, purple).addTo(layer);
      coords.forEach(point => L.circleMarker(point, {...purple, radius: 5, fillOpacity: 0.7}).addTo(layer));
    };
    const refreshDrawing = () => {
      drawing.clearLayers();
      if (active) renderGeometry(get('kind').value, points, drawing);
      get('vertices').textContent = `${points.length} ${points.length === 1 ? 'vertex' : 'vertices'} · ${get('kind').value === 'viewing-zone' ? 'at least 3; closes automatically' : get('kind').value === 'pathway' ? 'at least 2' : 'exactly 1'}`;
      get('undo').disabled = !points.length;
    };
    const persist = () => {
      if (!remembering) return true;
      try { localStorage.setItem(KEY, JSON.stringify(model.toGeoJSON(records))); return true; }
      catch { message('Drafts remain in memory, but device storage failed. Export a backup now.'); return false; }
    };
    const render = () => {
      savedLayer.clearLayers();
      get('list').replaceChildren();
      for (const record of records) {
        if (active) renderGeometry(record.kind, record.points, savedLayer);
        const item = document.createElement('li');
        const title = document.createElement('strong'); title.textContent = record.name;
        const detail = document.createElement('p'); detail.textContent = `${record.kind} · draft / unverified · ${record.points.length} vertices · reviews: ${record.domain} + Map Approver`;
        const show = document.createElement('button'); show.type = 'button'; show.textContent = 'Show draft';
        show.addEventListener('click', () => {
          if (!active) setActive(true);
          map.fitBounds(record.points.map(p => [p.lat,p.lng]), {maxZoom:18,padding:[30,30]});
          message(`${record.name}: ${record.notes || 'No notes.'}`);
        });
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove draft';
        remove.setAttribute('aria-label', `Remove draft ${record.name}`);
        remove.addEventListener('click', () => { records = records.filter(r => r.id !== record.id); render(); message('Draft removed from this device/session. Existing exports are unchanged.'); persist(); });
        item.append(title,detail,show,remove); get('list').append(item);
      }
      get('export').disabled = !records.length;
    };
    const refreshGPS = () => {
      const fix = getFix();
      const usable = active && fix && fix.accuracy <= 20 && fix.accuracy > 0 && Date.now() - fix.timestamp <= 30000;
      get('gps').disabled = !usable;
      get('gps-help').textContent = usable ? `Capture available · ± ${Math.round(fix.accuracy)} m. This records where you stand, not an inferred enclosure boundary.` : 'GPS capture needs confirmed on-site mode, a fresh fix and accuracy of 20 m or better. You can place manual vertices on the map.';
    };
    function setActive(value) {
      active = value;
      get('toggle').setAttribute('aria-pressed',String(value));
      get('toggle').textContent = value ? 'Exit Survey Mode' : 'Enter Survey Mode';
      get('editor').hidden = !value;
      if (value) map.fire('surveystart'); // Explicit mode change, not a synthetic user drag.
      refreshDrawing(); render(); refreshGPS();
      message(value ? 'Survey Mode active. Tap inside the approximate Zoo perimeter to place draft geometry.' : 'Survey Mode exited. Draft overlays are hidden; saved drafts remain available for export.');
    }
    const addPoint = point => {
      try {
        const validated = model.validatePoint(point,ring);
        if (points.length >= model.MAX_POINTS) throw new Error('Maximum 200 vertices per observation.');
        if (['landmark','facility'].includes(get('kind').value)) points = [validated];
        else points.push(validated);
        refreshDrawing(); message('Vertex added. Save the observation when its geometry and notes are ready.');
      } catch(error) { message(error.message); }
    };
    map.on('click', event => {
      if (active) addPoint({lat:event.latlng.lat,lng:event.latlng.lng,source:'manual-map',capturedAt:new Date().toISOString(),accuracy:null});
    });
    get('toggle').addEventListener('click',() => setActive(!active));
    get('kind').addEventListener('change',() => {
      points = []; refreshDrawing();
      get('domain').value = get('kind').value === 'viewing-zone' ? 'Animal Care' : 'Garden Services / Facilities';
      message('Observation type changed. The unfinished geometry was reset.');
    });
    get('undo').addEventListener('click',() => {points.pop();refreshDrawing();});
    get('center').addEventListener('click',() => {
      const point = map.getCenter();
      addPoint({lat:point.lat,lng:point.lng,source:'manual-map',capturedAt:new Date().toISOString(),accuracy:null});
    });
    get('gps').addEventListener('click',() => {
      const fix = getFix();
      if (!active || !fix || fix.accuracy > 20 || Date.now() - fix.timestamp > 30000) { refreshGPS(); message('No reliable on-site GPS fix is available.'); return; }
      addPoint({lat:fix.latlng[0],lng:fix.latlng[1],source:'gps',capturedAt:new Date().toISOString(),accuracy:fix.accuracy,fixTimestamp:fix.timestamp});
    });
    get('form').addEventListener('submit',event => {
      event.preventDefault();
      if (!active) return;
      try {
        if (records.length >= model.MAX_RECORDS) throw new Error('Maximum 100 drafts. Export a backup, then remove records to continue.');
        if (records.reduce((sum,r)=>sum+r.points.length,0)+points.length > model.MAX_TOTAL_POINTS) throw new Error('Maximum 1000 saved vertices. Export a backup, then remove records to continue.');
        const record = model.createDraft({kind:get('kind').value,name:get('name').value,domain:get('domain').value,notes:get('notes').value,
          featureReference:get('reference').value,surveyorLabel:get('surveyor').value,points,
          attributes:{surface:get('surface').value,stairs:get('stairs').value}},ring);
        records.push(record); points = []; refreshDrawing(); render();
        get('name').value = get('notes').value = get('reference').value = '';
        message(`Saved ${record.name} as an unverified draft. Nothing has been submitted or published.`);
        persist();
      } catch(error) { message(error.message); }
    });
    get('remember').addEventListener('change',() => {
      const desired = get('remember').checked;
      if (desired) { remembering = true; if(persist()) message('Saved drafts will be remembered on this device. Unfinished vertices are not stored.'); }
      else {
        try { localStorage.removeItem(KEY); remembering = false; message('Device copy erased. Drafts remain in this session until reload.'); }
        catch { get('remember').checked = true; remembering = true; message('Could not erase the device copy. Check browser storage settings.'); }
      }
    });
    get('export').addEventListener('click',() => {
      const blob = new Blob([JSON.stringify(model.toGeoJSON(records),null,2)],{type:'application/geo+json'});
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `zoo-survey-drafts-${new Date().toISOString().slice(0,10)}.geojson`;
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
      message('GeoJSON export requested. It contains saved draft coordinates and notes; unfinished vertices are excluded. Share only after reviewing its contents.');
    });
    get('import').addEventListener('change',async event => {
      const file = event.target.files[0];
      try {
        if (!file) return;
        if (file.size > 500000) throw new Error('File is too large (maximum 500 KB).');
        const incoming = model.importGeoJSON(JSON.parse(await file.text()),ring);
        const ids = new Set(records.map(r=>r.id));
        const additions = incoming.filter(record=>!ids.has(record.id));
        if (records.length + additions.length > model.MAX_RECORDS) throw new Error('Import would exceed 100 drafts.');
        if ([...records,...additions].reduce((sum,r)=>sum+r.points.length,0)>model.MAX_TOTAL_POINTS) throw new Error('Import would exceed 1000 saved vertices.');
        records.push(...additions); render(); message(`Imported ${additions.length} unverified drafts; ${incoming.length-additions.length} existing IDs skipped. Approval claims are ignored.`); persist();
      } catch(error) { message(`Import failed: ${error.message}`); }
      finally { event.target.value = ''; }
    });
    try {
      const saved = localStorage.getItem(KEY);
      if(saved) { records = model.importGeoJSON(JSON.parse(saved),ring); remembering = true; get('remember').checked = true; message(`Restored ${records.length} device-local unverified drafts.`); }
    } catch { message('Device drafts could not be loaded. Import an exported backup or collect new drafts.'); }
    refreshDrawing(); render(); refreshGPS();
    return {refreshGPS};
  }};
})();
