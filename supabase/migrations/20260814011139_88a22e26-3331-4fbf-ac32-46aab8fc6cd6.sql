DELETE FROM public.events
WHERE is_featured = false
  AND source_url ~* '/(brandpress|news|blog|press-release|articles?)/';

UPDATE public.events
SET format = 'VIRTUAL'
WHERE is_featured = false
  AND format = 'IN_PERSON'
  AND city IS NULL
  AND venue_name IS NULL
  AND (title ~* '\y(online|virtual|webinar|livestream)\y' OR description ~* '\y(online conference|virtual event|webinar|livestream)\y');