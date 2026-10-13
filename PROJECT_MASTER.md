# Philadelphia Zoo Mapping App — Project Master

Updated: October 13, 2026 · Phase: independent proof of concept

## Purpose

Build a low-cost visitor map combining orientation and timely crowdsourced animal visibility. Preserve accessible pathways, quieter experiences, visitor notices, and public safety information in the broader roadmap. This project has no established Zoo partnership or operational authorization.

## Baseline and current work

Repository: https://github.com/bigblue1932/philadelphia-zoo-map . Hosting: GitHub Pages. Stack: static HTML/CSS/JavaScript, Leaflet 1.9.4 and OpenStreetMap.

Version 0.1 was published October 11 at https://bigblue1932.github.io/philadelphia-zoo-map/ . Application commit: f16f555; documentation checkpoint: 33a08de. Map rendering was browser-verified; five simulated GPS controller checks passed. No real phone layout or Zoo-ground GPS findings are recorded.

October 13 owner direction: prioritize GPS geofencing, off-site mode, map boundary restrictions, and accuracy safeguards; then develop enclosure-specific crowdsourced sightings, report aggregation, confidence scoring, and real-time map notifications. The owner explicitly requested implementing GPS safeguards during this checkpoint. Version 0.2 code now implements them; see PROTOTYPE_V0_2.md for provisional policy and validation status. Sightings remain planned work.

## Conservation and governance reference reconciled October 13

The owner supplied the v0.1 Content, Accessibility & Domain Governance Architecture from the morning discussion. Conservation is a first-class content pillar linked to enclosures, species and validated individual animals where appropriate. Organizational domains: Con Ed, Animal Care, Public Safety, Garden Services/Facilities, Guest Services/Marketing/PR and IT. Roles: Editor/Contributor, Surveyor, Domain Approver, Map Approver and Platform Administrator. Domain ownership, multi-domain approval and revision history are recorded in CONTENT_GOVERNANCE.md; the implementation plan is CONSERVATION_PLAN.md.

The reference is a design checkpoint, not proof of staff/Zoo authorization or an implemented access system. Its recommended sequence is geofencing plus initial Survey Mode, content model, basic Con Ed editor/approval workflow, three representative pilots, then visitor map/routing integration. Current work is content/governance design; shared sightings remain in scope. Survey Mode, content backend and staff accounts are not implemented.

## Confirmed requirements

| ID | Requirement | Status |
| --- | --- | --- |
| R-01 | Low-cost browser visitor app | Static prototype; spending ceiling unspecified. |
| R-02 | Zoo map and navigation | Interactive orientation implemented; validated pathways/routing later. |
| R-03 | Shared animal visibility sightings | Next priority after GPS safeguards; backend and freshness policy pending. |
| R-04 | Live GPS and accuracy | Implemented; field accuracy unverified. |
| R-05 | Accessible pathways | Preserve; authoritative attributes required. |
| R-06 | Quiet experiences | Preserve; definition and evidence pending. |
| R-07 | Visitor notifications | Real-time sightings on the map are next; broader notices remain future. |
| R-08 | Public safety support | Scope preserved; workflows and authorized sources pending. |
| R-09 | GitHub source and documentation checkpoint | Repository established and v0.1 backed up. |
| R-10 | Geofencing and off-site browsing | v0.2 implemented; provisional OSM perimeter and thresholds. |
| R-11 | Zoo map boundary restrictions | v0.2 implemented; geographic rectangle with margin, not polygon clipping. |
| R-12 | GPS accuracy safeguards | v0.2 implemented; uncertain/stale/error states disable following. |
| R-13 | Individual enclosure/section identity | Planned; stable identifiers for physically separate sections. |
| R-14 | Aggregate reports and confidence | Planned; one active marker per enclosure/observation group, no report-dot duplication. |
| R-15 | Enclosure-linked conservation content | Owner requested; first-class sourced content model/design now documented. |
| R-16 | Domain-scoped access and workflow approval | Owner requested; six-domain/five-role reference reconciled; server enforcement and assignments pending. |

## Next acceptance gates

1. Verify v0.2 on HTTPS, with permission denied and unavailable GPS retaining map browsing.
2. Confirm remote fixes cannot move the map away from the Zoo or display a remote user marker.
3. Check fresh on-site fixes, uncertain perimeter fixes, low accuracy, jump rejection, stale updates, and safe recovery.
4. Validate the provisional perimeter, phone controls, thresholds, and GPS performance on Zoo grounds before relying on site classification.
5. Before shared sightings: validate enclosure data, select a low-cost backend, define report expiry/confidence/moderation, then demonstrate two-device distribution and expiration with one marker per group.

## Evidence and boundaries

The October 11 initialization and October 13 instructions in this chat are confirmed owner direction. The accessible morning chat “WiFi Cellular Switch 񟿿” provides user statements requesting shared sightings, aggregation rather than twenty dots, and separate bear enclosure sections. Only the returned portion of that chat was available; no unobserved GPS thresholds or prior approvals are inferred.

GPS is an uncertain browsing aid. Client-side geofencing does not verify attendance or prevent spoofing. It cannot reliably identify an enclosure or individual animal. Crowd reports must remain distinguishable from Zoo-verified information. Public safety reporting must never imply dispatch to Zoo staff.

Official pedestrian pathways, map rights/alignment, accessibility authority, operating cost, moderation ownership, and field performance remain unresolved. No personal GPS history is saved by the current client. Shared sightings will require a separate privacy/data-retention design.

## Working records

PROJECT_MASTER.md defines scope; ARCHITECTURE.md defines components/contracts; DECISIONS.md records authority and provisional choices; ROADMAP.md sequences milestones; BACKLOG.md tracks acceptance gates; SESSION_LOG.md records evidence. Keep synced project files and sources/ read-only; edit the cloned repository. Historical session entries retain their original dates and are not current-state assertions.
