DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
CREATE POLICY "Public read project images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admins upload project images" ON storage.objects;
CREATE POLICY "Admins upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update project images" ON storage.objects;
CREATE POLICY "Admins update project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete project images" ON storage.objects;
CREATE POLICY "Admins delete project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));