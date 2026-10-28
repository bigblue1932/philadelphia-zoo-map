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

## Version 0.3 Survey Mode implementation

Owner requested Survey Mode implementation October 13. The app now collects browser-local draft landmark/facility points, pathway segments and viewing-zone polygons with GPS/manual source evidence, field notes, unknown-or-observed surface/stairs attributes and proposed review labels. GPS capture requires confirmed on-site status with accuracy at most 20 m. Drafts are memory-only unless the user explicitly opts into device storage; GeoJSON export/import supports review handoff. No role, submission, approval or publication authority is implemented. See SURVEY_MODE.md. Real phone capture and Zoo-ground alignment remain unverified.

## October 18 Follow Me reliability

Field feedback reports generally accurate walking GPS but intermittent following loss and variable disabled-button time. Repository checkpoint recovery is documented in docs/checkpoints/2026-10-18/README.md. The dedicated fix branch implements v0.3.2: retained follow intent with waiting/automatic recovery, user-gesture pauses, old-callback protection, cache lifecycle recovery and bounded coordinate-free diagnostics. Location/geofence/survey thresholds remain unchanged; GIS matching stays separate. See FOLLOW_ME_RELIABILITY.md. 26 automated tests pass; actual post-fix phone/Zoo-walk acceptance remains pending.

## October 28, 2026 — Platform architecture and Azure hosting direction

**Current direction (not yet implemented):** Expand the single visitor map into one application with two workspaces: public Visitor and Entra ID-authenticated Staff. Staff permissions are server-enforced and scoped to approved GIS layers, including future underground conduit, cabling and pipework; public visitors receive only published layers. Zoo Planning/Trinity ArcGIS/GeoJSON pathway and infrastructure datasets are anticipated but not yet integrated or validated. Introduce a GIS layer catalog and shared pedestrian routing engine so conventional 2D navigation and future camera-based AR wayfinding can consume the same route. AR restroom arrows require device/localization feasibility tests; GPS alone cannot anchor precise ground overlays. Infrastructure AR must not be used as dig-clearance evidence.

**Hosting direction:** Azure Static Web Apps is the initial proposed public frontend host, with a protected API/backend and Entra ID for staff. Use a Zoo-owned Azure subscription and tenant; keep Zoo workloads separate from the owner's personal free website. Current step is to check the Zoo Azure portal's Subscriptions page and confirm authorized subscription/resource permissions. Hosting, security architecture and costs remain to be verified. Existing GitHub Pages deployment and v0.3.2 code remain unchanged.

**Plan and decisions:** [Platform Architecture and Azure Plan](docs/checkpoints/2026-10-28/PLATFORM_ARCHITECTURE_AZURE_PLAN.md). The earlier [Technical Audit and v0.3.3 Plan](docs/checkpoints/2026-10-28/TECHNICAL_AUDIT_AND_NEXT_STEPS.md) remains the field validation gate. Historical earlier statements in this master document reflect their original checkpoint dates; the October 28 entry supersedes their current-scope and Survey Mode implementation status where inconsistent.

## October 28, 2026 — AR implementation sequence confirmed

Owner approved an incremental AR proof of concept: **Phase 1: floating directional arrow** over a phone-camera view, using a small set of manually defined, clearly provisional visitor destinations (e.g., restroom), plus destination label and approximate distance. Reuse the existing GPS position and obtain phone orientation where available. Provide a conventional-map fallback; if location or heading confidence is inadequate, show uncertainty instead of misleading directions. Confirm camera/orientation permission, Android/iOS browser compatibility, and on-site accuracy during acceptance testing. This is an experiment, not yet implemented.

**Phase 2:** connect the same navigation interface to Zoo-authorized pedestrian pathway GIS and route instructions, rather than straight-line bearing. **Phase 3:** investigate camera-tracked ground-anchored arrows aligned to actual paths, including platform feasibility and localization accuracy. The floating-arrow prototype may be developed on existing HTTPS GitHub Pages before Azure migration; keep it feature-gated and do not disrupt v0.3.3 reliability work. No dates or accuracy guarantees are committed. This sequencing supersedes any assumption that pavement anchoring is required for the first demo.

## October 28, 2026 — AR sponsorship and membership entitlements

Owner confirmed the intended commercial model for future AR: approved sponsor advertisements display **by default** in designated AR advertising zones for general visitors. Non-members may eventually purchase an optional ad-free subscription. **Ad-free AR should also be included as a complimentary benefit for active Philadelphia Zoo members**, per owner direction; pricing, sponsorship policy, membership eligibility verification and organizational approval remain to be determined.

