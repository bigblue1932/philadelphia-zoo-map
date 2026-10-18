# Roadmap

Updated October 13, 2026. No completion dates promised.

1. **M1 — v0.1 map/GPS baseline:** Source pushed and Pages rendering verified. Real phone and Zoo-ground acceptance remain pending.
2. **M1.1 — v0.2 GPS safeguards (implemented; field gate open):** Implement geofence, off-site browsing, bounds and accuracy protections. Validate transitions in automation and browser, publish the checkpoint, then tune perimeter and policy from phone/Zoo-ground findings.
3. **M2 — enclosure-specific shared sightings (planned workstream):** Validate physically separate enclosures/sections and species metadata; choose a low-cost shared service; define report freshness, contributor deduplication, moderation and confidence. Demonstrate one aggregate marker per enclosure/group on two devices, with reliable expiry and reconnect behavior. Add rate-limited real-time map notices and mute.
4. **Later — inclusive navigation:** Incorporate the permitted official pedestrian map, validate a pathway graph and accessibility attributes, and define quiet-exhibit information.
5. **Later — broader notices/public safety:** Trusted sources, consent, workflows, authority and operational ownership remain required. The sightings milestone does not create staff dispatch or emergency alerts.

This sequencing supersedes the original October 11 proposed M2/M3 order based on the October 13 owner request. Accessibility, quiet experiences and safety remain in scope. Production approval and Zoo authorization are separate from prototype milestones.

## Current conservation and governance workstream

The owner now requests conservation content/access/approvals. The supplied architecture recommends:

1. Finish initial Survey Mode and validate the implemented geofence in the field. Survey Mode must not publish geometry without required map/domain review.
2. Design the first-class conservation/content model and source requirements (documented in this checkpoint).
3. Select identity/backend enforcement and build a basic Con Ed editor and Domain Approver workflow.
4. Populate three verified pilots: single-animal/bear, group/flamingo and free-roaming habitat categories.
5. Integrate approved content with the visitor map and subsequently validated routing.

This adds the recovered conservation sequence to the prior roadmap. Shared sightings, aggregation and real-time map notices remain planned; no authenticated editor/backend or Survey Mode is delivered yet. Cross-domain operational and emergency features require separate authorization and verification.

## Survey Mode implementation checkpoint

Initial draft collection is implemented in v0.3; phone/field acceptance remains open. The next conservation step is the first-class content model and authenticated editor/approval service. Survey exports can seed proposed geometry with evidence after Map Approver/domain review; they cannot publish themselves. Brochure alignment, richer measured accessibility attributes and operational integration remain future work.

## October 18 immediate field reliability gate

Prioritize v0.3.2 Follow Me reliability verification on the Zoo phone before interpreting further walking tests. Check automatic recovery, deliberate-panning pause, no tap/programmatic cancellations and foreground return. This fix is independent of ZMAP-GEO-001 pathway matching and GIS acquisition. Conservation, Survey Mode and shared sightings remain in their existing workstreams.
