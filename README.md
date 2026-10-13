# Philadelphia Zoo Map

Version 0.2 adds approximate GPS geofencing, off-site browsing, Zoo map bounds and accuracy safeguards to the Leaflet/OpenStreetMap prototype. Location remains on-device in page memory.

Live prototype: https://bigblue1932.github.io/philadelphia-zoo-map/

Run locally: node tools/preview.cjs . Checks: node --test tests/location.test.cjs tests/geofence.test.cjs . No build or API key needed; internet access is required for Leaflet and tiles.

See [PROTOTYPE_V0_2.md](PROTOTYPE_V0_2.md) for provisional policy and phone validation. [PROTOTYPE_V0_1.md](PROTOTYPE_V0_1.md) records the previous baseline. Six master documents describe current scope and the next enclosure-specific shared sightings milestone. Shared reports are not implemented yet. Official pedestrian pathways remain later work.
