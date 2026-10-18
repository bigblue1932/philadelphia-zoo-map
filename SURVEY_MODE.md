# Survey Mode v0.3

Implemented and live-browser verified October 13, 2026 at https://bigblue1932.github.io/philadelphia-zoo-map/ . Implementation checkpoint 48fa50e; asset refresh checkpoint 8b3b149. A browser-local field collection prototype, not an authenticated staff system. Surveying creates unverified drafts; it never changes the public basemap, publishes geographic changes or submits approval requests.

## Collect observations

1. Open the HTTPS prototype and expand **Survey Mode · draft map observations** below the GPS controls.
2. Tap **Enter Survey Mode**. Following pauses and purple draft geometry becomes visible.
3. Choose landmark/facility (one point), pathway (two or more vertices) or viewing zone (three or more vertices). Changing type resets the unfinished geometry. Tap inside the approximate Zoo perimeter, use **Use map center**, or capture a GPS vertex. Point observations replace their current point; multi-vertex shapes append vertices. Undo removes the last vertex.
4. Name the feature, select the proposed review domain, and add notes/source references. Optionally link an existing enclosure/feature ID and add a surveyor label. Labels are not authenticated identities. Surface/stairs default to unknown; ramps, slope, rest areas and closure observations can be described in notes. These observations are not validated accessibility/routing data.
5. **Capture GPS vertex** requires confirmed on-site status, positive reported accuracy no worse than 20 m, and a fix no older than 30 seconds. This records where the surveyor stands, not the inferred position of an animal, enclosure wall or inaccessible feature. Current v0.2 geofence safeguards still apply. No continuous walking trace is collected.
6. Save the observation. It is labeled draft/unverified with a UUID, revision 1, capture/source evidence and requested reviews (selected domain + Map Approver). The path/zone geometry still needs geographic/field review; checking its vertices against an approximate perimeter does not validate an entire shape or pathway alignment.

Manual vertices are map estimates with no claimed GPS accuracy. GPS/manual sources may be mixed, and each vertex retains its evidence. An OSM landmark can be used for provisional anchoring, with source details in notes. This release does not digitize or align an official brochure image automatically.

## Draft management and privacy

Saved drafts remain in memory by default and are lost on reload/navigation. Choose **Remember saved drafts on this device** to opt into localStorage. Only saved observations are stored; unfinished vertices are excluded. Unchecking removes the device copy while retaining the current session's drafts. Storage errors are shown; export a backup when saving is unavailable. Device-local storage is not encrypted staff storage and is unsuitable for restricted information.

Show draft reframes it and enters Survey Mode. Remove draft deletes it from this session and any remembered copy; previously exported files are unaffected. Exiting Survey Mode hides purple draft overlays without deleting the drafts.

Export GeoJSON downloads the saved records to your device. Import accepts this app's schema-version-1 GeoJSON, validates coordinates/evidence/geometry and reclassifies records as draft/unverified. Existing IDs are skipped; approval/identity claims are never trusted. Import is all-or-nothing on validation failure. Limits: 100 saved drafts, 200 vertices per observation, 1000 total saved vertices, 500 KB imported file. No records are uploaded or automatically committed to GitHub. Review coordinates/notes before sharing an export; avoid personal or restricted data.

Live tracking coordinates still clear when stopped. Explicitly captured survey vertices remain in their drafts until removed; stopping GPS does not erase survey work. Draft memory/storage is separate from the tracker. The survey storage key is philadelphia-zoo-survey-v1 and is scoped to this site's browser origin/device.

## Data and review handoff

survey-model.js validates records and produces GeoJSON Point, LineString and closed counterclockwise Polygon geometries with longitude/latitude coordinates. Properties include type/name/notes, feature reference, domain, requestedReviews, source/accuracy/capture times, unknown-or-observed attributes, unverified surveyor label and draft status. Draft IDs and creation times survive valid export/import; revision history is not an authenticated audit log.

Requested review routes are labels prepared for a future backend. No Con Ed, Animal Care, Facilities, Public Safety or Map Approver notification occurs. No role is granted by opening the page or choosing a domain. Server-side identity, submission, required review routing, revision approvals and publication will follow CONTENT_GOVERNANCE.md in a separate implementation.

## Verification and phone test

Run `node --test tests/location.test.cjs tests/geofence.test.cjs tests/survey.test.cjs` . Twenty tests pass: existing GPS protections plus draft validation, geometry counts/serialization, closed zones, crossing/flat-zone rejection, fresh/accurate GPS evidence, off-site coordinates, untrusted import claims, tampering, duplicates and limits.

Browser QA: manually saved a synthetic landmark and two-vertex path, rejected a repeated vertex, exported/inspected GeoJSON, opted into local storage, reloaded and verified recovery, then removed synthetic records and the storage copy. No actual field records were created or published. Real phone GPS survey capture, tap placement, multi-vertex usability and field geometry alignment remain pending.

On your phone: collect a clearly labeled test point, a short path and a viewing-zone draft; check undo, off-site manual placement, GPS capture eligibility, export/import, storage opt-in and recovery. Remove test records when finished. Verify actual public landmarks/path observations and media/source rights before handing off real survey drafts for review.

Implementation references: [Leaflet 1.9.4](https://leafletjs.com/reference.html), [browser localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [GeoJSON RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946). Map attribution/source remain in the application and zoo-boundary.js.

## Follow Me update in v0.3.2

Entering Survey Mode still intentionally pauses following via an explicit surveystart event. Temporary GPS uncertainty now retains visitor follow intent and resumes automatically after reliable fixes; GPS capture eligibility remains separate and unchanged. See FOLLOW_ME_RELIABILITY.md.
