/* v0.3: geofenced browsing with separate local survey drafts; no backend. */
(() => {
  'use strict';
  const ZOO = [39.9725, -75.1957]; // Approximate overview; sources documented in README.
  const STALE_MS = 30000;
  const ui = Object.fromEntries(['status', 'status-dot', 'message', 'accuracy', 'updated', 'tracking', 'follow', 'follow-status', 'follow-log', 'zoo', 'map-error', 'site-mode'].map(id => [id, document.getElementById(id)]));
  const status = (title, message, state = '') => {
    ui.status.textContent = title;
    ui.message.textContent = message;
    ui['status-dot'].dataset.state = state;
  };
  if (!window.L || !window.ZooBoundary || !window.ZooLocationPolicy) {
    ui['map-error'].hidden = false;
    ui['map-error'].textContent = 'Required map files could not load. Check your connection and reload this page.';
    ui.tracking.disabled = ui.zoo.disabled = true;
    status('Map unavailable', 'An internet connection is needed to load this prototype.', 'error');
    return;
  }
  const policy = window.ZooLocationPolicy.create(window.ZooBoundary.ring);
  const zooBounds = L.latLngBounds(window.ZooBoundary.ring);
  const viewBounds = zooBounds.pad(0.25);
  const map = L.map('map', { zoomControl: false, maxBounds: viewBounds, maxBoundsViscosity: 1, maxZoom: 19 }).setView(ZOO, 17);
  const overview = () => map.fitBounds(zooBounds, { padding: [20, 20], maxZoom: 17 });
  const resizeBounds = () => { map.setMinZoom(Math.min(19, map.getBoundsZoom(viewBounds))); map.panInsideBounds(viewBounds, { animate: false }); };
  overview();
  resizeBounds();
  map.on('resize', resizeBounds);
  L.polygon(window.ZooBoundary.ring, { color: '#47664c', weight: 2, dashArray: '6 5', fill: false, interactive: false }).addTo(map);
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
  let eligible = false, readingTime = null;
  let survey = null;
  const followEvents = [];
  let followState = '', followReason = 'initial';
  const reliableForCamera = () => active && eligible && position && !document.hidden && Date.now() - position.timestamp <= STALE_MS;
  const refreshFollow = reason => {
    const state = !active ? 'off' : !following ? 'paused' : reliableForCamera() ? 'following' : 'waiting';
    if (state !== followState || (reason && reason !== followReason)) {
      followReason = reason || followReason;
      followEvents.push({ time: Date.now(), state, reason: followReason });
      if (followEvents.length > 30) followEvents.shift();
      followState = state;
    }
    ui.follow.disabled = !active;
    ui.follow.setAttribute('aria-pressed', String(following));
    ui.follow.textContent = state === 'following' ? 'Following you' : state === 'waiting' ? 'Follow on · waiting' : 'Follow me';
    if (ui['follow-status']) ui['follow-status'].textContent = {
      off: 'Following is off. Start live GPS, then tap Follow me.',
      paused: 'Following paused · tap Follow me to resume.',
      following: 'Following is active.',
      waiting: 'Following is on · waiting for a reliable on-site fix. It will resume automatically.'
    }[state];
    if (ui['follow-log']) ui['follow-log'].textContent = followEvents.map(event => `${event.time}  ${event.state}  ${event.reason}`).join('\n');
  };
  const setFollow = (value, reason) => {
    following = value;
    refreshFollow(reason);
  };
  const suspend = (mode = 'Location uncertain · exploring the Zoo', reason = 'gps-uncertain') => {
    eligible = false;
    refreshFollow(reason);
    ui['site-mode'].textContent = mode;
    if (dot) dot.setStyle({ opacity: 0.45, fillOpacity: 0.35 });
    if (circle) circle.setStyle({ opacity: 0.25, fillOpacity: 0.04 });
    survey?.refreshGPS();
  };
  const renderAge = () => {
    refreshFollow();
    survey?.refreshGPS();
    if (readingTime === null) return;
    const age = Math.max(0, Date.now() - readingTime);
    ui.updated.textContent = age < 1000 ? 'Just now' : `${Math.floor(age / 1000)}s ago`;
    const stale = age > STALE_MS;
    if (active && stale) {
      policy.uncertain('stale');
      suspend(undefined, 'gps-stale');
      if (!lastError) status('Location is stale', 'No fresh fix for 30 seconds. Following is paused; any faded dot is the last accepted position. Keep this page visible.', 'warning');
    }
  };
  const stop = () => {
    active = false;
    generation++;
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    policy.reset();
    setFollow(false, 'gps-stopped');
    suspend('Explore mode · location not checked', 'gps-stopped');
    ui.tracking.textContent = 'Start live GPS';
    if (dot) map.removeLayer(dot);
    if (circle) map.removeLayer(circle);
    dot = circle = position = null;
    readingTime = null;
    ui.accuracy.textContent = ui.updated.textContent = '—';
  };
  const onPosition = fix => {
    const result = policy.inspect(fix, Date.now());
    if (result.ignored) { refreshFollow('gps-old-fix-ignored'); return; }
    const accuracy = fix?.coords?.accuracy;
    lastError = false;
    if (Number.isFinite(accuracy) && accuracy > 0) ui.accuracy.textContent = `± ${Math.round(accuracy)} m`;
    if (!['invalid', 'stale', 'out-of-order', 'jump'].includes(result.reason)) {
      readingTime = fix.timestamp;
      ui.updated.textContent = `${Math.max(0, Math.floor((Date.now() - readingTime) / 1000))}s ago`;
    }
    if (!result.usable) {
      suspend(result.mode === 'off-site' ? 'Off-site mode · explore the Zoo remotely' : undefined, `gps-${result.reason}`);
      if (result.mode === 'off-site') {
        if (dot) map.removeLayer(dot);
        if (circle) map.removeLayer(circle);
        dot = circle = position = null;
        ui.updated.textContent = 'Just now';
        status('You appear to be off-site', 'The map stays at the Zoo. Live GPS keeps checking for your arrival; following is available only clearly inside the approximate boundary.');
      } else {
        const messages = {
          invalid: ['Invalid location fix', 'The phone returned invalid coordinates, accuracy, or time. Waiting for a reliable fix.'],
          stale: ['Location is stale', 'The phone returned an old fix. Waiting for a fresh update.'],
          accuracy: ['GPS accuracy is too low', 'Reported accuracy exceeds 50 m. Following is paused; try an open area.'],
          'out-of-order': ['Waiting for a newer fix', 'This fix is duplicated or out of order. Following is paused.'],
          jump: ['GPS jump ignored', 'This position moved unexpectedly. Following is paused while we wait for reliable updates.'],
          boundary: ['Near the Zoo boundary', 'The accuracy circle overlaps the approximate perimeter. We cannot confirm whether you are inside.'],
          confirming: ['Confirming your location', 'Waiting for a second reliable fix before confirming on-site or off-site mode.']
        };
        status(...messages[result.reason], 'warning');
      }
      return;
    }
    position = { latlng: result.latlng, timestamp: result.timestamp, accuracy: result.accuracy };
    eligible = true;
    if (!dot) {
      circle = L.circle(position.latlng, { radius: accuracy, color: '#2472de', weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
      dot = L.circleMarker(position.latlng, { radius: 8, color: '#fff', weight: 3, fillColor: '#2472de', fillOpacity: 1, className: 'user-location' }).addTo(map).bindPopup('Your phone’s reported position');
    } else {
      dot.setLatLng(position.latlng);
      circle.setLatLng(position.latlng).setRadius(accuracy);
    }
    ui.accuracy.textContent = `± ${Math.round(accuracy)} m`;
    refreshFollow('gps-ready');
    ui['site-mode'].textContent = 'On-site mode · approximate boundary check';
    dot.setStyle({ opacity: 1, fillOpacity: 1 });
    circle.setStyle({ opacity: 0.6, fillOpacity: 0.12 });
    status('Live GPS · on-site', 'Your position updates as you walk. Dragging pauses following; brief GPS uncertainty waits and resumes automatically.', 'live');
    if (following && reliableForCamera()) map.setView(position.latlng, map.getZoom(), { animate: false });
    renderAge();
  };
  const onError = error => {
    lastError = true;
    policy.uncertain('error');
    suspend(undefined, error.code === 3 ? 'gps-timeout' : error.code === 1 ? 'gps-denied' : 'gps-unavailable');
    if (error.code === 1) {
      stop();
      status('Location permission denied', 'Enable location for this site in browser settings and check your phone’s Location Services, then tap Start live GPS again.', 'error');
    } else {
      status(error.code === 3 ? 'Waiting for a GPS fix' : 'Location unavailable', error.code === 3 ? 'The location request timed out. Tracking is still trying; move to an open area or stop and retry.' : 'Check Location Services and signal. Tracking is still trying; any visible marker is the last known position.', 'warning');
    }
  };
  const startWatch = () => {
    const token = ++generation;
    try {
      const id = navigator.geolocation.watchPosition(fix => { if (active && token === generation) onPosition(fix); }, error => { if (active && token === generation) onError(error); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
      if (active && token === generation) watchId = id;
      else navigator.geolocation.clearWatch(id);
    } catch {
      stop(); status('Location could not start', 'Check site permissions and try again. The map remains available.', 'error');
    }
  };
  ui.tracking.addEventListener('click', () => {
    if (active) { stop(); status('Tracking stopped', 'Your location has been cleared. You can continue exploring the map.'); return; }
    if (!window.isSecureContext) { status('Secure connection required', 'Open the HTTPS GitHub Pages address to use GPS. Localhost also works for development.', 'error'); return; }
    if (!navigator.geolocation) { status('GPS is not supported', 'Try Safari or Chrome on your phone. You can still explore the map.', 'error'); return; }
    active = true;
    lastError = false;
    setFollow(false, 'gps-started');
    ui.tracking.textContent = 'Stop GPS';
    status('Finding your location', 'Allow location access when prompted. The first fix may take a little time.', 'warning');
    startWatch();
  });
  ui.follow.addEventListener('click', () => {
    if (!active) return;
    setFollow(!following, following ? 'user-off' : 'user-on');
    if (following && reliableForCamera()) map.setView(position.latlng, map.getZoom(), { animate: false });
  });
  // Leaflet dragstart is a real drag, unlike movestart from setView/panTo.
  map.on('dragstart', () => setFollow(false, 'user-drag'));
  map.on('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.originalEvent?.key)) setFollow(false, 'user-keyboard-pan');
  });
  map.on('surveystart', () => setFollow(false, 'survey-mode'));
  ui.zoo.addEventListener('click', () => { setFollow(false, 'zoo-overview'); overview(); });
  let timer = setInterval(renderAge, 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active) {
      policy.uncertain('background'); suspend(undefined, 'background');
      status('GPS waiting', 'The page is in the background. Your following choice is retained; reliable updates are needed before recentering.', 'warning');
    }
    else {
      map.invalidateSize(); renderAge();
      if (following && reliableForCamera()) map.setView(position.latlng, map.getZoom(), { animate: false });
    }
  });
  window.addEventListener('pagehide', event => {
    if (event.persisted && active) {
      // BFCache navigation suspends the watcher but retains the user's intent.
      generation++;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      watchId = null;
      policy.uncertain('background'); suspend(undefined, 'page-suspended');
    } else stop();
    clearInterval(timer);
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    timer = setInterval(renderAge, 1000);
    map.invalidateSize(); renderAge();
    if (active) startWatch();
  });
  refreshFollow('initial');
  if (window.ZooSurvey && window.ZooSurveyModel) {
    survey = window.ZooSurvey.mount(map, () => active && eligible ? position : null, window.ZooBoundary.ring);
  } else {
    const notice = document.getElementById('survey-message');
    if (notice) notice.textContent = 'Survey Mode files could not load. Check your connection and reload.';
  }
})();
