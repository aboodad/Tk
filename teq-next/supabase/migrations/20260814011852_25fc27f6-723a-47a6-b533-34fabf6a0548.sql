CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL DEFAULT '/',
  referrer text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_views TO anon;
GRANT INSERT, SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a page view (anon)"
  ON public.page_views FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can record a page view (authenticated)"
  ON public.page_views FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can view page views"
  ON public.page_views FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
CREATE INDEX page_views_path_idx ON public.page_views (path);