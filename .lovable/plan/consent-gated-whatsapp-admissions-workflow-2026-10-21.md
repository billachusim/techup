# Consent-gated WhatsApp admissions workflow

## Goal
Prepare automatic admissions messaging now while keeping all sends blocked until Meta approves each exact template and the lead explicitly opts in. The existing official number and public-facing WhatsApp experience remain unchanged.

## Scope
- Add an unchecked WhatsApp consent control to phone-based lead forms, recording the consent version and timestamp; historical leads remain ineligible.
- Prepare one admissions confirmation after consent and one follow-up 48 hours after the initial send only if the lead has not replied, opted out, enrolled, or been marked not interested.
- Check Meta's current template status server-side before each send. Send only the approved `en_US` admissions templates; pending/rejected templates result in no message.
- Treat `STOP`/`UNSUBSCRIBE` replies as opt-outs and cancel queued follow-ups. Keep founder/community/Slack handoffs staff-triggered in the inbox, not automatically sent.
- Add a protected scheduled runner, durable queue state, admin visibility, and targeted tests.

## Technical approach
- Add consent, opt-out, and send-tracking columns to `public.leads`; restrict anonymous/authenticated lead inserts to public form fields so clients cannot set server-owned send/opt-out state. Keep service-role access for the sender.
- Add a durable WhatsApp follow-up queue with staff-only reads, service-role writes, explicit grants, idempotent per-lead stages, retry limits, and ambiguous-send protection.
- Schedule the runner through the existing `pg_cron`/`pg_net` pattern and a stored random cron secret. Validate the secret in the public TanStack route before loading privileged code.
- Update the public lead forms and admin lead list; do not change unrelated WhatsApp messages, numbers, email automation, or marketing outreach.

## Validation
- Test consent eligibility, 48-hour timing, response/opt-out suppression, and template approval gating.
- Verify the live-preview forms render consent unchecked and inspect current build/error logs after edits.
