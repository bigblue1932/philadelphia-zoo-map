/* Pure location policy: provisional thresholds, no persistence or networking. */
(function(root) {
  'use strict';
  const DEFAULTS = Object.freeze({ maxAccuracy: 50, staleMs: 30000, edgeBuffer: 10, confirmationMs: 1000, confirmationWindowMs: 15000, maxSpeed: 15, jumpFloor: 100 });
  const radians = value => value * Math.PI / 180;
  function distance(a, b) {
    const lat = radians(b[0] - a[0]), lon = radians(b[1] - a[1]);
    const h = Math.sin(lat / 2) ** 2 + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(lon / 2) ** 2;
    return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  function contains(point, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [yi, xi] = ring[i], [yj, xj] = ring[j];
      if ((yi > point[0]) !== (yj > point[0]) && point[1] < (xj - xi) * (point[0] - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function edgeDistance(point, ring) {
    // Local tangent-plane distances are adequate for this small Zoo perimeter.
    const project = p => [(p[1] - point[1]) * 111195 * Math.cos(radians(point[0])), (p[0] - point[0]) * 111195];
    let minimum = Infinity;
    for (let i = 1; i < ring.length; i++) {
      const a = project(ring[i - 1]), b = project(ring[i]);
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const denominator = dx * dx + dy * dy;
      const t = denominator ? Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dy) / denominator)) : 0;
      minimum = Math.min(minimum, Math.hypot(a[0] + t * dx, a[1] + t * dy));
    }
    return minimum;
  }
  function create(ring, overrides = {}) {
    const options = { ...DEFAULTS, ...overrides };
    let previous = null, pending = null, mode = 'unknown';
    const reset = () => { previous = pending = null; mode = 'unknown'; };
    const uncertain = reason => { pending = null; mode = 'uncertain'; return { mode, reason, usable: false }; };
    function inspect(fix, now) {
      const coords = fix?.coords || {};
      const { latitude, longitude, accuracy } = coords;
      const timestamp = fix?.timestamp;
      if (![latitude, longitude, accuracy, timestamp].every(Number.isFinite) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || accuracy <= 0 || timestamp < 0 || timestamp > now + 1000) return uncertain('invalid');
      // Delayed/duplicate callbacks must not revoke a newer reliable fix.
      if (previous && timestamp <= previous.timestamp) return { mode, reason: 'out-of-order', usable: false, ignored: true };
      if (now - timestamp > options.staleMs) return uncertain('stale');
      if (accuracy > options.maxAccuracy) return uncertain('accuracy');
      const latlng = [latitude, longitude];
      if (previous && timestamp - previous.timestamp <= options.staleMs && distance(previous.latlng, latlng) > Math.max(options.jumpFloor, options.maxSpeed * (timestamp - previous.timestamp) / 1000 + previous.accuracy + accuracy)) return uncertain('jump');
      if (previous && timestamp - previous.timestamp > options.staleMs) { mode = 'uncertain'; pending = null; }
      previous = { latlng, timestamp, accuracy };
      const edge = edgeDistance(latlng, ring);
      if (edge <= accuracy + options.edgeBuffer) return uncertain('boundary');
      const candidate = contains(latlng, ring) ? 'on-site' : 'off-site';
      if (mode !== candidate) {
        if (!pending || pending.mode !== candidate || timestamp - pending.timestamp > options.confirmationWindowMs) {
          pending = { mode: candidate, timestamp };
          mode = 'uncertain';
          return { mode, reason: 'confirming', usable: false };
        }
        if (timestamp - pending.timestamp < options.confirmationMs) return { mode: 'uncertain', reason: 'confirming', usable: false };
      }
      mode = candidate;
      pending = null;
      return { mode, reason: candidate, usable: candidate === 'on-site', latlng, timestamp, accuracy };
    }
    return { inspect, reset, uncertain, options };
  }
  const api = { DEFAULTS, distance, contains, edgeDistance, create };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZooLocationPolicy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
