# Executive Mobile Demo — November 11, 2026

## Goal
Present a mobile-first Philadelphia Zoo map proof of concept to zoo leadership, opening directly on the interactive map with a polished navigation overlay.

## Demo storylines
1. **Visitor Experience:** interactive zoo map, Zoo Overview, live GPS and off-site geofence behavior, accessibility roadmap.
2. **Zoo Operations:** local draft Survey Mode, exportable GeoJSON, diagnostics, safety/reporting roadmap. Do not expose restricted infrastructure.
3. **Future Innovations:** existing experimental camera-based AR direction preview, with accuracy and safety disclaimers; future AR navigation and exhibit overlays.

## Verified baseline from phone test (reported November 10)
- Leaflet and map initialized: true.
- Container: 384 × 382 pixels.
- Map tiles: 9/9 loaded.
- Errors: none observed.
- Zoo Overview visible; off-site status detected; map bounded to zoo; diagnostics and copy-report visible.
These are user-reported observations, not automated regression-test results.

## Current implementation audit
- `index.html` uses Leaflet 1.9.4, `app.js`, `ar-preview.js`, `ar-bootstrap.js`, and Survey Mode scripts.
- README identifies v0.3.2 as a browser-local prototype, with no employee sign-in, approvals or publication service.
- AR is experimental and approximate, not a verified walking route.
- Public GitHub Pages means no real employee-only data in demo.

## Implementation plan (separate /demo/ directory)
- Keep root app unchanged.
- Reuse the root app's working map rather than duplicating mapping logic. A demo wrapper may embed the existing root map, with prominent mobile-first section navigation and transparent labels.
- Map visible immediately, not behind a splash screen.
- Use touch-friendly controls, safe-area padding, clear contrast, and a collapsible menu.
- Show *Live*, *Experimental*, and *Concept* labels to avoid misrepresenting functionality.
- Provide a clearly labeled off-site walkthrough with illustrative content; never falsify GPS.
- Do not change published Pages configuration or merge without explicit approval.

## Acceptance checks before presentation
1. On Android, map initializes and tiles load; Zoo Overview works.
2. Menu is readable and usable on narrow screens; map remains interactive.
3. Off-site GPS message is truthful; camera permissions only requested on deliberate AR launch.
4. No employee authentication or private infrastructure claims.
5. Root application remains unchanged.
6. Review on phone and secure explicit approval before deployment.

## Presentation narrative
Lead with a live map, show a real off-site GPS safeguard, demonstrate diagnostics and Survey Mode, then show AR as an experimental preview and conclude with the authenticated visitor/employee roadmap.
