# Follow Me reliability checkpoint — October 18, 2026

## Repository and checkpoint recovery

Verified GitHub repository access with push/admin permissions and read the issue collection (initially empty). Local checkout e83ca3d was two documentation commits behind main. Fetched and fast-forwarded to 6a9f529, preserving the October 14 context checkpoint and ZMAP-GEO-001 specification. No local uncommitted changes or divergent commits were present.

The accessible October 18 morning chat reported a blocked issue-creation request and an emailed requirements backup, not a verified code commit. Recovered the relevant requirements from that email without copying private addressing/headers. The prior rejection's exact cause is unavailable; it is not inferred to be a Git push failure. Issue creation now succeeded as [issue 1](https://github.com/bigblue1932/philadelphia-zoo-map/issues/1).

Durable checkpoints use a Markdown commit, branch push and remote SHA verification. Issues track work; an issue or email alone is not a source-code checkpoint. Updated masters live in the cloned repository/GitHub. Synced project references outside the checkout remain read-only.

## Field finding and requested behavior

During a walking test, GPS was generally accurate and the camera stayed centered while Follow Me was active. At irregular intervals, following stopped without intentional panning; its button was disabled for a variable duration. This is a user-reported field finding, not an automated test or a proven single root cause.

- Retain the user's following preference through temporary GPS quality loss/errors/staleness and background/foreground transitions.
- Keep the last reliable location as uncertain/faded, refrain from unreliable recentering, and resume automatically after reliable updates return.
- Intentional drag pauses following and permits immediate reactivation; incidental taps and programmatic camera updates do not cancel it.
- Show distinct active, waiting and user-paused states; keep the control actionable while GPS is running.
- Retain bounded state/reason diagnostics without coordinates or visitor traces.
- Preserve location/geofence/survey safeguards. Path matching and geofence redesign remain separate future work.

## Investigation and delivery plan

Confirmed app.js suspend() currently clears following and disables the control on uncertainty/error/staleness. Existing tests explicitly expected that behavior. This provides a concrete mechanism consistent with the report; other field causes remain possible. There is no explicit Follow Me cooldown timer in the reviewed code.

Work on codex/follow-me-reliability from baseline 6a9f529. Separate following intent from fix eligibility, add targeted regressions and reason diagnostics, verify in browser, then merge/publish only after checks pass. Actual Zoo-walk acceptance remains a separate user/device field gate.

The October 18 discussion also mentions an October 19 GIS discovery meeting: authoritative pedestrian centerlines/connectivity, boundaries, CRS, formats, updates and public-use rights. No new GIS data or path snapping is implemented by this fix.
