# Executive mobile demo — initial verification (Nov 10, 2026)

## Verified from the committed demo source
- Inline JavaScript syntax parses successfully in a JavaScript engine.
- Required UI targets exist: cards, detail, interaction and tour.
- Embedded map points to the existing root application via `../index.html`.
- Guided tour defines nine highlights across Visitor, Operations and Innovation.
- Sample reporting explicitly says no report was sent or stored.
- Simulated passport and accessibility experiences do not claim verified location or accessible routing.

## Still unverified
- Real Android Chrome layout, scrolling, iframe controls and touch behavior.
- Leaflet map rendering and GPS permissions inside the iframe.
- AR camera permission/preview from inside the iframe.
- Every interaction and guided-tour step in a real browser.
- Availability of a standalone preview deployment.

## Release gate
No merge, production change, or preview publication without the owner's explicit approval. Do not share a GitHub source link as if it were a live demo. Test on a stationary device, and retain the existing live map as fallback.
