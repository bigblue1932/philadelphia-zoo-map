# Backlog

Updated October 13, 2026. Implementation and field validation are tracked separately.

| ID | Priority/status | Work item | Acceptance/evidence |
| --- | --- | --- | --- |
| B-01 | Partial | Reconcile earlier conversations | October 13 sightings excerpt retrieved; earlier morning details unavailable. |
| B-02 | Complete for prototype | Repository and backup | main and origin verified at 33a08de before this checkpoint. |
| B-03 | Partial | Map provenance and coordinates | OSM basemap and perimeter source recorded; exhibit/enclosure and field alignment pending. |
| B-04 | Implemented; phone gate open | Mobile map | Desktop browser rendering verified; test actual phone controls/layout. |
| B-05 | Implemented; field gate open | GPS, accuracy and failure handling | v0.1 automated checks; extended v0.2 regression checks. |
| B-06 | v0.1/v0.2 published; phone gate open | Pages publication | HTTPS v0.2 verified at bb734ac; actual phone acceptance remains pending. |
| B-07 | Open | Zoo-ground GPS field test | Phone/OS/browser, signal, accuracy, boundary behavior and proceed/revise/pause findings; no public personal traces. |
| B-08 | Later | Validated path graph and routing | Source/rights, mapped routes and field-validated destinations. |
| B-09 | Next | Shared report service | Select vendor/cost, server validation, privacy/retention and moderation; two visitors see shared reports. |
| B-10 | Later | Accessible pathways | Authoritative attributes; unknown data stays unknown. |
| B-11 | Later | Quiet exhibits | Reviewed definition, evidence and uncertainty. |
| B-12 | Next for sightings; broader notices later | Visitor notices | In-app sighting updates/mute first; trusted official notices later. |
| B-13 | Later | Public safety workflows | Authority and dispatch boundaries validated. |
| B-14 | Implemented; field gate open | Polygon geofencing | Fresh clearly inside/outside fixes confirm; circle-edge overlap, poor fixes and unavailable GPS remain uncertain. |
| B-15 | Implemented | Off-site mode | Remote fix never recenters map; no remote marker; arrival can recover; stale remote status expires. |
| B-16 | Implemented; browser gate | Map restrictions | Drag/keyboard/zoom restricted to Zoo vicinity across resize/orientation; overview recovers view. |
| B-17 | Implemented; field gate open | Accuracy safeguards | Invalid, stale, future/duplicate/out-of-order and jumped fixes suspend following; two good fixes recover; stop clears data. |
| B-18 | Next | Enclosure inventory | Separate physical sections have stable IDs, public labels/species, sources and validation. Explicit selection when GPS cannot resolve adjacent sections. |
| B-19 | Next | Report aggregation | Twenty same-group reports produce one marker; retries/same contributor do not inflate distinct evidence; separate sections stay separate. |
| B-20 | Next | Confidence and expiry | Defined freshness/conflict/independence rules with explainable labels; expired reports stop contributing; no invented certainty. |
| B-21 | Next | Live map events/notices | Two-device update; duplicate/reordered events produce no duplicate markers/notices; reconnect reconciles; mute and focus preservation; offline/stale states visible. |
| B-22 | Next | Sightings integrity/privacy | Server-side validation/rate limits and moderation; minimized visitor data; no precise public visitor GPS; geofence never treated as attendance proof. |

Implementation completion is not field acceptance. No backend, real shared report, validated enclosure inventory or confidence calculation exists yet.

## Conservation governance and survey work

| ID | Status | Work item | Acceptance |
| --- | --- | --- | --- |
| B-23 | Design documented | Conservation content model | Linked species/animals/enclosures/zones/stories/programs/media; source and review dates; no fabricated verified records. |
| B-24 | Reference reconciled; implementation open | Domain roles/access | Six domains, five roles; explicit scoped assignments; admin is not an automatic domain approver; backend denies unauthorized requests. |
| B-25 | Design documented; implementation open | Content lifecycle/approvals | Required reviewers by changed fields; exact-revision approvals; history, rollback and scheduled visibility; clarify publishing/self-approval policy. |
| B-26 | Open prerequisite | Initial Survey Mode | Capture landmark/path/viewing-zone observations with provenance; domain/map review before approved geographic publication. |
| B-27 | Open | Basic Con Ed editor | Protected editor updates interpretation without app release; Animal Care facts remain under appropriate review. |
| B-28 | Open | Three representative pilots | Verified single-animal/bear, group/flamingo and free-roaming-zone content; sources/media rights/accessibility and required approvals. |
| B-29 | Open | Visitor conservation integration | Correct approved content at selected enclosure/zone; schedules/expiry enforced; drafts inaccessible publicly. |
| B-30 | Design recovered; implementation later | Accessibility/sensory layers | Validated path attributes; accessibility in routing; optional sensory overlay; no required disability disclosure. |
| B-31 | Design recovered; implementation later | Events/domain operational engine | Domain-specific authority, event thresholds/escalation/acknowledgement/resolution/audit; normal events separate from safety. |

The source identifies domains and roles, but does not select actual staff accounts, backend/identity provider, complete draft-view/action grants, final publishing authority, self-approval rules or emergency overrides. These remain explicit implementation decisions.
