CREATE TABLE IF NOT EXISTS public.intakes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), department_slug text, starts_on date NOT NULL,
 enrol_by date CHECK (enrol_by IS NULL OR enrol_by <= starts_on),
 learning_mode text NOT NULL DEFAULT 'any' CHECK (learning_mode IN ('any','online-only','hybrid','physical')),
 campus text, seats integer CHECK (seats IS NULL OR seats > 0), note text CHECK (note IS NULL OR length(note) <= 200),
 published boolean NOT NULL DEFAULT true, created_by uuid DEFAULT auth.uid(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.intakes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.intakes TO authenticated;
GRANT ALL ON public.intakes TO service_role;
ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS intakes_starts_on_idx ON public.intakes(starts_on);
CREATE POLICY "Anyone reads published intakes" ON public.intakes FOR SELECT TO anon USING(published);
CREATE POLICY "Signed-in users read published intakes" ON public.intakes FOR SELECT TO authenticated USING(published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage intakes" ON public.intakes FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.touch_intake() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_intake BEFORE UPDATE ON public.intakes FOR EACH ROW EXECUTE FUNCTION public.touch_intake();
CREATE OR REPLACE FUNCTION public.audit_intake_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE row_ public.intakes; BEGIN IF TG_OP='DELETE' THEN row_:=OLD; ELSE row_:=NEW; END IF; PERFORM public.log_admin_action('intake.'||lower(TG_OP),'intakes',row_.id::text,NULL,COALESCE(row_.department_slug,'All departments')||' · '||row_.starts_on::text,jsonb_build_object('starts_on',row_.starts_on,'department',row_.department_slug,'mode',row_.learning_mode,'published',row_.published)); RETURN row_; END; $$;
CREATE TRIGGER audit_intake_change AFTER INSERT OR UPDATE OR DELETE ON public.intakes FOR EACH ROW EXECUTE FUNCTION public.audit_intake_change();
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS instalment_total numeric CHECK(instalment_total IS NULL OR instalment_total>0), ADD COLUMN IF NOT EXISTS balance_due numeric CHECK(balance_due IS NULL OR balance_due>=0), ADD COLUMN IF NOT EXISTS balance_due_by date, ADD COLUMN IF NOT EXISTS balance_paid_at timestamptz;
DROP POLICY IF EXISTS "Students request own enrollments" ON public.enrollments;
CREATE POLICY "Students request own enrollments" ON public.enrollments FOR INSERT TO authenticated WITH CHECK(faculty_id=(SELECT faculty_id FROM public.profiles WHERE id=auth.uid()) AND tx_ref IS NULL AND amount_due IS NULL AND paid_at IS NULL AND payment_reference IS NULL AND recovered_at IS NULL AND recovered_email_sent_at IS NULL AND payment_reminder_sent_at IS NULL AND instalment_total IS NULL AND balance_due IS NULL AND balance_due_by IS NULL AND balance_paid_at IS NULL AND (status='pending' OR (status='active' AND plan_name IN ('Bootcamp Starter','Free Bootcamp'))));
CREATE TABLE IF NOT EXISTS public.enrollment_payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE, tx_ref text NOT NULL UNIQUE, amount numeric NOT NULL CHECK(amount>0), currency text NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','failed')), paid_at timestamptz, payment_reference text, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.enrollment_payments TO authenticated;
GRANT ALL ON public.enrollment_payments TO service_role;
ALTER TABLE public.enrollment_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read balance payments" ON public.enrollment_payments FOR SELECT TO authenticated USING(public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS enrollment_payments_enrollment_idx ON public.enrollment_payments(enrollment_id);
CREATE INDEX IF NOT EXISTS enrollment_payments_pending_idx ON public.enrollment_payments(created_at) WHERE status='pending';
CREATE TABLE IF NOT EXISTS public.lead_email_followups (email text PRIMARY KEY, lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE, interest text NOT NULL, name text, lead_created_at timestamptz NOT NULL, steps_sent integer NOT NULL DEFAULT 0, next_due_at timestamptz, last_sent_at timestamptz, stopped_at timestamptz, stop_reason text, unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
REVOKE ALL ON public.lead_email_followups FROM anon, authenticated;
GRANT SELECT ON public.lead_email_followups TO authenticated;
GRANT ALL ON public.lead_email_followups TO service_role;
ALTER TABLE public.lead_email_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read lead follow-ups" ON public.lead_email_followups FOR SELECT TO authenticated USING(public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS lead_email_followups_due_idx ON public.lead_email_followups(next_due_at) WHERE stopped_at IS NULL;
CREATE INDEX IF NOT EXISTS lead_email_followups_lead_idx ON public.lead_email_followups(lead_id);
COMMENT ON TABLE public.lead_email_followups IS 'Merged PR schema only. Automatic sending remains unscheduled pending caller authentication, consent and email-service policy review.';