# Architecture

Status: Initial proposal; October 11, 2026. No technology stack selected.

## Version 0.1 implementation — October 11, 2026

Owner-selected stack: buildless HTML/CSS/JavaScript, Leaflet 1.9.4, OpenStreetMap raster tiles, and GitHub Pages HTTPS hosting. `app.js` owns the map and browser `watchPosition` lifecycle. A circle radius in meters visualizes reported accuracy. Tracking uses callback-generation guards, explicit stop/clear, and a 30-second stale threshold. Location remains in memory only. `tests/location.test.cjs` exercises the controller using simulated geolocation and map adapters. Real-device accuracy and mobile layout require phone validation. The original proposals below remain historical context; unselected-stack wording is superseded for v0.1.

## M1 proposal

Static browser client → map renderer and documented Zoo coordinates → browser location adapter → on-device position and accuracy display. GitHub stores source and version history; GitHub Pages hosts the test application. A shared reporting backend is a later decision.

Suggested modules: map view, exhibit data, location state, visitor-facing status messages, and prototype labeling. Handle loading, denied permission, errors, and stale location explicitly.

## Candidate data contracts

- Exhibit: stable ID, name, coordinates, source, validation status.
- Path: geometry, endpoints, accessibility attributes, source, validation date; unknown attributes remain unknown.
- Sighting: exhibit ID, observation time, observation category, provenance, expiry status. Shared persistence is undecided.
- Quiet information: exhibit ID, classification, basis, time context, validation status.
- Notice: category, content, source, validity period, authority status.

These contracts are design proposals. Routing, report moderation, notifications, and public safety integration require further specification.

## Decisions still needed

Map library/provider; map rights and attribution; coordinate validation; acceptable costs; supported mobile browsers; repository and Pages configuration; shared-data backend; accessibility and safety information authority.

Validate technical platform details against current official documentation when implementation begins. No production reliability or GPS accuracy claim has been established.
