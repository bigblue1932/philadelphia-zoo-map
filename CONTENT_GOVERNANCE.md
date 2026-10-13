# Content accessibility and domain governance

Design reference reconciled October 13, 2026. Source: Content, Accessibility & Domain Governance Architecture, v0.1, October 13, status Design checkpoint; supplied by the owner as the reference for continuing this work. This records the design, not evidence of deployed authorization, assigned staff accounts or official Zoo approval.

Source artifact: Philadelphia_Zoo_Map_Content_Governance_Architecture_v0.1.docx . SHA-256: fdb0ba423c2d19e2b9212f7f0a9c3d7de67632cdbe633f58445a6f356ad65204 . The original remains unchanged; this Markdown captures its substantive architecture without uploading the original file or its metadata.

## Governing principle

People closest to the information own it. IT owns the platform that lets them manage it safely. One authorization and workflow framework supports publishing, geographic changes, operational events and approvals. Domain means organizational knowledge/ownership scope here.

## Ownership domains from the reference

| Domain | Primary authority | Examples |
| --- | --- | --- |
| Conservation Education (Con Ed) | Visitor education and conservation interpretation | Species descriptions, conservation stories, educational media, calls to action. |
| Animal Care / Keeper Areas | Animal and enclosure factual authority | Animal facts, exhibit assignments, enclosure/viewing-zone validation. |
| Public Safety | Safety and emergency operations | Emergency alerts, safety closures, assembly/avoidance information. |
| Garden Services / Facilities | Physical facilities and maintenance | Restrooms, fountains, benches, pathway conditions, maintenance closures. |
| Guest Services / Marketing / Public Relations | Public events and normal visitor communications | Events, promotions, scheduled announcements, map-linked event locations. |
| IT / Platform Administration | Platform integrity and technical administration | Identities, roles, authorization, integrations, map platform and workflow configuration. |

Conservation interpretation and animal facts can occur in the same visitor card. Route the relevant fields or revision to the responsible domain(s); editing rights in one domain must not bypass another domain's required approval. Marketing/event authority does not confer emergency messaging authority.

## Roles from the reference

| Role | Designed responsibility | Implementation constraint |
| --- | --- | --- |
| Editor/Contributor | Create/propose content or data within assigned domain. | Assignment must carry domain and record scope. |
| Surveyor | Collect field geography and operational map observations. | Survey submission is not automatic map publication. |
| Domain Approver | Approve changes for a particular knowledge domain. | Approval applies only to assigned domain and exact revision. |
| Map Approver | Approve geographic changes when required. | Geographic review may accompany domain review. |
| Platform Administrator | Manage identities, roles, workflows, integrations and configuration. | No automatic content authority across domains. |

Public visitors receive published visitor content; they are not staff Editors or Approvers. Specific named users, draft-view permissions, access assignment authority, self-approval/separation rules and final publishing permissions are not specified in the source. Define them before enabling staff actions. A person may have explicit multiple assignments; administrator status alone is insufficient.

## Workflow routing

| Change type | Domain review from the reference | Additional implementation review to configure |
| --- | --- | --- |
| Conservation story, interpretation, educational media, visitor action | Con Ed | Animal Care for changed factual animal/enclosure fields. |
| Animal facts, species/individual assignments, enclosure/viewing-zone records | Animal Care | Map Approver for changed geography. |
| Emergency information and safety closures | Public Safety | Geographic review when required; emergency timing/bypass policy remains unspecified. |
| Facilities and maintenance/pathway conditions | Garden Services / Facilities | Map Approver for changed geographic representation; other affected domains as needed. |
| Normal public events and announcements | Guest Services / Marketing / PR | Geographic review for changes to map features; do not reroute safety authority to Marketing. |
| Technical platform changes | IT / Platform Administration | Required domain review remains intact when a change also changes domain content. |

The source permits multi-domain approval; it does not provide a complete per-field routing matrix or assign emergency override authority. The additional-review column is a proposed implementation interpretation to configure and validate.

Source lifecycle: Draft → Review → Approved/Published → Versioned → Retired. Maintain revision history, author/approver identity, timestamps and rollback. Scheduled content has publication and expiration windows.

Implementation interpretation: every edit creates a revision; publishing points to an approved revision, preserving the prior published revision until replacement. Required approvals attach to that exact revision and become invalid when relevant content changes. Preserve historical versions throughout the lifecycle. Versioned records are history, not a requirement to hide a currently published record. A rollback that changes live content must pass the applicable route; withdrawal/correction permissions remain to be assigned.

## Conservation is a first-class object

Link species, validated individual animals where appropriate, exhibits/sighting zones, stories, media, assessed conservation status, verified Zoo programs and visitor actions. Let Con Ed update interpretation without an application release through an authenticated content service. Sightings can connect discovery, encounter, understanding and conservation action; they must not overwrite curated facts or imply content approval.

## Accessibility and sensory design

Accessibility is embedded in routing by default; sensory information is a visitor-controlled optional overlay. No disability or medical disclosure is required. Path data covers slope/grade, stairs, ramps, surfaces, elevators, benches/rest areas and temporary closures. Proposed routing choices are Easiest, Shortest and Step-Free; do not promise these until attributes and routes are validated.

Anchor existing Zoo brochure maps using known landmarks, then field-verify through Survey Mode after confirming map-use rights. Candidate persistent layers: Sensory-Friendly Areas, Animal Sightings, Restrooms, Food, Conservation and Events. Sensory descriptions need appropriate evidence and review; ownership is not explicitly assigned by the source and remains open.

## Events and operational routing

Events have title, date/time, location, description, media, visitor instructions and visibility window. Map-linked events may later support Take me there routing. Normal announcements remain separate from safety messaging.

One domain-based operational event engine should route visitor reports and staff events, with configurable thresholds, escalation, acknowledgement, resolution and audit history per type. Design for distinct policies and authority per event type; do not treat a visibility report as an emergency dispatch. No operational integrations or staff alert delivery currently exist.

## Deployment and enforcement

The present GitHub Pages application remains public and static. Restricted drafts, identities and approval actions require authenticated server-side storage and authorization. A public read endpoint delivers only approved, currently visible revisions. Public repository/static assets must not contain restricted material or credentials. Backend, identity provider, costs and retention remain unselected. This architecture does not create a staff login or modify account permissions.

## Reference milestone sequence and current reconciliation

1. Finish geofencing and initial Survey Mode. Geofencing is implemented in v0.2; field acceptance and Survey Mode remain open.
2. Design the conservation/content data model (current workstream).
3. Build the basic Con Ed editor and Domain Approver workflow after access/enforcement decisions.
4. Populate three validated representatives: single-animal/bear, group/flamingo and free-roaming habitat examples. These are test categories, not established enclosure/animal assignments.
5. Connect approved content to the visitor map and future routing.

The prior shared-sightings roadmap remains in scope. The reference supplies a recommended conservation sequence, not evidence that any editor/backend/content is implemented. The owner has directed current work on conservation and governance; no broader operational or public safety deployment is inferred.
