# Decisions

Updated October 13, 2026. Owner approval does not imply Zoo approval.

| ID | Status | Decision | Evidence |
| --- | --- | --- | --- |
| D-001 | Confirmed | Independent low-cost visitor-app proof of concept. | Owner initialization, October 11. |
| D-002 | Confirmed | Preserve navigation, sightings, GPS, accessibility, quiet exhibits, notices and safety scope. | October 11 initialization. |
| D-003 | Confirmed | Browser map, GitHub Pages publication and Zoo-ground phone validation. | October 11 initialization. |
| D-004 | Confirmed | Six master documents and GitHub backup. | October 11 initialization. |
| D-005 | Implemented proposal | Static client processes GPS in memory with no location-history backend. | v0.1 implementation; consistent with current owner GPS scope. |
| D-006 | Proposed | Initial M1 acceptance criteria and formal proceed/revise/pause field gate. | October 11 master draft; field results pending. |
| D-007 | Confirmed | Repository bigblue1932/philadelphia-zoo-map; Leaflet, OSM and Pages. | Owner request, October 11. |
| D-008 | Confirmed | Official pedestrian pathways are incorporated later. | October 11 owner request; no new pathway authorization. |
| D-009 | Confirmed | GPS geofencing, off-site mode, map restrictions and accuracy safeguards take first priority. | Owner request, October 13. |
| D-010 | Confirmed | Implement GPS safeguards during this checkpoint. | Owner response “Also implement GPS safeguards now”, October 13. |
| D-011 | Confirmed | Next milestone includes distinct enclosures, aggregation, confidence and live map updates. | October 13 request; morning chat user statements on shared reports, duplicate dots and separate bear sections. |
| D-012 | Provisional implementation | Use OSM perimeter snapshot, 50 m accuracy cap, 10 m edge buffer, 30 s stale limit and two-fix confirmation; map bounds use 25% margin. | Engineering defaults in v0.2; no claim these were specified in the morning chat or field-approved. |
| D-013 | Proposed | Shared service, privacy-preserving report deduplication, expiry and confidence rules. | ARCHITECTURE.md; vendor, costs, identity and scoring remain open. |
| D-014 | Proposed | Real-time in-app notices with mute, deduplication, expiry and reconnect reconciliation. | ARCHITECTURE.md; does not select background push or emergency delivery. |

The accessible portion of “WiFi Cellular Switch 񟿿” (October 13) supplies the owner's sightings examples; earlier parts of that morning conversation were not returned. Record new evidence explicitly and retain the distinction between confirmed feature scope, implemented provisional policies and future design proposals.

## Conservation and governance reference reconciliation

| ID | Status | Decision/design | Evidence |
| --- | --- | --- | --- |
| D-015 | Confirmed scope | Work on enclosure conservation information, specified access domains and workflow approvals. | Owner request in this chat, October 13. |
| D-016 | Supplied design checkpoint | Six organizational domains and five scoped roles; IT administration does not grant all-domain content authority. | Uploaded Content, Accessibility & Domain Governance Architecture v0.1, sections 1–4. |
| D-017 | Supplied design checkpoint | Revisioned content lifecycle, history, author/approver audit, rollback and scheduled visibility. | Same source, section 5. |
| D-018 | Supplied design checkpoint | First-class conservation links and Con Ed updates without an app release; default accessibility and optional sensory overlay without medical disclosure. | Same source, sections 6–7. |
| D-019 | Supplied design checkpoint | Events owned by Guest Services/Marketing/PR; emergency authority remains Public Safety; one configurable domain event/workflow framework. | Same source, sections 8–9. |
| D-020 | Source-recommended sequence | Geofence/Survey Mode → content model → basic Con Ed editor/approver workflow → three representative pilots → map/routing integration. | Same source, section 10; source does not itself authorize operational deployment. |
| D-021 | Proposed implementation | Revision-specific approvals, approved-public read endpoint and backend-enforced domain/record actions. | CONSERVATION_PLAN.md; identity/backend, final publish/self-approval and grants remain open. |

The source is recovered design evidence provided to continue this work. No embedded text is treated as permission to contact staff, grant access, publish unverified conservation claims or activate emergency systems.

## Survey Mode checkpoint

| ID | Status | Decision | Evidence |
| --- | --- | --- | --- |
| D-022 | Confirmed scope | Implement initial Survey Mode. | Owner request October 13. |
| D-023 | Implemented provisional design | Device-local draft collection; explicit storage opt-in and GeoJSON handoff; no staff role/submission/publish controls. | v0.3 implementation consistent with existing static architecture; authenticated backend remains unselected. |
| D-024 | Provisional threshold | GPS survey capture needs confirmed on-site mode, positive accuracy at most 20 m and fix age at most 30 s; manual placement is separately labeled. | Engineering safeguard for field collection, not a guarantee of feature alignment; tune from field results. |

## October 18 reliability and checkpointing

| ID | Status | Decision | Evidence |
| --- | --- | --- | --- |
| D-025 | Confirmed scope | Implement Follow Me reliability fixes from October 18 discussion; resolve checkpointing first. | Owner current request; recovered technical requirements backup. |
| D-026 | Implemented fix | Preserve following intent across temporary location-quality/lifecycle interruptions, resume automatically when eligible, and keep user control actionable during GPS tracking. | v0.3.2; updates prior uncertainty behavior without changing quality/geofence thresholds. |
| D-027 | Verified recovery | Issue creation works; source checkpoints use committed Markdown, push and remote SHA verification. | Issue 1 and branch checkpoint 9f6c152; earlier issue-creation block did not reproduce and exact cause remains unknown. |
| D-028 | Implementation verification | 26 automated tests and browser rendering/diagnostics checked; real phone acceptance remains pending. | FOLLOW_ME_RELIABILITY.md and tests. |
