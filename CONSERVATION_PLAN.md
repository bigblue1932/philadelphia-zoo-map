# Enclosure conservation content and approvals

Updated October 13, 2026 using the supplied v0.1 Content, Accessibility & Domain Governance Architecture. See [CONTENT_GOVERNANCE.md](CONTENT_GOVERNANCE.md) for source provenance, all six domains, five roles and lifecycle. This replaces the earlier draft's unresolved domain names. Account assignments and enforcement are still unimplemented.

## Scope and content ownership

Conservation is a foundational pillar and a first-class data object. Con Ed owns visitor interpretation, stories, educational media and calls to action. Animal Care is factual authority for animal information, exhibit assignments and enclosure/viewing-zone validation. A combined card can require both domains' reviews. Map Approver review applies to geographic changes when configured. IT administers identities, roles and workflows without inheriting content authority.

## Proposed data model

| Entity | Fields and relationships |
| --- | --- |
| Species profile | speciesId; common/scientific names; assessment system/status/date/geographic scope; population trend; threats; source references. |
| Individual animal | animalId when appropriate and validated; speciesId; public factual profile; provenance. Do not infer identity from GPS. |
| Enclosure or viewing zone | stable enclosureId/sectionId; exhibitId; species/animal links; validated viewing geometry; source/validation date. Separate physically distinct sections. |
| Conservation story | contentId; species/animal/enclosure/zone links; visitor summary; threats/conservation narrative; verified program links; visitor actions; educational media. |
| Program | programId; organization; documented Zoo involvement; source references; review date. Do not infer Zoo participation from a species' general conservation needs. |
| Media | mediaId; accessible alternative text/captions/transcript where needed; rights/credit; asset reference. |
| Content revision | revisionId; contentId; changed fields; author; source evidence; required domain/map reviews; approvals; lifecycle state; publish/expiration window. |
| Role assignment | identity/group; role; domain; enclosure/record scope; grant/revocation audit. No actual people/accounts assigned yet. |

Share species-level facts across enclosures while preserving enclosure-specific interpretation and source evidence. Label assessment date/geographic scope; unknown facts remain unknown. Retain facts and stories separately so a Con Ed copy edit need not rewrite factual animal assignments.

## Proposed workflow implementation

1. An assigned Editor/Contributor creates a draft revision for permitted records.
2. Submission computes required reviews from changed data types, including Con Ed, Animal Care and Map Approver where applicable.
3. Approvers act only within their explicit assignments. Changes requested return the revision for correction; edits produce a new revision and require fresh applicable approval.
4. Publish only the reviewed revision after all required approvals and the configured publication window. Keep the previous approved version live during editing.
5. Expire/retire according to the visibility window, preserving history. Trace publication, withdrawal and rollback to an authorized identity/action.

The supplied lifecycle is Draft → Review → Approved/Published → Versioned → Retired. The steps above elaborate it for implementation. Final publishing authority, self-approval rules, multi-domain field routing, draft visibility and emergency correction/withdrawal privileges remain open; no default administrator bypass is granted.

## Delivery design

Con Ed updates content through a protected service/editor without an app release. The public map reads only approved revisions within their visibility windows. Cache refresh/failure handling must preserve a clear last-reviewed date and avoid serving draft content. Restricted drafts, identities and workflow actions cannot be protected by JavaScript controls on GitHub Pages; they require real server-side authorization. Backend, identity integration and cost limits are not selected.

## Three representative content pilots

| Pilot category from source | What to validate |
| --- | --- |
| Single-animal/bear example | Distinct enclosure/section selection; species fact authority; optional individual identity only with evidence. |
| Group/flamingo example | Shared species profile and group interpretation without inventing individual identities/counts. |
| Free-roaming habitat example | Validated viewing-zone association without representing a current sighting as a fixed animal assignment. |

These are planned categories. Actual exhibit IDs, animals, conservation assessments, media and Zoo programs must be supplied/verified before publication. No fabricated public records are generated in this checkpoint.

## Accessibility and visitor connection

Provide readable structured text, meaningful link labels and reviewed media alternatives. Visitors need not disclose disability or medical information. Conservation can connect a visitor's sighting to educational content and action; confidence scores remain evidence for sightings, not approval or conservation authority. Accessibility-aware routing and optional sensory overlays follow the broader governance design, with validated data required before routing promises.

## Implementation gates

- Complete initial Survey Mode and field-validation plan; v0.2 geofencing remains provisionally validated in automation only.
- Select authenticated backend/identity and explicit grants before enabling Editors/Approvers.
- Validate schema, required sources/media accessibility and field-level review routing.
- Test unauthorized read/write/approve/publish access, review bypass, stale-revision approvals, schedule/expiry and rollback.
- Populate three representative records with verified enclosure/source data and exercise Con Ed/Animal Care/map review where required.
- Deliver approved public content to selected map enclosures, with source/review dates and no draft exposure.

This checkpoint reconciles documentation and implementation requirements. It does not implement Survey Mode, a conservation UI, staff authentication, an approval engine or a content backend.
