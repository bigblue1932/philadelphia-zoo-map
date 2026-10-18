# Architecture

Updated October 13, 2026.

## Current static client

GitHub Pages HTTPS → index.html → Leaflet 1.9.4 and OSM raster tiles → browser watchPosition. Live visitor tracking has no location backend, analytics or persistent location history. v0.3 Survey Mode can explicitly capture individual fixes into local drafts and export them; saved survey storage requires opt-in.

- app.js: map, touch/keyboard controls, permission/error lifecycle, mode/status display and follow eligibility.
- zoo-boundary.js: closed OSM way 239934148 version 8 snapshot, retrieved October 13, with source and ODbL attribution. Community perimeter, not field-validated.
- location-policy.js: pure geometry and fix-quality policy, independently testable. All thresholds are provisional.
- tests/: simulated controller and geofence checks. tools/preview.cjs: localhost-only static server.

## GPS and map behavior

Modes: explore/unknown, uncertain, on-site, off-site. A point-in-polygon test is combined with distance to the nearest perimeter segment. A fix within its reported accuracy radius plus 10 m of any edge is uncertain, on either side. Accurate clearly inside/outside fixes require two confirmations at least 1 second apart within 15 seconds. Uncertainty/errors/backgrounding reset confirmation and pause following; visitors explicitly tap Follow me after recovery.

Accuracy must be positive and at most 50 m. Coordinates/timestamps must be finite and in range. Reject fixes older than 30 seconds, more than 1 second in the future, duplicate/out-of-order timestamps, and implausible jumps over max(100 m, 15 m/s × elapsed seconds + both reported accuracy radii) when the previous trusted fix is within 30 seconds. After a longer gap, reacquire with fresh confirmation rather than enforcing a travel-speed assumption. These are prototype heuristics, not verified security or navigation guarantees.

Only confirmed on-site fixes can update the blue marker/circle or enable following. Uncertain fixes retain a faded last accepted on-site marker. Confirmed off-site mode removes it, keeps the view at the Zoo and continues checking GPS. A timer expires stale on-site and off-site readings. Stop/permission denial clear in-memory GPS and the watcher; callback generation guards ignore obsolete callbacks, including watch ID zero.

Map view uses the perimeter bounding rectangle plus 25% padding, solid drag bounds, viewport-derived minimum zoom and maximum zoom 19. This restricts exploration to the Zoo vicinity; surrounding tiles can remain visible. The map restriction is separate from the polygon site classification. No GPS-driven view change occurs in off-site/uncertain mode.

## Next: crowdsourced sightings (design proposal)

GitHub Pages remains the frontend. A shared service is required for reports across devices; select hosting, storage and a subscription or polling mechanism after estimating cost. No service vendor is selected or implemented in this checkpoint.

Proposed contracts:

- Enclosure: stable enclosureId; parent exhibitId; physical sectionId where needed; public label; permitted species; optional validated animal IDs; geometry or viewing-area reference; source, validation date, active dates. Separate physically walled sections even in the same exhibit. Do not assume one permanent animal from one enclosure; use individual animal identity only with validated information.
- Report: reportId/idempotency key; enclosureId; species or validated animalId (optional); observation visible/not-visible/unsure; observedAt; serverReceivedAt; expiry; privacy-preserving contributor/session key; moderation status. Do not require precise visitor coordinates in public data. Server validates enclosure/category/time/rate limits and eligibility policy; browser GPS alone is spoofable.
- Aggregate: stable group key enclosureId + species/validated animalId + defined observation time bucket; distinct contributor count; latest observation; freshness/expiry; confidence label and explanation; aggregate revision. One marker per active group, with enclosure sections kept separate. A not-visible report is not proof of absence.
- Map event: aggregate ID/revision; updated or expired state; server time. Reconnect fetches current snapshot before applying newer revisions; duplicate/reordered messages cannot duplicate markers. Expired groups are removed even when no event arrives.

Aggregation/confidence proposal: deduplicate retries and repeated reports from the same contributor in the same group/window. Combine freshness, distinct contributor evidence, conflicting observations and moderation status; confidence describes support for a recent sighting, never certainty the animal remains visible. Contributor independence is approximate without an identity/abuse design. Window length, weights, thresholds, retention, anonymous identity and abuse safeguards remain open decisions. Do not publish a made-up probability or use GPS accuracy as an animal-identity confidence score.

Real-time notification proposal: refresh the shared marker and show a rate-limited in-app notice for a meaningful new/reconfirmed sighting; reconcile reconnects, expire stale reports, preserve map focus, support mute and accessible announcements. It does not imply background OS push, emergency alerts, or Zoo-verified notices.

## Later contracts and dependencies

Paths: geometry/endpoints, accessibility attributes, provenance and validation date. Quiet information: basis/time/uncertainty. Official notices: source, authority and validity. Shared sightings need validated enclosure inventory, privacy/retention policy, moderation, server-side abuse controls and two-device validation before public launch.

## Conservation accessibility and governance design

CONTENT_GOVERNANCE.md captures the supplied v0.1 design and distinguishes source requirements from implementation proposals. CONSERVATION_PLAN.md defines proposed species/animal/enclosure/story/program/media/revision/role-assignment entities and the first Con Ed/Domain Approver workflow. One domain-aware authorization and event framework should support publishing, geographic review, events and operational routing; emergency and marketing authority remain distinct.

Restricted drafts and workflow actions need authenticated backend enforcement; Pages serves approved public content only. No backend/identity/vendor is selected and no staff access is configured. Initial Survey Mode is now implemented as device-local drafts in v0.3; see its implementation section below. Accessibility is embedded in future routing by default, sensory overlays are optional, and neither requires disability disclosure. Geography and accessibility attributes require source/field validation.

## Survey Mode v0.3

survey-model.js supplies validation, unverified draft contracts and GeoJSON serialization/import; survey.js owns the UI, separate purple Leaflet groups and opt-in device persistence. app.js provides a read-only getter for the current accepted on-site fix, including reported accuracy; the survey capture threshold is 20 m and freshness limit 30 seconds. No continuous trace, network submission or map-data promotion occurs. Manual vertices remain estimates and unknown accessibility values stay unknown. Imports validate all records before applying them and cannot grant approval or identity status. GPS stop clears tracking but preserves explicitly captured draft work. See SURVEY_MODE.md for limits, retention and future backend handoff.

## October 18 Follow Me state separation

The app now separates active GPS subscription, user follow intent and accepted-fix eligibility. Uncertainty disables recentering/capture eligibility but retains follow intent. The button remains actionable while GPS is running; waiting resumes automatically with reliable on-site updates. Genuine drag/keyboard pan, Zoo overview, Survey Mode and explicit off cancel intent. Programmatic movement and taps do not. BFCache suspends/restarts the watcher using generation guards rather than reloading. A 30-entry in-memory state/reason ring contains timestamps only, no coordinates or traces. Duplicate/old fixes do not revoke newer good data. Earlier v0.2/v0.3 instructions to tap again after every uncertainty are superseded; safeguards/thresholds otherwise remain unchanged.
