# Philadelphia Zoo Map

Version 0.3.2 improves Follow Me reliability: retain intent during temporary GPS uncertainty and resume automatically when reliable fixes return. See [FOLLOW_ME_RELIABILITY.md](FOLLOW_ME_RELIABILITY.md).

Version 0.3 adds browser-local Survey Mode to the Leaflet/OpenStreetMap prototype. Collect draft points, paths and viewing zones with GPS/manual evidence; opt into device storage or export/import GeoJSON. Drafts never change the published map.

Live: https://bigblue1932.github.io/philadelphia-zoo-map/

Run: node tools/preview.cjs . Checks: node --test tests/location.test.cjs tests/geofence.test.cjs tests/survey.test.cjs . No build or API key; internet access required for Leaflet and tiles.

See [SURVEY_MODE.md](SURVEY_MODE.md) for collecting/recovering drafts, privacy and phone tests. [PROTOTYPE_V0_2.md](PROTOTYPE_V0_2.md) records the GPS safeguards. [CONTENT_GOVERNANCE.md](CONTENT_GOVERNANCE.md) and [CONSERVATION_PLAN.md](CONSERVATION_PLAN.md) describe future authenticated workflows and content. Staff authentication, shared sightings, approval and publication services remain unimplemented.