Design one shared application with separate AR navigation, ad placement, and entitlement services. An `ad_free_ar` entitlement may be granted by an active Zoo membership or paid subscription, with extensibility for promotions. Integrate with the Zoo's existing membership system when its capabilities and authorization are confirmed; do not build a separate unverified membership registry. Navigation, accessibility, and emergency features remain available without payment or membership. Emergency mode suppresses all advertisements. Restrict ads to approved GIS placement zones; prevent obstruction of animal views, pathways, safety messages and navigation; avoid intrusive audio/flashing and behavioral targeting based on precise location. Offer aggregate privacy-preserving reporting rather than individual movement tracking.

Implementation order: first floating-arrow AR navigation prototype; later a test ad in a designated synthetic zone; then placement governance and anchoring; lastly subscription payments and membership entitlements after policy and integration review. No ad-serving, payment or membership feature is implemented by this documentation update.

## October 28, 2026 — AR prototype integration decision

Owner approved integrating the AR proof of concept **inside the existing GitHub Pages visitor mapping application**, not as a separately deployed app or a prerequisite Azure migration. Expose a clearly labeled, feature-gated **AR Preview** button that opens a dedicated camera-based AR view, with an easy return to the conventional Map View. Keep AR code in separate modules and preserve the current map, Follow Me, survey and GPS reliability behavior. Reuse existing location and destination interfaces where suitable.

**First prototype scope:** camera permission and live preview; floating directional arrow; destination name and approximate distance; two or three manually configured test destinations. Heading/orientation support and confidence indicators must be tested on real devices. Until authorized Zoo pathways are integrated, a floating arrow indicates **general bearing only, not a safe or accessible walking route**. If sensors or camera permissions fail, offer map fallback rather than misleading guidance. Treat AR as experimental and easily disabled.

**Next demonstration:** one sample AR sponsor sign in a specifically approved/test zone, initially an approximate overlay, not claimed as physically anchored. Later integrate Zoo GIS routing, stable world-anchored placement, advertising-zone governance, and membership/subscription entitlements. GitHub Pages is sufficient for this client-side proof of concept; secure staff GIS, campaign administration, payment processing and membership verification require authorized backend services, likely on Zoo-owned Azure infrastructure. This is an approved design checkpoint, **not a claim that AR code has been implemented or field-tested**.


## October 28, 2026 — Digital Visitor Companion and ticketing decoupling

**Product direction confirmed:** evolve the Philadelphia Zoo Mapping App into the Zoo's **complete Digital Visitor Companion**, modeled on the end-to-end visitor journey rather than navigation alone. This is a product vision and phased roadmap, not a claim that these capabilities exist today.

- **Before the visit:** public exploration of exhibits and programs, dining and accessibility information, itinerary planning without requiring ticket purchase or account creation, then ticket purchase and membership recognition when available.
- **During the visit:** current mapping/GPS foundation, future authorized-path routing and AR, nearby discovery, schedules and timely notices, accessibility and sensory-friendly options, optional consent-based group location sharing, and educational engagement.
- **After the visit:** optional digital Zoo Passport, conservation learning, revisit planning and membership engagement. Keep core visitor information, navigation, accessibility and emergency functionality available without paid entitlements.

**Current ticketing platform:** Philadelphia Zoo uses **Ticketure** for ticket sales and memberships. Owner reports an approximate **$90,000/year** cost and is separately evaluating a potential **Zoo-owned ticketing replacement**. Treat that replacement as a distinct initiative with its own feasibility, cost, security, operations, PCI/payment, refund, support, migration and governance analysis; no replacement decision or delivery commitment has been made.

**Architecture principle:** the Zoo should own the visitor experience independently of the ticketing provider. Introduce a provider-neutral ticketing/membership integration boundary so the companion can connect to Ticketure initially **only if contract, API access and security requirements allow**, and later to a Zoo-owned or other platform without redesigning visitor-facing workflows. Model ticket purchase/lookup, admission eligibility, membership verification and entitlements as backend-mediated capabilities, not browser-held provider credentials. Never presume Ticketure APIs, entitlements, or data access without verification. Keep public visitor identity separate from Zoo staff Entra ID access; use server-side authorization for ticket/member status and planned `ad_free_ar` benefit.

**Sequencing:** continue map/AR field validation; define visitor journey and integration contracts; investigate Ticketure capabilities and Zoo permissions; build planning and discovery features that do not depend on ticketing; implement ticket/membership integration after approved discovery. Track the Zoo-owned Ticketure replacement as a related but separately governed project. Existing GitHub Pages prototype does not process ticket payments or verify membership.
