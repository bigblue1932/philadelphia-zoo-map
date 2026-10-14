# Philadelphia Zoo Visitor Map — Multi-Zone Geofencing & Intelligent Path Matching
**Specification:** ZMAP-GEO-001 · **Version:** 1.0 (design checkpoint) · **Date:** 2026-10-14 · **Status:** Proposed; pending GIS validation and implementation

## 1. Purpose
Keep the visitor's displayed location on plausible visitor-accessible routes despite GPS drift, especially near large outdoor animal enclosures (e.g., rhino and bear habitats), while preserving distinct arrival/departure and indoor navigation behavior. This is a display/navigation aid, **not** proof of actual physical location or a security/safety access-control system.

## 2. Decisions and requirements
1. **Campus boundary:** Use the official GIS property polygon for on-property classification. A separate configurable arrival/departure buffer may be used; 250 m was suggested as an *unapproved initial candidate*, not an established setting.
2. **Multiple zones:** Represent outdoor animal enclosures, inaccessible buildings, service areas, and individual habitat compartments as restricted polygons. Model visitor-accessible buildings and their public corridors as allowed zones. A building shell is not automatically restricted.
3. **Walkable network:** Use GIS pedestrian centerlines with connected junctions, gates, entrance/exit links, accessibility attributes, and temporary closures. Avoid routing across barriers even when paths appear geometrically close.
4. **Location presentation:** Retain the raw device GPS reading transiently, along with reported accuracy and timestamp; compute a separate map-matched display coordinate. Do not overwrite raw observations with corrected coordinates.
5. **Path matching:** Select plausible candidate segments based on distance relative to GPS uncertainty, last reliable segment, walking speed, heading when reliable, topology/connectivity, and hysteresis to prevent oscillation at intersections.
6. **Restricted-zone display:** When confidence is sufficient, display the visitor marker on a plausible accessible path, never inside a restricted outdoor enclosure polygon. When confidence is insufficient, show an uncertainty state (accuracy halo, faded/last-known position, or 'location uncertain') rather than inventing a confident path.
7. **Indoor handling:** Public buildings such as reptile exhibits may contain accessible corridors alongside restricted glass habitats. Treat indoor mapping as a later phase; GNSS often degrades indoors. Indoor path matching requires indoor floorplan/corridor data and may eventually need BLE beacons, Wi-Fi positioning, or other localization.
8. **Crowdsourced sightings:** Reuse enclosure and compartment IDs to associate animal reports with habitat locations and aggregate repeated sightings. Do not equate the corrected visitor marker with a confirmed sighting location.

## 3. Proposed matching pipeline
Device GPS + accuracy/timestamp → validate freshness/quality → classify candidate allowed paths and zones → score candidate segments using geometry, motion history and connectedness → smooth/hysteresis → check that output lies in an allowed visitor area → render corrected marker with confidence/uncertainty. Preserve raw and corrected coordinates as distinct fields. No position-based tracking history by default; apply data minimization, retention limits, and explicit privacy review before collecting telemetry.

## 4. GIS data needed from Planning
- Official property boundary and CRS/EPSG, accuracy and last-update metadata.
- Pedestrian paths as connected lines, entrances/exits, intersections, ramps, stairs, gates, accessibility and closure attributes.
- Outdoor enclosure polygons, **separate physical compartments**, stable enclosure IDs and visitor-facing exhibit/species metadata.
- Public building footprints, entry points, and—if available—indoor public corridors and exhibit-case polygons.
- Restricted/service-only zones, separated from public exports; data dictionary and permission for public app use.
- Preferred handoff: GeoPackage for full multi-layer dataset; GeoJSON for selected web layers; Esri File Geodatabase/feature service acceptable.

## 5. Phased implementation
**P1 — Outdoor exclusion and matching (priority):** Import and validate GIS; render outdoor paths and major enclosures; implement confidence-aware snapping and exclusion. Field-test near rhino/bear enclosures and intersections.

**P2 — Public buildings:** Add building entrances, accessible building classification, and corridor geometry where available; avoid incorrectly treating the whole building as prohibited.

**P3 — Indoor positioning (conditional):** Evaluate indoor maps and beacon/Wi-Fi positioning only if visitor needs and accuracy tests justify them.

**P4 — Turn-by-turn navigation:** Build on validated walkable network after P1–P2, with accessible route constraints.

## 6. Acceptance tests
- GPS drift into a rhino/bear polygon does not place a **confident** displayed marker inside the restricted polygon.
- Visitors at adjacent paths/intersections do not jump across disconnected routes because of small GPS fluctuations.
- If no plausible segment meets confidence threshold, UI clearly indicates uncertain location; it does not claim an exact location.
- Entry into public buildings remains permitted; glass animal cases are not treated as public walkways.
- Temporary closed paths are excluded from matching and routing after map update.
- Arrival/departure detection uses campus boundary/buffer logic independently of enclosure matching.
- Raw vs corrected coordinates are clearly distinguished in debugging, with privacy safeguards.
- Test across Android/iOS devices, poor satellite reception, stopped/walking movement, and near zoo boundaries.

## 7. Risks and open decisions
- Obtain accurate GIS polygons and path topology; confirm coordinate transforms and GIS public-use permissions.
- Agree on location confidence thresholds, snap-distance limits, smoothing behavior, and UI uncertainty treatment after on-site testing.
- Confirm whether existing app behavior was path matching or another map constraint; Gerald's observation is an input, not proof of implementation.
- Determine the actual previously configured outer geofence distance; **250 m is a suggestion only**.
- Clarify visitor-accessible indoor corridors, entrances, and special access cases.
- Review privacy, battery impact, offline behavior, accessibility and emergency messaging separately.

## 8. Checkpoint
**Milestone:** Multi-Zone Geofencing and Intelligent Pedestrian Path Matching.
**Priority:** Before full turn-by-turn navigation.
**Next action:** Obtain Planning GIS sample; inspect layers and CRS; prototype outdoor restricted polygons and map matching; conduct Gerald-led on-site acceptance walk.
