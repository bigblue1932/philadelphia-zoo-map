# Version 0.2 — GPS safeguards

Implementation date: October 13, 2026. Builds on v0.1 checkpoint 33a08de. Published implementation/master checkpoint: bb734ac383a5bef4e3a49ade175af7d257b6e51d. HTTPS v0.2 rendering browser-verified October 13 at https://bigblue1932.github.io/philadelphia-zoo-map/ . This release implements GPS safeguards; shared sightings remain the next milestone.

## Visitor behavior

- Without GPS, visitors can explore the Zoo map.
- Start live GPS checks location; two fresh reliable fixes clearly inside the approximate perimeter enable on-site mode and Follow me. Tap Follow me explicitly; it never turns on automatically after uncertainty.
- Clearly outside fixes confirm off-site mode. The map stays at the Zoo and displays no remote user marker. GPS continues checking for arrival until stopped.
- Boundary overlap, poor accuracy, invalid/old fixes, errors, backgrounding and implausible jumps pause following. Any retained faded dot is the last accepted on-site position, not a new uncertain fix.
- Stop GPS/permission denial clears the watcher and in-memory location. Nothing is stored as a GPS trace.
- The dashed perimeter is community map data, not the official pathway map. Zoo-area bounds apply to drag/keyboard/zoom; the rectangular view margin still permits surrounding tiles to be visible.

## Provisional defaults

| Setting | Value | Purpose |
| --- | --- | --- |
| Perimeter | OSM way 239934148, version 8, retrieved October 13 | Approximate Zoo classification; 60 points, closed ring. |
| Accuracy | Positive and at most 50 m | Worse fixes cannot enable following. |
| Edge uncertainty | Reported radius + 10 m buffer | Neither side of a boundary overlap is confirmed. |
| Confirmation | Two fixes at least 1 s apart, within 15 s | Reduces mode flicker; intervening uncertainty resets confirmation. |
| Stale | Older than 30 s | Suspends following and expires site classification. |
| Clock | Reject future time beyond 1 s, duplicate/out-of-order times | Avoid misleading freshness. |
| Jump guard | max(100 m, 15 m/s × elapsed + both accuracy radii) | Reject sudden displacement while previous trusted fix is within 30 s. |
| View extent | Boundary rectangle padded by 25% | Limits map exploration to Zoo vicinity. |
| Zoom | Viewport-derived minimum; maximum 19 | Prevents zooming to a world map; recalculated on resize. |

These defaults are engineering choices, not previously approved morning-chat thresholds. Reported device accuracy and approximate map boundaries cannot prove attendance or enclosure identity. This is not a security geofence. After a gap longer than 30 seconds, two fresh fixes can reacquire at a new position without a travel-speed assumption.

## Verification

Run: `node --test tests/location.test.cjs tests/geofence.test.cjs` . Fourteen simulated tests cover geometry, edge overlap, mode confirmation, invalid/poor/stale/time fixes, jump recovery, off-site no-recenter behavior, errors/retry, follow/stop, watch ID zero and late callbacks. No real-phone GPS is simulated as a field result.

Run preview: `node tools/preview.cjs` . Open http://localhost:8080 . This server only serves known app assets and binds to loopback.

## Phone/field checklist

1. Open the HTTPS Pages URL and confirm v0.2; reload if an older version appears.
2. Away from the Zoo, allow GPS and wait for two accurate updates. Confirm Off-site mode, disabled Follow me, no remote dot, and the map remaining at the Zoo.
3. Test map dragging and zooming in/out, including orientation changes. The view should remain in the Zoo vicinity; Zoo overview should return to the full perimeter.
4. At the Zoo, away from the approximate perimeter, wait for two reliable fixes. Tap Follow me; confirm live position and accuracy circle.
5. Near an entrance or perimeter, confirm overlapping uncertainty does not flip repeatedly between on-site and off-site. Do not assume the community perimeter matches admission boundaries.
6. Under trees/by buildings, watch low accuracy pause following. Confirm two good fixes restore eligibility; following requires a new tap.
7. Switch apps/lock screen for over 30 s and return. Verify uncertainty/staleness and fresh confirmation before following resumes.
8. Deny permission; check that map browsing still works and permission help appears. Restore permission and retry. Stop GPS and verify all readings/location layers clear.
9. Record approximate test area, device/browser, reported versus observed accuracy, gaps and threshold problems privately. No personal location trace should be committed.

## Sources and privacy

- Boundary: https://www.openstreetmap.org/way/239934148 ; raw snapshot source https://api.openstreetmap.org/api/0.6/way/239934148/full . ODbL, © OpenStreetMap contributors. Snapshot metadata is embedded in zoo-boundary.js; not Zoo-authorized/field-validated.
- Leaflet 1.9.4 API: https://leafletjs.com/reference.html . Browser accuracy: https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy . Tile policy: https://operations.osmfoundation.org/policies/tiles/ .
- GPS processing remains in memory. Leaflet CDN and OSM tiles receive normal network requests; viewed map areas are exposed to the tile provider. No shared reporting backend is included in v0.2.
