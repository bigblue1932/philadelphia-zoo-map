# GitHub Backup Setup

The editable application and master documents live in the cloned repository `zoo-map` and on GitHub at https://github.com/bigblue1932/philadelphia-zoo-map (public). Synced project-reference copies outside the checkout remain read-only and may be older. This section supersedes the original initialization guidance below.

For a checkpoint: inspect/fetch the remote, reconcile without overwriting work, commit intended code/docs on the appropriate branch, push, and verify the remote SHA matches the intended commit. Use an issue only to track work. Record tests and deployment separately; a pushed branch does not deploy GitHub Pages configured for main. An email backup is not a verified Git checkpoint. Exclude private location records, credentials and device survey exports.

The October 18 checkpointing issue is recorded in docs/checkpoints/2026-10-18/README.md. The earlier issue-creation block did not reproduce; issue 1 was successfully created. The historical setup checklist below is retained for reference, with repository selection already completed.

After reviewing the draft:

1. Select the GitHub owner, repository name, and visibility. Confirm what content may be public before enabling Pages.
2. Review .gitignore and the files to be committed. Keep sources/, credentials, and private field-test material out of backup.
3. Commit the reviewed documents and application source; configure the selected GitHub remote and push.
4. Verify the commit on GitHub and record the repository URL in PROJECT_MASTER.md and SESSION_LOG.md.
5. During M1, configure Pages for the chosen source layout, verify the test URL on a phone, and record the deployed commit.

A local repository is not an off-device backup until its commits have been pushed and verified. GitHub Pages is a test-hosting milestone, separate from documentation backup.
