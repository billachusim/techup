## Show every Slack message from the website as "Tech Faculty NG"

### What I found
- Every Slack message the website sends (class reminders, work review results, hiring matches, the weekly admin report, Slack welcome messages in student-general and cohort channels) goes out through one connection. It shows up as **"Lovable App"** with a heart icon. That name is fixed for this connection and can't be renamed.
- **Hiring Ops is not run by this website.** Our connection can't see that channel at all, so another app posts there. Most likely it's the "Tech Faculty NG" app that Claude or a separate tool set up.
- Our connection already has permission to post with a custom name and picture. We just never used it.

### What will change
- Every message from the website will show as **Tech Faculty NG** with the Tech Faculty logo, in every channel, including general, student-general, cohort channels, project channels and #tf-admin-reports.
- What the messages say and where they go stays the same.

### Caveats
- Slack still adds a small **"APP"** tag beside the name, and tapping the name shows the connection behind it. It will look like Hiring Ops, but it's not quite the same identity.
- Older messages keep the "Lovable App" name; only new ones change.
- Option for later: if you want one real app identity everywhere, I can create a dedicated "Tech Faculty NG" Slack app for this website. That needs the site published first and takes a bit more setup.

### Technical details
- In `src/lib/slack.server.ts`, add `username: "Tech Faculty NG"` and `icon_url: "https://techfaculty.ng/logo.png"` to the shared `chat.postMessage` call. All website Slack messages go through this one helper. The `chat:write.customize` scope is already granted.
- Send one test message to #tf-admin-reports and confirm the new name and logo show.
- Publish so live messages use it.
