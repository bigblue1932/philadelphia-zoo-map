# Ciel Checkpoint — 2026-11-03

## Decisions confirmed
- AR opens in **Discovery Mode** by default: nearby exhibits, restrooms, amenities and educational information; a prominent path-following navigation arrow appears only after destination selection.
- AR is currently a **camera proof of concept**, not functioning GPS-linked navigation. Restore map/GPS first, then sensor-aware directional overlays, then GIS path-aware routing and accessibility.
- Build a location-aware AR signage and content platform with **both** floating walkway boards and building/exhibit-anchored signage. Building placements may be premium sponsorship inventory.
- Exhibit overlays default to exhibit identification and animal/educational information. Exhibit name should remain visible when other content rotates.
- Rotating content may include conservation messages, events, membership announcements and approved sponsors. Start with a configurable ~30-second interval; pause on interaction/reading and support accessibility.
- Content governance: emergency/safety alerts override all; navigation/accessibility must not be obscured; animal welfare and education are protected; designated educational-only zones and commercial advertising zones.
- Membership/ad-free experience: commercial layers can be disabled without removing essential information.
- Authorized zoo staff should manage location, schedule, content, approval and publication via a future authenticated CMS; content is GIS-linked rather than hard-coded.
- Start without physical anchors: GIS/GPS proximity for discovery, investigate visual anchoring for precision; consider BLE/visual markers/UWB only if measured accuracy requires them. Do not assume ASIS UWB interoperates with phones.

## Active bug and implementation sequence
- On Android Chrome and Edge the zoo map was blank on initial load and Start Live GPS did not recover it; AR Preview camera did open.
- Suspected map initialization/dependency/caching failure **not yet root-cause verified**. Do not assert a code fix, successful deployment or device test.
- Codex debugging prompt was prepared for `bigblue1932/philadelphia-zoo-map`; Android Codex Send button greyed out and repository/environment selection not found. Next: inspect Codex web configuration while parked, connect repository, use a fix branch/PR, do not merge without review.
- Prioritize: (1) reproduce and repair map startup independently of GPS; (2) verify GPS and Follow Me safeguards; (3) preserve AR camera; (4) integrate AR GPS/orientation; (5) GIS routing; (6) signage/CMS prototype.
- Physical device testing: Android Chrome/Edge and iOS Safari, including denied GPS, poor signal, return from AR, and overlay stability.

## Continuity / governance
- This file records **planning decisions**, not implemented features.
- OpenSpec installation/verification on work laptop and home PC is planned for structured specifications; integrate with Codex/GitHub and existing checkpoint docs.
- Next specification: AR Discovery + Navigation + Location-Aware Signage, including permissions, privacy, performance, accessibility, sponsorship approvals, and animal-welfare safeguards.
- Maintain public visitor vs authenticated employee capability boundaries.
