-- تحديث محتوى الموقع (تصميم تكنيك الجديد)
-- ١) يحدّث الصفوف المزروعة سابقاً فقط إن كانت لا تزال بنصّها الأصلي (أي لم تُعدَّل من لوحة الإدارة).
-- ٢) يضيف المفاتيح الجديدة دون المساس بأي صف موجود.
-- آمن لإعادة التشغيل أكثر من مرة.

UPDATE public.site_content SET text_ar = 'في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية. نحوّل فكرتك إلى تطبيق ومنصة ونظام متكامل — بتصميم عصري، وأداء خاطف، وأمان تثق به.', text_en = 'In a world moving at the speed of technology, an ordinary idea is not enough. We turn your idea into an app, a platform and a complete system — modern, lightning fast and secure.'
  WHERE content_key = 'hero_subtext' AND text_ar = 'في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية. نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية.' AND text_en = 'In a world moving at the speed of technology, an ordinary idea is not enough. We specialize in software solutions, mobile apps and websites.';

UPDATE public.site_content SET text_ar = 'نصنع التقنية بروح المبدعين', text_en = 'We craft technology with a creator''s spirit'
  WHERE content_key = 'about_title' AND text_ar = 'من نحن؟' AND text_en = 'Who are we?';

UPDATE public.site_content SET text_ar = 'نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية. نجمع بين التصميم العصري والمهارة التقنية العالية لنحوّل أفكارك إلى منتجات رقمية تلفت الأنظار وتحقق النتائج.', text_en = 'We are a company specialized in software solutions, mobile apps and websites. We combine modern design with high technical skill to turn your ideas into digital products that get noticed and deliver results.'
  WHERE content_key = 'about_description' AND text_ar = 'نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية، نجمع بين التصميم العصري والمهارة التقنية العالية.' AND text_en = 'We are a company specialized in software solutions, mobile apps and websites, combining modern design with high technical skill.';

UPDATE public.site_content SET text_ar = 'تصميم عصري يلفت الأنظار', text_en = 'Modern design that turns heads'
  WHERE content_key = 'about_point_1' AND text_ar = 'التصميم العصري' AND text_en = 'Modern design';

UPDATE public.site_content SET text_ar = 'مهارة تقنية عالية في كل سطر كود', text_en = 'High technical skill in every line of code'
  WHERE content_key = 'about_point_3' AND text_ar = 'المهارة التقنية العالية' AND text_en = 'High technical skill';

UPDATE public.site_content SET text_ar = 'خدمات تصنع الفرق', text_en = 'Services that make the difference'
  WHERE content_key = 'services_heading' AND text_ar = 'ماذا نقدم لك؟' AND text_en = 'What do we offer?';

UPDATE public.site_content SET text_ar = 'نصنع لك حلولاً رقمية تتكيف مع تطلعاتك — من أول فكرة حتى الإطلاق.', text_en = 'We craft digital solutions that adapt to your ambitions — from first idea to launch.'
  WHERE content_key = 'services_subtext' AND text_ar = 'نصنع لك حلولاً رقمية تتكيف مع تطلعاتك.' AND text_en = 'We craft digital solutions that adapt to your ambitions.';

UPDATE public.site_content SET text_ar = 'نصمم ونبرمج تطبيقات ذكية وسريعة لنظامي iOS و Android بأحدث التقنيات، لأداء سلس وتجربة مستخدم لا تُنسى.', text_en = 'We design and build smart, fast apps for iOS and Android with the latest technologies.'
  WHERE content_key = 'service_1_body' AND text_ar = 'نصمم ونبرمج تطبيقات ذكية وسريعة لنظامي iOS و Android بأحدث التقنيات لضمان أداء سلس وتجربة مستخدم لا تُنسى.' AND text_en = 'We design and build smart, fast apps for iOS and Android with the latest technologies.';

UPDATE public.site_content SET text_ar = 'موقع تعريفي، متجر إلكتروني، أو منصة سحابية معقدة — نبنيه متجاوباً مع جميع الشاشات وسريع التحميل.', text_en = 'Landing page, e-commerce store or complex cloud platform — responsive and fast.'
  WHERE content_key = 'service_2_body' AND text_ar = 'موقع تعريفي، متجر إلكتروني، أو منصة سحابية معقدة — نضمن لك موقعاً متجاوباً مع جميع الشاشات وسريع التحميل.' AND text_en = 'Landing page, e-commerce store or complex cloud platform — responsive and fast.';

UPDATE public.site_content SET text_ar = 'نحل مشكلات أعمالك البرمجية ونؤتمت عملياتك اليومية بأنظمة مخصصة تناسب حجم مؤسستك ونشاطها.', text_en = 'We solve your business software problems and automate daily operations with tailored systems.'
  WHERE content_key = 'service_3_body' AND text_ar = 'نحل مشكلات أعمالك البرمجية ونساعدك على أتمتة عملياتك اليومية بأنظمة مخصصة تناسب حجم ونشاط مؤسستك.' AND text_en = 'We solve your business software problems and automate daily operations with tailored systems.';

