const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup({ secure = true, supported = true, leaflet = true } = {}) {
  const elements = {};
  for (const id of ['status','status-dot','message','accuracy','updated','tracking','follow','zoo','map-error','site-mode']) elements[id] = { textContent: '', dataset: {}, disabled: id === 'follow', hidden: true, events: {}, addEventListener(event, fn) { this.events[event] = fn; }, setAttribute(key, value) { this[key] = value; } };
  let success, failure, tick, now = 100000, mapOptions;
  const cleared = [], removed = [], views = [], mapEvents = {}, layers = [], documentEvents = {};
  const map = { setView(point, zoom) { views.push({ point, zoom }); return this; }, fitBounds() { views.push({overview:true}); return this; }, setMinZoom(value) { this.minZoom = value; }, getBoundsZoom() { return 16; }, panInsideBounds() {}, getZoom() { return 18; }, on(event, fn) { mapEvents[event] = fn; }, removeLayer(layer) { removed.push(layer); }, invalidateSize() {} };
  const layer = (point, options) => { const item = { point, options, addTo() { layers.push(this); return this; }, bindPopup() { return this; }, on() { return this; }, setLatLng(value) { this.point = value; return this; }, setRadius(value) { this.options.radius = value; return this; }, setStyle(value) { Object.assign(this.options, value); } }; return item; };
  const geo = { watchPosition(ok, fail, options) { success = ok; failure = fail; assert.equal(options.enableHighAccuracy, true); return 0; }, clearWatch(id) { cleared.push(id); } };
  const requireBoundary = require('../zoo-boundary'); const requirePolicy = require('../location-policy');
  const context = { window: { L: leaflet, ZooBoundary: requireBoundary, ZooLocationPolicy: requirePolicy, isSecureContext: secure, addEventListener() {} }, L: { map: (id, options) => { mapOptions=options; return map; }, latLngBounds: () => ({pad:()=>({})}), polygon: layer, control: { zoom: () => layer(), scale: () => layer() }, tileLayer: () => layer(), circle: layer, circleMarker: layer }, navigator: { geolocation: supported ? geo : undefined }, document: { hidden:false, getElementById: id => elements[id], addEventListener(event, fn) { documentEvents[event]=fn; } }, Date: { now: () => now }, setInterval: fn => { tick = fn; return 1; }, clearInterval() {} };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8'), context);
  return { elements, cleared, removed, views, mapEvents, layers, map, mapOptions, hide: () => { context.document.hidden=true; documentEvents.visibilitychange(); }, click: id => elements[id].events.click(), fix: (accuracy = 8, timestamp = now, point = [39.973, -75.196]) => success({ coords: { latitude: point[0], longitude: point[1], accuracy }, timestamp }), fail: code => failure({ code }), advance: ms => { now += ms; tick(); } };
}
function arrive(app) { app.click('tracking'); app.fix(); app.advance(1000); app.fix(); }
test('on-site updates, follow pause, recenter, and clear watch ID zero', () => {
 const app=setup(); arrive(app); assert.equal(app.elements.accuracy.textContent,'± 8 m'); assert.equal(app.elements.follow.disabled,false);
 app.click('follow'); const count=app.views.length; app.mapEvents.dragstart(); app.advance(1000); app.fix(22); assert.equal(app.views.length,count);
 app.click('follow'); assert.equal(app.views.length,count+1); app.click('zoo'); assert.equal(app.elements.follow['aria-pressed'],'false');
 app.click('tracking'); assert.deepEqual(app.cleared,[0]); assert.equal(app.removed.length,2); app.fix(); assert.equal(app.elements.accuracy.textContent,'—');
});
test('off-site fixes do not recenter and stale off-site state becomes uncertain',()=>{
 const app=setup(); const count=app.views.length; app.click('tracking'); app.fix(8,100000,[40.1,-75.3]); app.advance(1000); app.fix(8,101000,[40.1,-75.3]);
 assert.match(app.elements['site-mode'].textContent,/Off-site/); assert.equal(app.elements.follow.disabled,true); assert.equal(app.views.length,count);
 app.advance(31000); assert.match(app.elements.status.textContent,/stale/);
});
test('permission denial cleanup, late callback protection and retry',()=>{
 const app=setup(); arrive(app); app.fail(1); assert.match(app.elements.status.textContent,/denied/); assert.deepEqual(app.cleared,[0]); app.fix(); assert.equal(app.elements.accuracy.textContent,'—'); arrive(app); assert.equal(app.elements.follow.disabled,false);
});
test('transient errors pause following and two good fixes recover',()=>{
 const app=setup(); arrive(app); app.click('follow'); app.fail(3); assert.match(app.elements.status.textContent,/Waiting/); assert.equal(app.elements.follow.disabled,true);
 app.fail(2); assert.match(app.elements.status.textContent,/unavailable/); app.advance(1000); app.fix(); app.advance(1000); app.fix(); assert.equal(app.elements.follow.disabled,false);
});
test('stale, low accuracy, invalid and jumped fixes suspend following',()=>{
 const app=setup(); arrive(app); app.click('follow'); app.advance(31000); assert.match(app.elements.status.textContent,/stale/); assert.equal(app.elements.follow.disabled,true);
 app.fix(); app.advance(1000); app.fix(); assert.equal(app.elements.follow.disabled,false); app.advance(1000); app.fix(1000); assert.match(app.elements.status.textContent,/too low/);
 app.advance(1000); app.fix(8,134000,[40.1,-75.3]); assert.match(app.elements.status.textContent,/jump/); app.fix(NaN); assert.match(app.elements.status.textContent,/Invalid/);
});
test('insecure context, unsupported GPS and library failure have usable errors',()=>{
 const a=setup({secure:false}); a.click('tracking'); assert.match(a.elements.status.textContent,/Secure/);
 const b=setup({supported:false}); b.click('tracking'); assert.match(b.elements.status.textContent,/not supported/);
 const c=setup({leaflet:false}); assert.equal(c.elements.tracking.disabled,true); assert.equal(c.elements['map-error'].hidden,false);
});

test('map bounds, resize zoom and background pause are applied',()=>{
 const app=setup(); assert.equal(app.mapOptions.maxBoundsViscosity,1); assert.ok(app.mapOptions.maxBounds); assert.equal(app.mapOptions.maxZoom,19); assert.equal(app.map.minZoom,16);
 arrive(app); app.click('follow'); app.hide(); assert.equal(app.elements.follow.disabled,true); assert.match(app.elements.status.textContent,/paused/);
 app.advance(1000); app.fix(); app.advance(1000); app.fix(); assert.equal(app.elements.follow.disabled,false); assert.equal(app.elements.follow['aria-pressed'],'false');
});
