const {test} = require('node:test');
const assert = require('node:assert/strict');
const model = require('../survey-model');
const ring = require('../zoo-boundary').ring;
const manual = (lat=39.973,lng=-75.196) => ({lat,lng,source:'manual-map',capturedAt:new Date().toISOString(),accuracy:null});
const input = (kind='landmark',points=[manual()]) => ({kind,points,name:'Test observation',domain:'Garden Services / Facilities',notes:'Unverified test',attributes:{surface:'unknown',stairs:'unknown'}});
test('manual draft carries source, review requests and unknown attributes',()=>{
 const draft=model.createDraft(input(),ring);
 assert.equal(draft.status,'draft'); assert.equal(draft.validation,'unverified'); assert.equal(draft.identityVerified,false);
 assert.deepEqual(draft.requestedReviews,['Garden Services / Facilities','Map Approver']); assert.equal(draft.attributes.stairs,'unknown');
 const feature=model.toGeoJSON([draft]).features[0]; assert.deepEqual(feature.geometry,{type:'Point',coordinates:[-75.196,39.973]});
});
test('path and polygon serialize correctly with closed polygon ring',()=>{
 const points=[manual(),manual(39.9732,-75.196),manual(39.9732,-75.1958)];
 const path=model.toGeoJSON([model.createDraft(input('pathway',points.slice(0,2)),ring)]).features[0]; assert.equal(path.geometry.type,'LineString');
 const zone=model.toGeoJSON([model.createDraft(input('viewing-zone',points),ring)]).features[0]; assert.equal(zone.geometry.type,'Polygon');
 assert.deepEqual(zone.geometry.coordinates[0][0],zone.geometry.coordinates[0].at(-1)); assert.equal(zone.geometry.coordinates[0].length,4);
});
test('offsite coordinates, malformed evidence and poor/stale GPS are rejected',()=>{
 assert.throws(()=>model.createDraft(input('landmark',[manual(40,-75)]),ring),/inside/);
 assert.throws(()=>model.createDraft(input('landmark',[{...manual(),source:'verified'}]),ring),/source/);
 const good={...manual(),source:'gps',accuracy:10,fixTimestamp:Date.now()};
 assert.equal(model.createDraft(input('landmark',[good]),ring).points[0].accuracy,10);
 for(const changed of [{accuracy:21},{accuracy:0},{accuracy:NaN},{fixTimestamp:Date.now()-40000}]) assert.throws(()=>model.createDraft(input('landmark',[{...good,...changed}]),ring),/fresh/);
});
test('geometry counts, duplicate vertices and crossing/flat zones are rejected',()=>{
 assert.throws(()=>model.createDraft(input('landmark',[]),ring),/one point/);
 assert.throws(()=>model.createDraft(input('pathway',[manual()]),ring),/at least/);
 assert.throws(()=>model.createDraft(input('pathway',[manual(),manual()]),ring),/repeated/);
 assert.throws(()=>model.createDraft(input('viewing-zone',[manual(),manual(39.9731,-75.196),manual(39.9732,-75.196)]),ring),/area/);
 assert.throws(()=>model.createDraft(input('viewing-zone',[manual(),manual(39.9732,-75.1958),manual(39.973,-75.1958),manual(39.9732,-75.196)]),ring));
});
test('imports roundtrip, preserve IDs, strip authority claims and reject tampering',()=>{
 const original=model.createDraft(input(),ring); const exportData=model.toGeoJSON([original]);
 exportData.features[0].properties.status='published'; exportData.features[0].properties.identityVerified=true;
 exportData.features[0].properties.requestedReviews=[];
 const restored=model.importGeoJSON(exportData,ring)[0]; assert.equal(restored.id,original.id); assert.equal(restored.status,'draft'); assert.equal(restored.identityVerified,false); assert.equal(restored.requestedReviews.length,2);
 exportData.features[0].geometry.coordinates[0]=-75.1; assert.throws(()=>model.importGeoJSON(exportData,ring),/match/);
});
test('invalid fields, oversized collections and duplicate IDs reject atomically',()=>{
 assert.throws(()=>model.createDraft({...input(),name:''},ring),/name/);
 assert.throws(()=>model.createDraft({...input(),domain:'administrator'},ring),/domain/);
 assert.throws(()=>model.createDraft({...input(),attributes:{stairs:'probably'}},ring),/attributes/);
 assert.throws(()=>model.importGeoJSON({type:'FeatureCollection',surveySchemaVersion:1,features:Array(101).fill({})},ring),/100/);
 const one=model.toGeoJSON([model.createDraft(input(),ring)]); one.features.push(one.features[0]); assert.throws(()=>model.importGeoJSON(one,ring),/Duplicate/);
});