UPDATE public.site_content SET text_ar = 'واجهات عصرية جذابة وبسيطة، تقود زوار مشروعك إلى الخدمة التي يريدونها بسهولة وفاعلية.', text_en = 'Modern, attractive and simple interfaces that guide visitors to what they need.'
  WHERE content_key = 'service_4_body' AND text_ar = 'واجهات عصرية جذابة وبسيطة تضمن وصول زوار مشروعك للخدمة المطلوبة بكل سهولة وفاعلية.' AND text_en = 'Modern, attractive and simple interfaces that guide visitors to what they need.';

UPDATE public.site_content SET text_ar = 'بنية تحتية صلبة وآمنة تحمي بياناتك وتعالجها وتستدعيها بسرعة في أي وقت.', text_en = 'Solid, secure infrastructure to protect your data and process it fast.'
  WHERE content_key = 'service_5_body' AND text_ar = 'بنية تحتية برمجية صلبة وآمنة لضمان حماية بياناتك وسرعة معالجتها واستدعائها في أي وقت.' AND text_en = 'Solid, secure infrastructure to protect your data and process it fast.';

UPDATE public.site_content SET text_ar = 'فكرتك تستحق أن تتحول إلى واقع. راسلنا الآن ولنبدأ أول خطوة معاً.', text_en = 'Your idea deserves to become real. Message us now and let''s take the first step together.'
  WHERE content_key = 'contact_subtext' AND text_ar = 'تواصل معنا لبدء مشروعك' AND text_en = 'Get in touch to start your project';

INSERT INTO public.site_content (content_key, section, text_ar, text_en, field_type) VALUES
('hero_rotator_label', 'hero', 'نبني لك', 'We build', 'single_line'),
('hero_rotator_1', 'hero', 'تطبيقات تبهر مستخدميك', 'apps that wow your users', 'single_line'),
('hero_rotator_2', 'hero', 'مواقع تحوّل الزائر إلى عميل', 'websites that convert visitors', 'single_line'),
('hero_rotator_3', 'hero', 'أنظمة تدير عملك بذكاء', 'systems that run your business smartly', 'single_line'),
('hero_scroll', 'hero', 'اكتشف المزيد', 'Discover more', 'single_line'),
('stat_1_value', 'stats', '5', '5', 'single_line'),
('stat_1_label', 'stats', 'خدمات رقمية متكاملة', 'Complete digital services', 'single_line'),
('stat_2_value', 'stats', '3', '3', 'single_line'),
('stat_2_label', 'stats', 'مراحل تنقل فكرتك إلى واقع', 'Stages from idea to reality', 'single_line'),
('stat_3_value', 'stats', '2', '2', 'single_line'),
('stat_3_label', 'stats', 'منصتان: iOS و Android', 'Two platforms: iOS & Android', 'single_line'),
('stat_4_value', 'stats', '100%', '100%', 'single_line'),
('stat_4_label', 'stats', 'تصميم متجاوب مع كل الشاشات', 'Responsive on every screen', 'single_line'),
('about_chip', 'about', 'من نحن', 'About us', 'single_line'),
('about_badge', 'about', 'تصميم · أمان · جودة', 'Design · Security · Quality', 'single_line'),
('services_chip', 'services', 'خدماتنا', 'Our services', 'single_line'),
('service_cta', 'services', 'اطلب الخدمة', 'Request this service', 'single_line'),
('stages_chip', 'stages', 'كيف نعمل', 'How we work', 'single_line'),
('stage_1_body', 'stages', 'نقطة البداية: فكرة تحتاج إلى من يصقلها.', 'The starting point: an idea waiting to be refined.', 'single_line'),
('stage_2_body', 'stages', 'ندرس ونصمم ونبرمج بإتقان لنرتقي بها.', 'We study, design and build with precision to elevate it.', 'single_line'),
('stage_3_body', 'stages', 'منتج رقمي قوي وآمن، جاهز للنمو والاستمرار.', 'A strong, secure digital product, ready to grow and last.', 'single_line'),
('why_chip', 'why', 'لماذا نحن', 'Why us', 'single_line'),
('why_1_body', 'why', 'نفهم هدفك وجمهورك قبل أن نكتب سطراً واحداً من الكود.', 'We understand your goal and audience before writing a single line of code.', 'single_line'),
('why_2_body', 'why', 'صفحات خفيفة وتطبيقات سلسة تفتح في لحظة.', 'Light pages and smooth apps that open in an instant.', 'single_line'),
('why_3_body', 'why', 'واجهات بسيطة تقود الزائر إلى ما يريده بلا عناء.', 'Simple interfaces that lead visitors to what they want, effortlessly.', 'single_line'),
('why_4_body', 'why', 'حلول تُبنى لتكبر مع مشروعك وتمنحك أفضلية على منافسيك.', 'Solutions built to grow with your project and give you an edge.', 'single_line'),
('contact_chip', 'contact', 'ابدأ اليوم', 'Start today', 'single_line'),
('footer_tagline', 'footer', 'نحوّل الأفكار إلى واقع رقمي.', 'We turn ideas into digital reality.', 'single_line')
ON CONFLICT (content_key) DO NOTHING;
