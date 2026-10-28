# Philadelphia Zoo Mapping Platform — Architecture Direction and Azure Deployment Plan
**Decision checkpoint:** October 28, 2026
**Status:** Proposed architecture and agreed direction; not yet implemented or security-approved.
**Repository baseline:** v0.3.2; see docs/checkpoints/2026-10-28/TECHNICAL_AUDIT_AND_NEXT_STEPS.md.

## Executive summary
The Zoo mapping prototype is evolving into a single application with a public Visitor Workspace and an authenticated Staff Workspace. The shared platform will support Zoo-provided ArcGIS/GeoJSON layers, staff-only underground infrastructure tracing, visitor routing and eventually camera-based augmented-reality wayfinding. The Zoo uses Microsoft Entra ID; Azure is the preferred initial hosting direction. Use a Zoo-owned subscription and tenant for Zoo workloads, separate from the owner's personal Azure website.

## Confirmed stakeholder direction
- Planning/Trinity GIS deliveries are expected to include layered pathway information and underground assets (conduit, cabling, pipework and other utilities) in ArcGIS/GeoJSON-compatible formats; actual files, schemas, authority and dates remain pending.
- Prefer **one app**, with visitor experience by default and staff capabilities after employee sign-in; permissions vary by role.
- Visitors should eventually choose a destination such as the closest restroom and see AR directional arrows over the phone camera view.
- Authorized staff should be able to select utility layers and trace mapped infrastructure while walking the Zoo.
- Azure is preferred for initial hosting because current on-premises infrastructure is not considered sufficient. Owner has a separate personal free Azure site, type not yet verified. Zoo deployment must be Zoo-owned.

## Logical architecture
1. **Single frontend:** visitor map by default; authenticated staff workspace. Existing Leaflet UI and v0.3.2 Follow Me behavior remain the baseline.
2. **Identity and authorization:** Microsoft Entra ID for staff; app roles mapped to approved groups/claims; server-side permission checks on every restricted endpoint and feature. Do not equate admin privileges with universal access. Visitor routes need no staff sign-in.
3. **Public GIS delivery:** only reviewed/published pathways, POIs, accessible attributes, and visitor-safe content. Public tiles/data are explicitly approved for publication.
4. **Restricted GIS delivery:** separate protected API/data services for underground infrastructure, internal enclosure operations and staff content. No restricted data embedded in public JavaScript bundles, static assets, browser caches or public GeoJSON URLs. Enforce least privilege and audit access.
5. **GIS layer catalog:** identifier, source, geometry/CRS, sensitivity, owner, review status, role permissions, style, freshness, routing eligibility and AR eligibility. Review and sanitize GIS content before publishing.
6. **Shared routing engine:** graph built from approved pedestrian paths; destinations and route instructions returned independently of the renderer. Closest restroom means shortest *usable* route, accounting for accessible routes and operational closures, not just straight-line distance.
7. **Presentation adapters:** 2D Leaflet map now; future AR camera overlay consuming the same route instructions. ARCore/ARKit or hybrid/native options require device and feasibility assessment. GPS alone is not sufficient for stable ground-anchored arrows; combine camera tracking, inertial sensors, and reference localization as needed.
8. **Operations:** dev/test/prod separation, identity/security review, secrets management, telemetry with privacy controls, backup, incident procedures, budgets and cost alerts.

## Staff roles (proposed, not yet authorized)
Visitor; Employee; Facilities; IT Infrastructure; Animal Care; Public Safety; GIS Editor; Platform Administrator. Access can be additive and scoped by dataset and action; existing content-governance domain approvers remain relevant. Confirm exact roles and layer owners with Zoo leadership.

## Security guardrails
- Separate public/restricted APIs and data stores or enforce equally strong logical isolation; deny by default.
- Validate Entra access tokens server-side, verify issuer/audience/expiry, apply authorization to data queries, and audit sensitive requests.
- Do not rely on hidden UI controls, client-side role checks, or public ArcGIS layer URLs as security boundaries.
- Staff location and infrastructure data require retention, logging, device/offline caching and incident-response policies.
- AR utility overlays are approximate and **must not** substitute for field utility locating, excavation permits or dig clearance.
- GIS delivery may include sensitive utility locations: no real restricted data in personal subscriptions, public repositories, or publicly accessible test deployments.

## Azure development strategy
- **Step 0:** In portal.azure.com, sign in with Zoo identity; check Microsoft Entra tenant and Azure **Subscriptions**. Verify Zoo-owned subscription, billing, RBAC permissions and approved resource region. If none exists, obtain authorized Zoo subscription/procurement rather than using the personal one.
- **Step 1:** Create a dedicated development resource group (example `rg-philadelphia-zoo-map-dev`), tags, budgets and cost alerts.
- **Step 2:** Provision Azure Static Web Apps (Free tier if appropriate) for the existing static Leaflet frontend; connect GitHub repository and main branch using a reviewed GitHub Actions deployment workflow. Confirm correct app root/output settings and protect deployment credentials. Retain GitHub Pages until Azure smoke tests pass.
- **Step 3:** Verify HTTPS, OSM/Leaflet loading, map controls, geolocation permission behavior and phone Follow Me acceptance tests.
- **Step 4:** Add protected backend/API, using Azure Functions or another approved compute service; implement Entra sign-in and server-side roles. Confirm plan/feature constraints and costs before choosing authentication integration. Use fictional GIS data for security tests.
- **Step 5:** Integrate authoritative Zoo GIS sources only after approval, access control, licensing, data classification, CRS transformation and geometry validation. Maintain separate publication process for public layers.
- **Step 6:** Build pedestrian graph/routing and validate accessibility. Prototype restroom AR with explicit device-compatibility and localization tests.
- **Step 7:** Reproduce environments via Bicep or equivalent infrastructure-as-code, plus CI/CD, security review and release gates.

## Phasing and acceptance
- **v0.3.3:** Complete independent Node tests and Zoo-ground GPS/Follow Me validation; architectural specifications can proceed in parallel. No production infrastructure data.
- **Architecture foundation:** formal data classifications, layer catalog contract, API contract, authentication/authorization threat model and deployment design.
- **Staff pilot:** Entra sign-in, secure backend, role-based workspace and synthetic layer; penetration/access-control checks including anonymous attempts.
- **GIS integration:** ingest authoritative public and restricted layers with approved publishing workflow.
- **Routing and AR:** validate path graph, restroom selection, device compatibility and camera overlay positioning. Provide 2D fallback.

## Decisions and unknowns
**Decided direction:** single app/two workspaces; Entra staff identity; secure server-side access; Azure-first Zoo-owned hosting; routing shared by map and AR; no rewrite of current prototype.
**To verify:** Zoo subscription exists; staff permissions and admin ownership; exact Azure free-tier limits and budget; GIS formats, coordinate systems, licenses, hosting model and release approvals; accessibility attributes; AR platform choice and localization method; staff offline access and data-retention policies.
**Next interactive step:** user opens Azure portal under Zoo account, selects Subscriptions, and reports whether a Zoo-owned subscription is visible.

## Audit reference
See technical audit checkpoint for source findings, thresholds (50 m visitor, 20 m survey), approximate OSM perimeter, and 26 tests reported previously but not independently rerun. No changes to runtime code are made by this documentation checkpoint.
