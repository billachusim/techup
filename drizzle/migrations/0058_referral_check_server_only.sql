REVOKE EXECUTE ON FUNCTION public.check_referral_code(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_referral_code(text, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_referral_code(text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_referral_code(text, uuid) TO service_role;