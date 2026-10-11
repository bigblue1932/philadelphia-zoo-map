# Architecture

Status: Initial proposal; October 11, 2026. No technology stack selected.

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
