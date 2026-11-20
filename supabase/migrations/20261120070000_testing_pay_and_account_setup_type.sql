-- Bill, 20 Nov 2026: app and website testing pays a flat N5,000 per tester task
-- (use the app for 3 days, then send screenshots and a written report). N10,000
-- is only for genuinely big tasks, never for testing.
UPDATE public.talent_roles
SET
  pay_text = 'Pay per task: ₦5,000 per testing task (3 days of use, then screenshots and a written report), paid weekly',
  summary = 'Earn ₦5,000 per testing task, paid weekly: use an app or website for 3 days, then send screenshots and a clear report of what you found.',
  description = 'Pay-per-task testing for Nigerian businesses that order testing from Tech Faculty: mobile app testing, website usability tests, payment flow checks, device checks and beta groups. '
    || 'Each task pays a flat ₦5,000: you use the app or website for 3 days as a real customer would, then send screenshots and a written report of every bug, crash or confusing screen you found. '
    || 'A Tech Faculty manager checks the report, and approved tasks are paid every Friday. Take as many tasks as you can handle. See every task type at https://techfaculty.ng/side-hustles (category: testing-qa).',
  updated_at = now()
WHERE slug = 'side-hustles-testing-qa';

-- The Social Media Account Setup role is pay-per-task work, not a full-time job.
UPDATE public.talent_roles
SET employment_type = 'freelance', updated_at = now()
WHERE slug = 'social-media-account-setup-pay-per-task-0552';
