const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup({ secure = true, supported = true, leaflet = true } = {}) {
  const elements = {};
  for (const id of ['status','status-dot','message','accuracy','updated','tracking','follow','zoo','map-error']) elements[id] = { textContent: '', dataset: {}, disabled: id === 'follow', hidden: true, events: {}, addEventListener(event, fn) { this.events[event] = fn; }, setAttribute(key, value) { this[key] = value; } };
  let success, failure, tick, now = 100000;
  const cleared = [], removed = [], views = [], mapEvents = {}, layers = [];
  const map = { setView(point, zoom) { views.push({ point, zoom }); return this; }, getZoom() { return 18; }, on(event, fn) { mapEvents[event] = fn; }, removeLayer(layer) { removed.push(layer); }, invalidateSize() {} };
  const layer = (point, options) => { const item = { point, options, addTo() { layers.push(this); return this; }, bindPopup() { return this; }, on() { return this; }, setLatLng(value) { this.point = value; return this; }, setRadius(value) { this.options.radius = value; return this; }, setStyle(value) { Object.assign(this.options, value); } }; return item; };
  const geo = { watchPosition(ok, fail, options) { success = ok; failure = fail; assert.equal(options.enableHighAccuracy, true); return 0; }, clearWatch(id) { cleared.push(id); } };
  const context = { window: { L: leaflet, isSecureContext: secure, addEventListener() {} }, L: { map: () => map, control: { zoom: () => layer(), scale: () => layer() }, tileLayer: () => layer(), circle: layer, circleMarker: layer }, navigator: { geolocation: supported ? geo : undefined }, document: { getElementById: id => elements[id], addEventListener() {} }, Date: { now: () => now }, setInterval: fn => { tick = fn; return 1; }, clearInterval() {} };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8'), context);
  return { elements, cleared, removed, views, mapEvents, layers, click: id => elements[id].events.click(), fix: (accuracy = 8, timestamp = now) => success({ coords: { latitude: 39.973, longitude: -75.196, accuracy }, timestamp }), fail: code => failure({ code }), advance: ms => { now += ms; tick(); } };
}
test('live updates, accuracy radius, follow pause, recenter, and stop clear watch ID zero', () => {
  const app = setup(); app.click('tracking'); app.fix();
  assert.equal(app.elements.accuracy.textContent, '± 8 m');
  const circle = app.layers.find(layer => layer.options?.radius === 8);
  assert.ok(circle); const count = app.views.length;
  app.mapEvents.dragstart(); app.fix(22);
  assert.equal(circle.options.radius, 22); assert.equal(app.views.length, count);
  app.click('follow'); assert.equal(app.views.length, count + 1);
  app.click('zoo'); assert.equal(app.elements.follow['aria-pressed'], 'false');
  app.click('tracking'); assert.deepEqual(app.cleared, [0]); assert.equal(app.removed.length, 2);
  app.fix(); assert.equal(app.elements.accuracy.textContent, '—');
});
test('denial stops tracking and supports retry; obsolete callbacks cannot change UI', () => {
  const app = setup(); app.click('tracking'); app.fail(1);
  assert.match(app.elements.status.textContent, /denied/); assert.deepEqual(app.cleared, [0]);
  app.fix(); assert.equal(app.elements.accuracy.textContent, '—');
  app.click('tracking'); app.fix(); assert.equal(app.elements.status.textContent, 'Live GPS tracking');
});
test('timeout and unavailable position recover on next fix', () => {
  const app = setup(); app.click('tracking');
  app.fail(3); assert.match(app.elements.status.textContent, /Waiting/);
  app.fail(2); assert.match(app.elements.status.textContent, /unavailable/);
  app.fix(100); assert.match(app.elements.status.textContent, /low accuracy/);
  app.fix(5); assert.equal(app.elements.status.textContent, 'Live GPS tracking');
});
test('stale positions fade and recover; invalid fixes are rejected', () => {
  const app = setup(); app.click('tracking'); app.fix(); app.advance(31000);
  assert.match(app.elements.status.textContent, /stale/);
  app.fix(); assert.equal(app.elements.status.textContent, 'Live GPS tracking');
  app.fix(NaN); assert.match(app.elements.status.textContent, /Invalid/);
});
test('insecure context, unsupported GPS, and library failure have usable errors', () => {
  const insecure = setup({ secure: false }); insecure.click('tracking'); assert.match(insecure.elements.status.textContent, /Secure/);
  const unsupported = setup({ supported: false }); unsupported.click('tracking'); assert.match(unsupported.elements.status.textContent, /not supported/);
  const offline = setup({ leaflet: false }); assert.equal(offline.elements.tracking.disabled, true); assert.equal(offline.elements['map-error'].hidden, false);
});
