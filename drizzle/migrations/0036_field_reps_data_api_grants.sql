-- Data API access for the tables created by 20261103100000_field_reps.sql.
-- Supabase no longer grants public-schema access to the Data API roles by
-- default, so without these the admin dashboard's direct reads/writes on the
-- two rep tables fail with "permission denied" even for admins. RLS policies
-- from the previous migration still scope every row to admins; anon gets
-- nothing because no policy allows anon.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_reps TO authenticated;
GRANT ALL ON public.field_reps TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_rep_payouts TO authenticated;
GRANT ALL ON public.field_rep_payouts TO service_role;