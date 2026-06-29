## Deploy via Lovable Publish

Publish the latest committed changes to the live site at https://techfaculty.ng (and the techup.lovable.app mirror).

### Steps
1. Run a security scan to confirm no unresolved critical findings block publish.
2. Confirm existing site metadata (title, meta description, OG/Twitter tags, favicon) is still accurate — no edits expected since recent work was content/SEO only.
3. Call `preview_ui--publish` to schedule the deployment.
4. Report back the live URL and note that propagation takes ~1 minute.

### Notes
- The FTP GitHub Actions workflow stays disabled — no Node.js 20 deprecation warnings will fire because Lovable's publish pipeline does not use that workflow.
- No code changes are part of this plan; this is purely a deploy action.