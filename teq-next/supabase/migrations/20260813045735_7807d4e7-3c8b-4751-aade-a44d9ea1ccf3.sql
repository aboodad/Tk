REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;

DROP POLICY "Anyone can view published projects" ON public.projects;

CREATE POLICY "Visitors can view published projects"
ON public.projects FOR SELECT TO anon
USING (published = true);

CREATE POLICY "Signed in users can view projects"
ON public.projects FOR SELECT TO authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY "Anyone can read project images" ON storage.objects;

CREATE POLICY "Anyone can read project images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'project-images');