# Philadelphia Zoo Mapping App — Technical Audit Checkpoint
Date: 2026-10-28
Repository: bigblue1932/philadelphia-zoo-map
Baseline: main, v0.3.2

## Scope and evidence
Read repository tree and source: app.js, location-policy.js, zoo-boundary.js, survey-model.js, survey.js, index.html; reviewed tests/location.test.cjs, tests/geofence.test.cjs, tests/survey.test.cjs, and FOLLOW_ME_RELIABILITY.md. This is a source-level review, not a completed independent runtime or phone acceptance audit. No tests were executed in this checkpoint.

## Findings
1. Follow Me: app.js separates following intent from GPS eligibility and preserves intent during temporary uncertainty; explicitly cancels intent on drag, keyboard pan, Zoo overview, and entering Survey Mode. Confirm that these cancellations match desired UX. A full reload does not persist tracking intent.
2. GPS quality: location-policy.js uses maxAccuracy 50 m, staleMs 30 seconds, edgeBuffer 10 m, two-fix confirmation, and jump rejection. Survey GPS collection requires <=20 m. Validate both thresholds outdoors.
3. Boundary: zoo-boundary.js contains a community-mapped OSM polygon, explicitly not Zoo-authorized or field-validated. No official GIS enclosure polygons or path snapping yet.
4. Survey: drafts are local, unverified, exportable/importable GeoJSON. No staff authentication, backend approval or publication workflow. Local browser storage is not durable institutional storage.
5. Tests: three Node test suites exist and release notes report 26 passing tests on October 18. Independently rerun and record actual results before claiming a current pass.
6. Deployment: GitHub Pages prototype relies on third-party Leaflet CDN and OpenStreetMap tiles; assess operational availability, licensing and privacy before production.

## Next milestone proposal: v0.3.3 — Reliability and Field Validation
A. Re-run Node test suites: `node --test tests/location.test.cjs tests/geofence.test.cjs tests/survey.test.cjs`. Record environment, counts, failures and commit SHA. Add tests for any discovered edge cases.
B. Test Follow Me on actual Android and iOS browsers: initial fix, repeated fixes, temporary low accuracy, stale fixes, background/foreground, screen lock, drag, zoom, Survey Mode, GPS denial, recovery, and reload. Capture non-coordinate diagnostics and expected versus actual outcomes.
C. Validate geofence behavior and thresholds near perimeter; do not use approximate boundary for enclosure or emergency decisions.
D. Validate Survey Mode draft collection, import/export, backup/recovery, permissions, and 20 m GPS threshold; protect staff notes and coordinates.
E. Request official GIS layers from Planning/Trinity: perimeter, public paths, enclosure polygons, accessible routing attributes, coordinate reference systems, and usage permissions; validate geometry before integration.
F. Reconcile implementation with requirements and backlog: classify implemented, partial, planned, and blocked. Prioritize reliability fixes; create issues and regression tests.
G. Produce sign-off report with reproducible findings, severity, owners, acceptance criteria, and release/no-release recommendation.

## Acceptance gate
Do not declare v0.3.3 field-validated until test suite results and Zoo walk results are recorded and blocking issues addressed. Keep ASIS separate; visitor-facing animal data requires authorized review. No code behavior changed by this checkpoint.
