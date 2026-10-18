# Follow Me reliability release v0.3.2

October 18, 2026. [Requirements and checkpoint recovery](docs/checkpoints/2026-10-18/README.md), [tracking issue](https://github.com/bigblue1932/philadelphia-zoo-map/issues/1).

## What changed

Follow intent is separate from location eligibility. Start live GPS, then tap Follow me once. During temporary poor accuracy, timeouts, unavailable/stale fixes or backgrounding, the control stays actionable and pressed, showing **Follow on · waiting**. A reliable on-site fix resumes following automatically without another tap. The last accepted location remains faded when uncertain; off-site mode still removes the location marker and prevents remote camera movement.

Explicit off, a deliberate drag/keyboard pan, Zoo overview or entering Survey Mode cancels follow intent. Ordinary map clicks and programmatic camera moves do not. Stop GPS/permission denial clears the tracker and intent. Follow Me can be requested while waiting for the first fix and toggled off during uncertainty.

Duplicate/out-of-order callbacks are ignored without revoking a newer reliable fix. Other freshness, accuracy, jump and boundary checks retain their thresholds and two-fix recovery policy. GPS survey capture retains its 20 m and on-site requirements. This release adds no geofence enlargement, path snapping, official GIS layers or inferred enclosure identity.

Background/foreground preserves intent. Back-forward cache navigation suspends the watcher, ignores obsolete callbacks and restarts it on restoration. It no longer reloads the page on cache restoration. A full reload/new page starts with GPS off; no tracking preference is stored on disk.

## Diagnostics and privacy

Expand Follow Me diagnostics for the last 30 state/reason transitions (epoch-millisecond times). States: off, paused, waiting, following. Reasons distinguish user-on/off, user-drag/keyboard-pan, survey-mode, zoo-overview, GPS readiness/uncertainty/error/staleness, background and cache suspension. No coordinates, survey notes, identifiers or visitor location trace are included. Logs are memory-only and never uploaded automatically. Share only relevant reason lines if reporting an issue; no personal GPS trace is needed.

## Verification

26 automated tests pass across location policy, app controller and Survey Mode models. Targeted regressions cover a normal simulated walk, camera movestart versus dragstart, taps, repeated/delayed callbacks, poor accuracy/timeouts/staleness, first-fix waiting, automatic recovery, foreground recovery, BFCache watcher races, terminal denial/stop and bounded coordinate-free diagnostics.

Browser preview verified versioned asset loading, map/controls, the initial following state and diagnostics. Simulated callbacks are not a real phone GPS acceptance test. The original report establishes an intermittent field symptom, not proof that every interruption has the same cause.

## Zoo phone acceptance walk

1. Reload the HTTPS app and confirm **v0.3.2**. Start live GPS and tap Follow me once.
2. Walk a normal outdoor route. The camera should follow through fresh reliable fixes. A quality dip should show Follow on · waiting and resume by itself; do not tap again merely because GPS is waiting.
3. Deliberately drag the map: following becomes paused, but the control remains available. Tap Follow me to resume (or queue resumption while fixes are uncertain). Ordinary taps/zoom and automatic recentering should not turn it off.
4. Briefly switch apps or lock/unlock the screen. Confirm waiting then automatic recovery. Browsers may suspend GPS while locked; continuous background tracking is not promised.
5. Verify Stop GPS clears readings/intent. Enter Survey Mode and verify it intentionally pauses camera following.
6. If it stops unexpectedly, note the displayed follow state and relevant reason codes, approximate signal conditions and phone/browser. Do not upload precise location traces. Actual Zoo-walk acceptance remains pending until results are supplied.
