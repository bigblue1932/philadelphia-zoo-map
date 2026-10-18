const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup({ secure = true, supported = true, leaflet = true, survey = false } = {}) {
  const elements = {};
  for (const id of ['status','status-dot','message','accuracy','updated','tracking','follow','follow-status','follow-log','zoo','map-error','site-mode']) elements[id] = { textContent: '', dataset: {}, disabled: id === 'follow', hidden: true, events: {}, addEventListener(event, fn) { this.events[event] = fn; }, setAttribute(key, value) { this[key] = value; } };
  let success, failure, tick, now = 100000, mapOptions, surveyGetter;
  const cleared = [], removed = [], views = [], mapEvents = {}, layers = [], documentEvents = {}, windowEvents = {}, callbacks = [];
  const map = { setView(point, zoom) { views.push({ point, zoom }); mapEvents.movestart?.({}); return this; }, fitBounds() { views.push({overview:true}); return this; }, setMinZoom(value) { this.minZoom = value; }, getBoundsZoom() { return 16; }, panInsideBounds() {}, getZoom() { return 18; }, on(event, fn) { mapEvents[event] = fn; }, removeLayer(layer) { removed.push(layer); }, invalidateSize() {} };
  const layer = (point, options) => { const item = { point, options, addTo() { layers.push(this); return this; }, bindPopup() { return this; }, on() { return this; }, setLatLng(value) { this.point = value; return this; }, setRadius(value) { this.options.radius = value; return this; }, setStyle(value) { Object.assign(this.options, value); } }; return item; };
  const geo = { watchPosition(ok, fail, options) { success = ok; failure = fail; callbacks.push({ok,fail}); assert.equal(options.enableHighAccuracy, true); return 0; }, clearWatch(id) { cleared.push(id); } };
  const requireBoundary = require('../zoo-boundary'); const requirePolicy = require('../location-policy');
  const context = { window: { ZooSurveyModel:survey?{}:undefined, ZooSurvey:survey?{mount(map,getFix){surveyGetter=getFix;return {refreshGPS(){}};}}:undefined, L: leaflet, ZooBoundary: requireBoundary, ZooLocationPolicy: requirePolicy, isSecureContext: secure, addEventListener(event, fn) {windowEvents[event]=fn;} }, L: { map: (id, options) => { mapOptions=options; return map; }, latLngBounds: () => ({pad:()=>({})}), polygon: layer, control: { zoom: () => layer(), scale: () => layer() }, tileLayer: () => layer(), circle: layer, circleMarker: layer }, navigator: { geolocation: supported ? geo : undefined }, document: { hidden:false, getElementById: id => elements[id], addEventListener(event, fn) { documentEvents[event]=fn; } }, Date: { now: () => now }, setInterval: fn => { tick = fn; return 1; }, clearInterval() {} };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8'), context);
  return { surveyFix:()=>surveyGetter?.(), elements, cleared, removed, views, mapEvents, layers, map, mapOptions, callbacks, show: () => {context.document.hidden=false;documentEvents.visibilitychange();}, pageHide: persisted => windowEvents.pagehide({persisted}), pageShow: persisted => windowEvents.pageshow({persisted}), hide: () => { context.document.hidden=true; documentEvents.visibilitychange(); }, click: id => elements[id].events.click(), fix: (accuracy = 8, timestamp = now, point = [39.973, -75.196]) => success({ coords: { latitude: point[0], longitude: point[1], accuracy }, timestamp }), fail: code => failure({ code }), advance: ms => { now += ms; tick(); } };
}
function arrive(app) { app.click('tracking'); app.fix(); app.advance(1000); app.fix(); }
test('on-site updates, follow pause, recenter, and clear watch ID zero', () => {
 const app=setup(); arrive(app); assert.equal(app.elements.accuracy.textContent,'± 8 m'); assert.equal(app.elements.follow.disabled,false);
 app.click('follow'); const count=app.views.length; app.mapEvents.dragstart(); app.advance(1000); app.fix(22); assert.equal(app.views.length,count);
 app.click('follow'); assert.equal(app.views.length,count+1); app.click('zoo'); assert.equal(app.elements.follow['aria-pressed'],'false');
 app.click('tracking'); assert.deepEqual(app.cleared,[0]); assert.equal(app.removed.length,2); app.fix(); assert.equal(app.elements.accuracy.textContent,'—');
});
test('off-site never recenters; follow intent waits while control stays usable',()=>{
 const app=setup(); const count=app.views.length; app.click('tracking'); app.click('follow'); app.fix(8,100000,[40.1,-75.3]); app.advance(1000); app.fix(8,101000,[40.1,-75.3]);
 assert.match(app.elements['site-mode'].textContent,/Off-site/); assert.equal(app.elements.follow.disabled,false); assert.equal(app.elements.follow['aria-pressed'],'true'); assert.equal(app.views.length,count);
 app.advance(31000); assert.match(app.elements.status.textContent,/stale/); assert.match(app.elements['follow-status'].textContent,/waiting/); app.click('follow'); assert.equal(app.elements.follow['aria-pressed'],'false');
});
test('permission denial clears tracking intent and late callbacks; retry works',()=>{
 const app=setup(); arrive(app); app.click('follow'); app.fail(1); assert.match(app.elements.status.textContent,/denied/); assert.deepEqual(app.cleared,[0]); assert.equal(app.elements.follow.disabled,true); assert.equal(app.elements.follow['aria-pressed'],'false'); app.fix(); assert.equal(app.elements.accuracy.textContent,'—'); arrive(app); assert.equal(app.elements.follow.disabled,false);
});
test('temporary errors keep intent and automatically resume after reliable fixes',()=>{
 const app=setup(); arrive(app); app.click('follow'); const count=app.views.length; app.fail(3); assert.match(app.elements.status.textContent,/Waiting/); assert.equal(app.elements.follow.disabled,false); assert.equal(app.elements.follow['aria-pressed'],'true');
 app.fail(2); assert.match(app.elements.status.textContent,/unavailable/); app.advance(1000); app.fix(); assert.equal(app.views.length,count); app.advance(1000); app.fix(); assert.equal(app.views.length,count+1); assert.match(app.elements['follow-status'].textContent,/active/);
});
test('stale and bad fixes never recenter but preserve follow preference',()=>{
 const app=setup(); arrive(app); app.click('follow'); const count=app.views.length; app.advance(31000); assert.match(app.elements.status.textContent,/stale/); assert.equal(app.elements.follow.disabled,false); assert.equal(app.elements.follow['aria-pressed'],'true');
 app.fix(); assert.equal(app.views.length,count); app.advance(1000); app.fix(); assert.equal(app.views.length,count+1); app.advance(1000); app.fix(1000); assert.match(app.elements.status.textContent,/too low/);
 const pausedCount=app.views.length; app.advance(1000); app.fix(8,134000,[40.1,-75.3]); assert.match(app.elements.status.textContent,/jump/); app.fix(NaN); assert.match(app.elements.status.textContent,/Invalid/); assert.equal(app.views.length,pausedCount); assert.equal(app.elements.follow['aria-pressed'],'true');
});
test('insecure context, unsupported GPS and library failure have usable errors',()=>{
 const a=setup({secure:false}); a.click('tracking'); assert.match(a.elements.status.textContent,/Secure/);
 const b=setup({supported:false}); b.click('tracking'); assert.match(b.elements.status.textContent,/not supported/);
 const c=setup({leaflet:false}); assert.equal(c.elements.tracking.disabled,true); assert.equal(c.elements['map-error'].hidden,false);
});
test('map bounds unchanged; foreground automatically recovers retained preference',()=>{
 const app=setup(); assert.equal(app.mapOptions.maxBoundsViscosity,1); assert.ok(app.mapOptions.maxBounds); assert.equal(app.mapOptions.maxZoom,19); assert.equal(app.map.minZoom,16);
 arrive(app); app.click('follow'); const count=app.views.length; app.hide(); assert.equal(app.elements.follow.disabled,false); assert.equal(app.elements.follow['aria-pressed'],'true'); assert.match(app.elements['follow-status'].textContent,/waiting/);
 app.advance(1000); app.fix(); app.advance(1000); app.fix(); assert.equal(app.views.length,count); app.show(); assert.equal(app.views.length,count+1); assert.match(app.elements['follow-status'].textContent,/active/);
});
test('Follow Me can be requested before first fix and resumes without another tap',()=>{
 const app=setup(); app.click('tracking'); assert.equal(app.elements.follow.disabled,false); app.click('follow'); const count=app.views.length; app.fix(); assert.equal(app.views.length,count); app.advance(1000); app.fix(); assert.equal(app.views.length,count+1);
});
test('programmatic camera movement and taps preserve follow; explicit gestures pause it',()=>{
 const app=setup(); arrive(app); app.click('follow'); app.mapEvents.click?.({}); app.mapEvents.movestart?.({}); assert.equal(app.elements.follow['aria-pressed'],'true');
 const count=app.views.length; for(let i=0;i<30;i++){app.advance(2000);app.fix(10,undefined,[39.973+i*0.000001,-75.196]);} assert.equal(app.views.length,count+30); assert.equal(app.elements.follow['aria-pressed'],'true');
 app.mapEvents.dragstart(); assert.equal(app.elements.follow['aria-pressed'],'false'); assert.equal(app.elements.follow.disabled,false); app.click('follow'); assert.equal(app.elements.follow['aria-pressed'],'true');
 app.mapEvents.keydown({originalEvent:{key:'ArrowRight'}}); assert.equal(app.elements.follow['aria-pressed'],'false'); app.click('follow'); app.mapEvents.surveystart(); assert.equal(app.elements.follow['aria-pressed'],'false');
});
test('duplicate and delayed fixes cannot revoke fresh reliable following',()=>{
 const app=setup(); arrive(app); app.click('follow'); const count=app.views.length; app.fix(8,100000); app.fix(8,101000); assert.equal(app.views.length,count); assert.equal(app.elements.follow['aria-pressed'],'true'); assert.match(app.elements['follow-status'].textContent,/active/);
 app.advance(1000); app.fix(); assert.equal(app.views.length,count+1);
});
test('BFCache suspends and restarts watcher without losing preference or accepting old callbacks',()=>{
 const app=setup(); arrive(app); app.click('follow'); const count=app.views.length; app.pageHide(true); assert.deepEqual(app.cleared,[0]); assert.equal(app.elements.follow['aria-pressed'],'true');
 app.pageShow(true); assert.equal(app.callbacks.length,2); app.callbacks[0].fail({code:1}); assert.equal(app.elements.follow['aria-pressed'],'true'); app.advance(1000); app.fix(); app.advance(1000); app.fix(); assert.equal(app.views.length,count+1);
 app.pageHide(false); assert.equal(app.elements.follow.disabled,true);
});
test('state diagnostics are bounded and contain no location coordinates',()=>{
 const app=setup(); arrive(app); for(let i=0;i<40;i++) app.click('follow'); const log=app.elements['follow-log'].textContent; assert.ok(log.split('\n').length<=30); assert.match(log,/user-on/); assert.doesNotMatch(log,/39\.973|-75\.196|latitude|longitude/);
});

test('retained follow intent never bypasses Survey Mode accepted-fix eligibility',()=>{
 const app=setup({survey:true}); arrive(app); app.click('follow'); assert.equal(app.surveyFix().accuracy,8);
 app.advance(1000); app.fix(80); assert.equal(app.elements.follow['aria-pressed'],'true'); assert.equal(app.surveyFix(),null);
 app.advance(1000); app.fix(); assert.equal(app.surveyFix(),null); app.advance(1000); app.fix(); assert.equal(app.surveyFix().accuracy,8); app.click('tracking'); assert.equal(app.surveyFix(),null);
});
