CREATE POLICY "Talent can read own CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'talent-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Talent can upload own CVs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'talent-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Talent can update own CVs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'talent-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Talent can delete own CVs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'talent-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Staff can read all CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'talent-cvs' AND public.is_staff(auth.uid()));