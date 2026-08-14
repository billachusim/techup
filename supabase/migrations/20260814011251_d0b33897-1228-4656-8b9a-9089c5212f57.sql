UPDATE public.events
SET starts_at = date_trunc('day', starts_at) + interval '17 hours',
    ends_at = date_trunc('day', starts_at) + interval '19 hours'
WHERE slug = 'nnewi-tech-meetup';

UPDATE public.events
SET starts_at = date_trunc('day', starts_at) + interval '10 hours',
    ends_at = date_trunc('day', starts_at) + interval '14 hours'
WHERE slug IN ('ai-tools-for-business-workshop', 'holiday-tech-bootcamp-for-teenagers');