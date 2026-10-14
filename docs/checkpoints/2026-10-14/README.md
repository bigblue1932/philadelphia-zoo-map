# Philadelphia Zoo Map checkpoint — October 14, 2026

## Preserved repository baseline

Inspected main at e83ca3d7ef8a2d3969aea6b2d8f43e6dccbbc355. The repository already contains the application, location policy, approximate boundary, Survey Mode modules, three test files, preview tooling, all six masters and governance/conservation guides. This checkpoint adds documentation only; code, tests and existing masters are preserved.

## Recent work already checkpointed

| Work | Existing evidence | Status and remaining validation |
| --- | --- | --- |
| v0.1 Leaflet/OpenStreetMap map and GPS | [Prototype guide](../../../PROTOTYPE_V0_1.md), historical implementation f16f555 and documentation 33a08de | Prior browser verification; real phone/Zoo-ground findings not recorded |
| v0.2 safeguards | [Prototype guide](../../../PROTOTYPE_V0_2.md), historical documentation 194f46f | Geofence, off-site mode, map bounds and accuracy/stale/jump protections implemented; approximate boundary/thresholds need field validation |
| Conservation/domain architecture | [Governance](../../../CONTENT_GOVERNANCE.md), [plan](../../../CONSERVATION_PLAN.md), historical checkpoint c9a70ed | Design documented; authenticated roles, approvals and content backend remain future work |
| v0.3 Survey Mode | [Survey guide](../../../SURVEY_MODE.md), baseline e83ca3d | Device-local draft geometry, GPS/manual vertices, optional persistence and GeoJSON import/export implemented; no automatic upload or publication |

The existing session log reports 20 automated checks and browser draft verification for v0.3. Those are historical validation records; tests were not rerun during this documentation-only checkpoint. No new live deployment or field-test result is claimed.

## Design continuity

Shared sightings remain planned: distinct enclosure/section IDs, aggregate reports rather than many duplicate dots, confidence/expiry and cross-device notices. Directly recovered owner comments in thread 6ace0a3c-9334-83ea-819a-36cd4504c286 emphasize separate bear sections and avoiding twenty markers for repeated reports. Do not assume that a visitor observation identifies a particular animal without validated identity evidence.

Conservation remains first-class. The recovered governance design contains six organizational domains and five scoped roles, with domain/geographic review, history and scheduling. Public static assets cannot enforce staff authorization. Survey review-domain labels are draft metadata, not role grants or actual approvals.

ASIS is a separate proposed animal-care/research system. Its October 14 Word master and Greeting Exchange describe precise-data restriction and sanitized visitor signals. Future integration may convey approved generalized visibility/enclosure information; raw precise animal coordinates must not reach this visitor app. No ASIS integration is implemented.

## Resume work

- Collect phone and Zoo-ground evidence for GPS policy, survey usability and geometry alignment.
- Recover/validate official pathway mapping and map-use rights.
- Define conservation/content data contracts, server-side authorization and review/publication policy before building a Con Ed editor.
- Preserve the shared-sightings backlog, moderation/deduplication/expiry questions and two-device validation gate.
- Specify ASIS sanitized public signals only after its operational access, welfare and data governance are defined.

## Source and gap register

- [Existing master](../../../PROJECT_MASTER.md) and [session log](../../../SESSION_LOG.md) preserve implementation chronology and limits.
- [Context recovery](CONTEXT_AND_GAPS.md) records chats, source-file provenance and unrecovered information.

October 14: inspected repository inventory, masters, governance, Survey Mode guide and prior development chat. Added an index of existing achievements, remaining gaps and the recovered ASIS boundary. No existing files overwritten.
