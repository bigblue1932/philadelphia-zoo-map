/* v0.1: no backend, persistence, or location trace. */
(() => {
  'use strict';
  const ZOO = [39.9725, -75.1957]; // Approximate overview; sources documented in README.
  const STALE_MS = 30000;
  const ui = Object.fromEntries(['status', 'status-dot', 'message', 'accuracy', 'updated', 'tracking', 'follow', 'zoo', 'map-error'].map(id => [id, document.getElementById(id)]));
  const status = (title, message, state = '') => {
    ui.status.textContent = title;
    ui.message.textContent = message;
    ui['status-dot'].dataset.state = state;
  };
  if (!window.L) {
    ui['map-error'].hidden = false;
    ui['map-error'].textContent = 'The map library could not load. Check your connection and reload this page.';
    ui.tracking.disabled = ui.zoo.disabled = true;
    status('Map unavailable', 'An internet connection is needed to load this prototype.', 'error');
    return;
  }
  const map = L.map('map', { zoomControl: false }).setView(ZOO, 17);
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  tiles.on('tileerror', () => {
    ui['map-error'].textContent = 'Some map tiles could not load. Check your connection; pan or zoom to retry.';
    ui['map-error'].hidden = false;
  });
  tiles.on('loading', () => { ui['map-error'].hidden = true; });
  let watchId = null, generation = 0, active = false, following = false, position = null, dot = null, circle = null, lastError = false;
  const setFollow = value => {
    following = value;
    ui.follow.setAttribute('aria-pressed', String(value));
    ui.follow.textContent = value ? 'Following you' : 'Follow me';
  };
  const renderAge = () => {
    if (!position) return;
    const age = Math.max(0, Date.now() - position.timestamp);
    ui.updated.textContent = age < 1000 ? 'Just now' : `${Math.floor(age / 1000)}s ago`;
    const stale = age > STALE_MS;
    dot.setStyle({ opacity: stale ? 0.45 : 1, fillOpacity: stale ? 0.35 : 1 });
    circle.setStyle({ opacity: stale ? 0.25 : 0.6, fillOpacity: stale ? 0.04 : 0.12 });
    if (active && stale && !lastError) status('Location is stale', 'No fresh fix for 30 seconds. Your last position is faded; keep this page visible and check Location Services.', 'warning');
  };
  const stop = () => {
    active = false;
    generation++;
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    setFollow(false);
    ui.follow.disabled = true;
    ui.tracking.textContent = 'Start live GPS';
    if (dot) map.removeLayer(dot);
    if (circle) map.removeLayer(circle);
    dot = circle = position = null;
    ui.accuracy.textContent = ui.updated.textContent = '—';
  };
  const onPosition = fix => {
    const { latitude, longitude, accuracy } = fix.coords;
    if (![latitude, longitude, accuracy, fix.timestamp].every(Number.isFinite) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || accuracy < 0) {
      lastError = true;
      status('Invalid location fix', 'The phone returned an invalid position. Waiting for another update.', 'warning');
      return;
    }
    if (position && fix.timestamp < position.timestamp) return;
    const first = !position;
    position = { latlng: [latitude, longitude], timestamp: fix.timestamp };
    lastError = false;
    if (!dot) {
      circle = L.circle(position.latlng, { radius: accuracy, color: '#2472de', weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
      dot = L.circleMarker(position.latlng, { radius: 8, color: '#fff', weight: 3, fillColor: '#2472de', fillOpacity: 1, className: 'user-location' }).addTo(map).bindPopup('Your phone’s reported position');
    } else {
      dot.setLatLng(position.latlng);
      circle.setLatLng(position.latlng).setRadius(accuracy);
    }
    ui.accuracy.textContent = `± ${Math.round(accuracy)} m`;
    ui.follow.disabled = false;
    status(accuracy > 50 ? 'Tracking · low accuracy' : 'Live GPS tracking', accuracy > 50 ? 'The phone reports a wide accuracy radius. Try an open area and give GPS time to settle.' : 'Your position updates as you walk. Drag the map to explore; tap Follow me to recenter.', accuracy > 50 ? 'warning' : 'live');
    if (following) map.setView(position.latlng, first ? 18 : map.getZoom(), { animate: false });
    renderAge();
  };
  const onError = error => {
    lastError = true;
    if (error.code === 1) {
      stop();
      status('Location permission denied', 'Enable location for this site in browser settings and check your phone’s Location Services, then tap Start live GPS again.', 'error');
    } else {
      status(error.code === 3 ? 'Waiting for a GPS fix' : 'Location unavailable', error.code === 3 ? 'The location request timed out. Tracking is still trying; move to an open area or stop and retry.' : 'Check Location Services and signal. Tracking is still trying; any visible marker is the last known position.', 'warning');
    }
  };
  ui.tracking.addEventListener('click', () => {
    if (active) { stop(); status('Tracking stopped', 'Your location has been cleared. You can continue exploring the map.'); return; }
    if (!window.isSecureContext) { status('Secure connection required', 'Open the HTTPS GitHub Pages address to use GPS. Localhost also works for development.', 'error'); return; }
    if (!navigator.geolocation) { status('GPS is not supported', 'Try Safari or Chrome on your phone. You can still explore the map.', 'error'); return; }
    active = true;
    lastError = false;
    const token = ++generation;
    setFollow(true);
    ui.tracking.textContent = 'Stop GPS';
    status('Finding your location', 'Allow location access when prompted. The first fix may take a little time.', 'warning');
    try {
      const id = navigator.geolocation.watchPosition(fix => { if (active && token === generation) onPosition(fix); }, error => { if (active && token === generation) onError(error); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
      if (active && token === generation) watchId = id;
      else navigator.geolocation.clearWatch(id);
    } catch {
      stop(); status('Location could not start', 'Check site permissions and try again. The map remains available.', 'error');
    }
  });
  ui.follow.addEventListener('click', () => {
    setFollow(!following);
    if (following && position) map.setView(position.latlng, map.getZoom(), { animate: false });
  });
  map.on('dragstart', () => setFollow(false));
  ui.zoo.addEventListener('click', () => { setFollow(false); map.setView(ZOO, 17); });
  const timer = setInterval(renderAge, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { map.invalidateSize(); renderAge(); } });
  window.addEventListener('pagehide', () => { stop(); clearInterval(timer); });
  window.addEventListener('pageshow', event => { if (event.persisted) window.location.reload(); });
})();
