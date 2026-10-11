# Philadelphia Zoo Mapping App — Project Master

Status: Draft for owner review  
Established: October 11, 2026  
Phase: Proof of concept  
Immediate milestone: Browser map → GitHub Pages test deployment → mobile GPS test on Zoo grounds

## Version 0.1 update — October 11, 2026

The owner confirmed GitHub repository `bigblue1932/philadelphia-zoo-map`, Leaflet.js, OpenStreetMap, and GitHub Pages. The v0.1 implementation includes an interactive Zoo-centered map, phone GPS detection/live tracking, an accuracy indicator, mobile controls, and permission/error handling. Official pedestrian pathways remain later work. Earlier unselected repository/map-stack statements below are superseded by this update. Broader requirements and draft acceptance criteria retain their existing status. Publication and Zoo-ground validation must be evidenced separately; see PROTOTYPE_V0_1.md.

## Purpose and vision

Develop a low-cost, Waze-style visitor application for the Philadelphia Zoo: an interactive map combining visitor navigation with timely, crowdsourced animal sightings. Preserve accessibility, quieter visitor experiences, visitor notifications, and public safety as core product requirements.

This is an independent proof of concept. No official Philadelphia Zoo approval, partnership, production readiness, or operational integration has been established. Project-owner approval of a requirement does not imply Zoo approval.

## Evidence and authority

The owner's October 11, 2026 initialization request is the confirmed source for this baseline. Previous development conversations were requested as context but were not available in the local project files or identified in the accessible chat listing. No historical decisions, technology selections, budgets, or approvals are inferred.

When earlier conversations become available, reconcile them against this baseline and record their source and any conflicts in DECISIONS.md. Every new proposal remains proposed until the owner approves it. This document itself awaits review.

## Confirmed requirements

“Confirmed” below means explicitly reaffirmed by the project owner in this session. It does not mean implemented, technically validated, or approved by the Zoo.

| ID | Requirement | Scope and current status |
| --- | --- | --- |
| R-01 | Low-cost visitor application | Browser-first proof of concept; spending limit and ongoing operating budget remain unspecified. |
| R-02 | Zoo navigation | Help visitors orient themselves and find exhibits and visitor destinations. Detailed routing behavior remains to be defined. |
| R-03 | Crowdsourced animal sightings | Preserve visitor reporting and discovery of sightings in the product scope. Shared reporting infrastructure, freshness rules, and moderation remain undecided. |
| R-04 | GPS positioning | Show a visitor's phone-derived position on the map and evaluate usefulness on Zoo grounds. Accuracy is to be measured, not assumed. |
| R-05 | Accessible pathways | Preserve pathway accessibility information and accessibility-aware navigation as requirements. Authoritative path attributes and validation are needed before making accessibility claims. |
| R-06 | Quiet exhibits | Help visitors identify quieter exhibit experiences. The definition, evidence, and whether conditions are static or visitor-reported remain open. |
| R-07 | Visitor notifications | Preserve relevant visitor notices. Categories, consent, delivery methods, and trusted sources remain open. |
| R-08 | Public safety functions | Preserve safety information and support functions in scope. Exact workflows and authorized operational sources remain open; the prototype is not an emergency-response system. |
| R-09 | Version-controlled GitHub backup | Prepare editable project documents and eventual application source for GitHub backup. Repository owner, name, visibility, and remote are not yet selected. |

## Immediate milestone M1

Build a working browser-based map prototype, publish it for testing through GitHub Pages, and test GPS positioning using a mobile phone on Zoo grounds.

Proposed acceptance criteria for owner review:

1. A mobile-friendly browser map loads, supports pan and zoom, and displays recognizable Zoo locations with documented coordinate sources.
2. A visitor can enable location, see a position marker and reported accuracy, and understand denied permission, unavailable location, and stale updates.
3. The committed prototype loads from a GitHub Pages HTTPS URL on the test phone; its release commit and URL are recorded.
4. A Zoo-ground test records phone/browser, test conditions, representative locations, perceived versus reported accuracy, update behavior, and usability findings. Avoid publishing personal location traces.
5. Findings support an explicit proceed, revise, or pause decision. A useful GPS result is not assumed in advance.
6. The interface identifies itself as an unofficial prototype; sample data is visibly labeled and essential map use remains possible without location permission.

The confirmed M1 commitment is map, test publication, and GPS field validation. Full routing, shared sightings, notification delivery, and operational safety features are not assumed to be M1 deliverables. Preserve them in the backlog rather than silently dropping them.

## Proposed implementation direction

These are proposals, not previously approved decisions:

- Start with a static browser application suitable for GitHub Pages, a small map library, and explicit map/exhibit data files.
- Keep live location processing on the device for the first test; avoid a location-history backend.
- Evaluate a geographically aligned map or licensed basemap after confirming data availability, accuracy, attribution, and usage terms.
- Demonstrate sightings with clearly labeled sample or device-local data before adding shared persistence.
- Add a validated pathway graph for routing and accessibility after the positioning experiment.
- Evaluate reporting expiry, abuse controls, quiet-condition reporting, and notification options in later milestones.

No map provider, framework, backend vendor, database, or cost commitment is selected yet.

## Boundaries and dependencies

Public-facing production deployment, official branding, staff dispatch, authoritative emergency alerts, and access to Zoo operational systems require separate decisions and any necessary Zoo authorization. The prototype must not imply that submitting a safety report reaches Zoo staff.

Map and pathway accuracy, map-asset permissions, GPS performance near buildings or tree cover, mobile connectivity, and maintenance ownership are unresolved dependencies. Accessible and quiet classifications must communicate uncertainty until validated. Crowdsourced observations must be distinguishable from verified Zoo information.

## Master documents and working rules

| Document | Role |
| --- | --- |
| PROJECT_MASTER.md | Vision, confirmed scope, milestone, boundaries, and review status. |
| ARCHITECTURE.md | Proposed components, data contracts, deployment, and technical unknowns. |
| DECISIONS.md | Sourced decisions, proposals, and approval history. |
| ROADMAP.md | Milestones and dependencies without invented dates. |
| BACKLOG.md | Traceable work items and acceptance outcomes. |
| SESSION_LOG.md | Work completed, evidence, validation, and next steps. |

Treat sources/ and all synced reference material as read-only. Maintain editable project artifacts outside sources/. Commit only intended project content; exclude credentials, private field-test data, and synced reference files from backup. Record implementation and approval changes in the appropriate master documents.

## Review points and next action

Review this draft's vision, confirmed requirements, M1 boundaries, and proposed acceptance criteria. Reconcile prior conversations when available. Then select the repository and map-data approach, build the browser prototype, publish the test version, and run the mobile field test. Documentation initialization does not mean the prototype has been built or deployed.
