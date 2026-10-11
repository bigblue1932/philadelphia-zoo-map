# Version 0.1 — implementation and phone test

Built October 11, 2026 against repository baseline `b21bcc4`.

## Run and publish

The application is buildless: `index.html`, `styles.css`, `app.js`, and `.nojekyll` belong at the repository root. No API key, account login, or backend is needed. Leaflet 1.9.4 is pinned with integrity hashes. Internet access is required for the library and map tiles.

For desktop preview run `node tools/preview.cjs`, then open http://localhost:8080. Run controller checks with `node --test tests/location.test.cjs`.

After these files are pushed to `main`, open the repository's **Settings → Pages**. Select **Deploy from a branch**, **main**, and **/(root)**, then Save. Wait for the Pages deployment to complete. Expected address: https://bigblue1932.github.io/philadelphia-zoo-map/ (not a confirmed deployment until it responds with the prototype).

GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Phone walkthrough

1. Open the HTTPS Pages address in Safari on iPhone or Chrome on Android. Confirm v0.1, Zoo overview, and basemap attribution are visible.
2. Tap **Start live GPS**, grant location access, and wait for a blue dot and accuracy circle. Your position can be outside the Zoo; the app never substitutes a simulated location.
3. Walk with the screen awake. Confirm the marker moves, reported accuracy changes, and Last update resets. Record approximate accuracy and whether the dot matches your real surroundings.
4. Drag the map. Following pauses. Tap **Follow me** to recenter and resume following. **Zoo overview** returns to the initial view and pauses following.
5. Tap **Stop GPS**. Confirm the marker, circle, and readings clear. Start again.
6. Deny location permission and confirm the map still works and help explains how to restore permission. Restore site permission and restart.
7. Lock the phone or switch apps for at least 30 seconds, then return. Look for a stale warning if no fresh fix arrives; confirm recovery when GPS resumes. Browsers may suspend tracking in the background.
8. Test weak connectivity. Missing tiles should produce a readable warning. This version has no offline map support.

## Private field notes

Keep test notes outside the public repository if they contain personal information. Record phone/OS/browser, date, approximate test area, tree/building cover, first-fix wait, representative reported accuracy, observed error, update gaps, control usability, and proceed/revise/pause conclusion. Do not record or upload personal GPS traces.

## Scope and sources

- Static Leaflet map, touch pan/zoom, Start/Stop live geolocation, follow/recenter, meter accuracy circle, stale fix display, denial/unavailable/timeout/unsupported/insecure-context handling.
- Uses `watchPosition` with high accuracy requested, zero cache age, and a 15-second timeout. High accuracy is a request to the device, not an assurance of GPS quality. Stale threshold: 30 seconds.
- GPS coordinates remain in page memory only. No analytics, local storage, location-history backend, or trace export. CDN and tile providers receive normal network requests; viewing tiles reveals the requested map area.
- Overview center `[39.9725, -75.1957]` is an approximate framing point near Philadelphia Zoo, not an entrance or exhibit waypoint. Cross-check references: https://www.wikidata.org/wiki/Q3082266 and https://www.openstreetmap.org/way/239934148 . Field alignment remains unverified.
- Official pedestrian map, authoritative pathway routing, accessibility data, and sightings remain later work.
- Leaflet: https://leafletjs.com/download.html . Geolocation: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition . OSM attribution and tile usage: https://operations.osmfoundation.org/policies/tiles/ . Tiles use the standard HTTPS endpoint and normal browser caching; no prefetch or offline downloads.

Automated controller checks use simulated device callbacks. Real phone GPS and Zoo-ground accuracy must still be tested separately.
