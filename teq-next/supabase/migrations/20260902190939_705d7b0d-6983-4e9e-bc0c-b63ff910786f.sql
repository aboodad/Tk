-- site_settings
CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  logo_url text,
  favicon_url text,
  site_name_ar text NOT NULL DEFAULT 'تكنيك',
  site_name_en text NOT NULL DEFAULT 'Tekniq',
  contact_phone text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- media_assets
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key text NOT NULL UNIQUE,
  image_url text,
  alt_text_ar text NOT NULL DEFAULT '',
  alt_text_en text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read media assets" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert media assets" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media assets" ON public.media_assets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media assets" ON public.media_assets FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER media_assets_set_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site_content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  section text NOT NULL DEFAULT 'general',
  text_ar text NOT NULL DEFAULT '',
  text_en text NOT NULL DEFAULT '',
  field_type text NOT NULL DEFAULT 'single_line',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site content" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_set_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- storage policies for site-assets
CREATE POLICY "Public can read site assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "Admins can upload site assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- seed settings
INSERT INTO public.site_settings (id, logo_url, favicon_url, site_name_ar, site_name_en, contact_phone, contact_email, social_links) VALUES (
  'default', NULL, NULL, 'تكنيك', 'Tekniq', '776567738', '',
  '{"whatsapp":"https://wa.me/967776567738","instagram":"https://instagram.com/tekni_q","instagram_handle":"@tekni_q"}'::jsonb
);

-- seed media
INSERT INTO public.media_assets (asset_key, image_url, alt_text_ar, alt_text_en, section) VALUES
('hero_logo_3d', NULL, 'هوية تكنيك Tekniq ثلاثية الأبعاد', 'Tekniq 3D brand identity', 'hero'),
('about_img', NULL, 'عرض ثلاثي الأبعاد يوضح تصميم وأمان وجودة حلول تكنيك', '3D visual of Tekniq design, security and quality', 'about'),
('services_img', NULL, 'رسم ثلاثي الأبعاد لخدمات تكنيك البرمجية', '3D illustration of Tekniq services', 'services'),
('stages_img', NULL, 'مراحل تحويل الفكرة إلى واقع رقمي', 'Stages from idea to digital reality', 'stages'),
('why_img', NULL, 'لماذا تكنيك: أداء سريع ونمو للأعمال', 'Why Tekniq: fast performance and growth', 'why'),
('uiux_img', NULL, 'تصميم واجهات وتجربة المستخدم UI UX', 'UI/UX design', 'why'),
('cta_banner', NULL, 'تكنيك Tekniq — لنصنع واقعك الرقمي', 'Tekniq — let us build your digital reality', 'contact');

