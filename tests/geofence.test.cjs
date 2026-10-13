const { test } = require('node:test');
const assert = require('node:assert/strict');
const policy = require('../location-policy');
const boundary = require('../zoo-boundary');
const ring = [[39.97,-75.20],[39.97,-75.19],[39.98,-75.19],[39.98,-75.20],[39.97,-75.20]];
const fix = (lat = 39.975, lon = -75.195, accuracy = 8, timestamp = 100000) => ({ coords: { latitude:lat, longitude:lon, accuracy }, timestamp });
test('OSM snapshot is closed and finite, and includes the Zoo', () => {
  assert.deepEqual(boundary.ring[0], boundary.ring.at(-1));
  assert.ok(boundary.ring.length > 4); assert.ok(boundary.ring.every(point => point.every(Number.isFinite)));
  assert.ok(policy.contains([39.9725,-75.1957], boundary.ring));
  assert.equal(policy.contains([40,-75],boundary.ring), false);
});
test('accuracy overlap on both sides is uncertain, including a vertex', () => {
  for (const lat of [39.9700,39.9701,39.9699]) assert.equal(policy.create(ring).inspect(fix(lat,-75.195,8),100000).reason, 'boundary');
  assert.equal(policy.create(ring).inspect(fix(39.97,-75.20),100000).reason,'boundary');
});
test('two timely fixes confirm modes; rapid duplicates cannot confirm', () => {
  for (const [lat,lon,mode] of [[39.975,-75.195,'on-site'],[40,-75,'off-site']]) {
    const gate=policy.create(ring);
    assert.equal(gate.inspect(fix(lat,lon),100000).reason,'confirming');
    assert.equal(gate.inspect(fix(lat,lon,8,100500),100500).reason,'confirming');
    assert.equal(gate.inspect(fix(lat,lon,8,101000),101000).mode,mode);
  }
  const gate=policy.create(ring); gate.inspect(fix(),100000);
  assert.equal(gate.inspect(fix(),100000).reason,'out-of-order');
  assert.equal(gate.inspect(fix(39.975,-75.195,8,101000),101000).reason,'confirming');
});
test('invalid time and accuracy protections fail closed', () => {
  for (const reading of [fix(NaN),fix(91),fix(39,-181),fix(39,-75,0),fix(39,-75,-1),fix(39,-75,Infinity),fix(39,-75,8,102000)]) assert.equal(policy.create(ring).inspect(reading,100000).reason,'invalid');
  assert.equal(policy.create(ring).inspect(fix(39,-75,51),100000).reason,'accuracy');
  assert.equal(policy.create(ring).inspect(fix(39,-75,8,69000),100000).reason,'stale');
});
test('jump rejection does not poison subsequent good fixes', () => {
  const gate=policy.create(ring); gate.inspect(fix(),100000); gate.inspect(fix(39.975,-75.195,8,101000),101000);
  assert.equal(gate.inspect(fix(40,-75,8,102000),102000).reason,'jump');
  assert.equal(gate.inspect(fix(39.975,-75.195,8,103000),103000).reason,'confirming');
  assert.equal(gate.inspect(fix(39.975,-75.195,8,104000),104000).mode,'on-site');
});
test('stale gap and reset require confirmation; departure can become off-site', () => {
  const gate=policy.create(ring); gate.inspect(fix(),100000); gate.inspect(fix(39.975,-75.195,8,101000),101000);
  gate.uncertain('stale');
  assert.equal(gate.inspect(fix(40,-75,8,140000),140000).reason,'confirming');
  assert.equal(gate.inspect(fix(40,-75,8,141000),141000).mode,'off-site');
  gate.reset(); assert.equal(gate.inspect(fix(),100000).reason,'confirming');
});

test('long gaps cannot preserve on-site status without two new fixes',()=>{
 const gate=policy.create(ring); gate.inspect(fix(),100000); gate.inspect(fix(39.975,-75.195,8,101000),101000);
 assert.equal(gate.inspect(fix(39.975,-75.195,8,140000),140000).reason,'confirming');
 assert.equal(gate.inspect(fix(39.975,-75.195,8,141000),141000).mode,'on-site');
});