-- seed content
INSERT INTO public.site_content (content_key, section, text_ar, text_en, field_type) VALUES
('nav_about', 'nav', 'من نحن', 'About', 'single_line'),
('nav_services', 'nav', 'خدماتنا', 'Services', 'single_line'),
('nav_why', 'nav', 'لماذا تكنيك', 'Why Tekniq', 'single_line'),
('nav_contact', 'nav', 'تواصل', 'Contact', 'single_line'),
('nav_cta', 'nav', 'ابدأ مشروعك', 'Start your project', 'single_line'),
('hero_chip', 'hero', 'حيث تبدأ أفكارك الرقمية', 'Where your digital ideas begin', 'single_line'),
('hero_headline', 'hero', 'لنصنع', 'Let''s build', 'single_line'),
('hero_headline_accent', 'hero', 'واقعك الرقمي.', 'your digital reality.', 'single_line'),
('hero_subtext', 'hero', 'في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية. نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية.', 'In a world moving at the speed of technology, an ordinary idea is not enough. We specialize in software solutions, mobile apps and websites.', 'textarea'),
('hero_cta_whatsapp', 'hero', 'تواصل معنا واتساب', 'Chat on WhatsApp', 'single_line'),
('about_title', 'about', 'من نحن؟', 'Who are we?', 'single_line'),
('about_description', 'about', 'نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية، نجمع بين التصميم العصري والمهارة التقنية العالية.', 'We are a company specialized in software solutions, mobile apps and websites, combining modern design with high technical skill.', 'textarea'),
('about_point_1', 'about', 'التصميم العصري', 'Modern design', 'single_line'),
('about_point_2', 'about', 'حلول تُبنى بأعلى معايير الجودة والأمان', 'Solutions built to the highest quality and security standards', 'single_line'),
('about_point_3', 'about', 'المهارة التقنية العالية', 'High technical skill', 'single_line'),
('services_heading', 'services', 'ماذا نقدم لك؟', 'What do we offer?', 'single_line'),
('services_subtext', 'services', 'نصنع لك حلولاً رقمية تتكيف مع تطلعاتك.', 'We craft digital solutions that adapt to your ambitions.', 'single_line'),
('service_1_title', 'services', 'تطوير تطبيقات الجوال', 'Mobile Apps', 'single_line'),
('service_1_body', 'services', 'نصمم ونبرمج تطبيقات ذكية وسريعة لنظامي iOS و Android بأحدث التقنيات لضمان أداء سلس وتجربة مستخدم لا تُنسى.', 'We design and build smart, fast apps for iOS and Android with the latest technologies.', 'textarea'),
('service_2_title', 'services', 'تصميم وبرمجة المواقع والمنصات', 'Web Development', 'single_line'),
('service_2_body', 'services', 'موقع تعريفي، متجر إلكتروني، أو منصة سحابية معقدة — نضمن لك موقعاً متجاوباً مع جميع الشاشات وسريع التحميل.', 'Landing page, e-commerce store or complex cloud platform — responsive and fast.', 'textarea'),
('service_3_title', 'services', 'الأنظمة والحلول البرمجية المخصصة', 'Custom Software', 'single_line'),
('service_3_body', 'services', 'نحل مشكلات أعمالك البرمجية ونساعدك على أتمتة عملياتك اليومية بأنظمة مخصصة تناسب حجم ونشاط مؤسستك.', 'We solve your business software problems and automate daily operations with tailored systems.', 'textarea'),
('service_4_title', 'services', 'تصميم واجهات وتجربة المستخدم', 'UI / UX Design', 'single_line'),
('service_4_body', 'services', 'واجهات عصرية جذابة وبسيطة تضمن وصول زوار مشروعك للخدمة المطلوبة بكل سهولة وفاعلية.', 'Modern, attractive and simple interfaces that guide visitors to what they need.', 'textarea'),
('service_5_title', 'services', 'إدارة وقواعد البيانات', 'Database & Backend', 'single_line'),
('service_5_body', 'services', 'بنية تحتية برمجية صلبة وآمنة لضمان حماية بياناتك وسرعة معالجتها واستدعائها في أي وقت.', 'Solid, secure infrastructure to protect your data and process it fast.', 'textarea'),
('stages_heading', 'stages', 'في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية.', 'In a world moving at the speed of technology, an ordinary idea is not enough.', 'single_line'),
('stage_1', 'stages', 'الفكرة العادية', 'Ordinary idea', 'single_line'),
('stage_2', 'stages', 'تكنيك متقن', 'Tekniq craftsmanship', 'single_line'),
('stage_3', 'stages', 'واقع رقمي قوي ومستدام', 'Strong, sustainable digital reality', 'single_line'),
('why_heading', 'why', 'لماذا Tekniq؟', 'Why Tekniq?', 'single_line'),
('why_subtitle', 'why', 'لأننا لا نكتفي بكتابة الأكواد.', 'Because we do more than write code.', 'single_line'),
('why_1', 'why', 'ندرس مشروعاتكم بعناية', 'We study your projects carefully', 'single_line'),
('why_2', 'why', 'أداء سريع', 'Fast performance', 'single_line'),
('why_3', 'why', 'تجربة مستخدم سلسة', 'Smooth user experience', 'single_line'),
('why_4', 'why', 'نمو وتميز الأعمال', 'Business growth and excellence', 'single_line'),
('projects_chip', 'projects', 'أعمالنا', 'Our work', 'single_line'),
('projects_heading', 'projects', 'مشاريعنا', 'Our projects', 'single_line'),
('projects_subtext', 'projects', 'نماذج من المشاريع التي نفذناها لعملائنا.', 'A selection of projects delivered for our clients.', 'single_line'),
('projects_link_label', 'projects', 'زيارة المشروع', 'Visit project', 'single_line'),
('contact_heading', 'contact', 'لنصنع واقعك الرقمي.', 'Let''s build your digital reality.', 'single_line'),
('contact_subtext', 'contact', 'تواصل معنا لبدء مشروعك', 'Get in touch to start your project', 'single_line'),
('contact_whatsapp_label', 'contact', 'واتساب', 'WhatsApp', 'single_line'),
('contact_instagram_label', 'contact', 'إنستقرام', 'Instagram', 'single_line'),
('footer_copyright', 'footer', 'تكنيك Tekniq', 'Tekniq', 'single_line'),
('footer_admin_label', 'footer', 'الإدارة', 'Admin', 'single_line');