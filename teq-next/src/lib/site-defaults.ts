
const logo = { url: "/images/logo.png" };
const about = { url: "/images/about.png" };
const services = { url: "/images/services.png" };
const stages = { url: "/images/stages.png" };
const uiux = { url: "/images/uiux.png" };
const why = { url: "/images/why.png" };
const cta = { url: "/images/cta.jpg" };

export type FieldType = "single_line" | "textarea" | "rich_text";

export type ContentDefault = {
  key: string;
  section: string;
  label: string;
  ar: string;
  en: string;
  type: FieldType;
  max: number;
};

export const SECTIONS: { id: string; label: string }[] = [
  { id: "nav", label: "القائمة العلوية" },
  { id: "hero", label: "الواجهة الرئيسية" },
  { id: "stats", label: "الأرقام" },
  { id: "about", label: "من نحن" },
  { id: "services", label: "الخدمات" },
  { id: "stages", label: "المراحل" },
  { id: "why", label: "لماذا تكنيك" },
  { id: "projects", label: "المشاريع" },
  { id: "contact", label: "التواصل" },
  { id: "footer", label: "التذييل" },
];

const s = (key: string, section: string, label: string, ar: string, en: string, max = 80): ContentDefault => ({
  key, section, label, ar, en, type: "single_line", max,
});
const p = (key: string, section: string, label: string, ar: string, en: string, max = 400): ContentDefault => ({
  key, section, label, ar, en, type: "textarea", max,
});

export const CONTENT_DEFAULTS: ContentDefault[] = [
  s("nav_about", "nav", "رابط: من نحن", "من نحن", "About", 30),
  s("nav_services", "nav", "رابط: خدماتنا", "خدماتنا", "Services", 30),
  s("nav_why", "nav", "رابط: لماذا تكنيك", "لماذا تكنيك", "Why Tekniq", 30),
  s("nav_contact", "nav", "رابط: تواصل", "تواصل", "Contact", 30),
  s("nav_cta", "nav", "زر البدء", "ابدأ مشروعك", "Start your project", 30),

  s("hero_chip", "hero", "الشارة العلوية", "حيث تبدأ أفكارك الرقمية", "Where your digital ideas begin", 60),
  s("hero_headline", "hero", "العنوان الرئيسي", "لنصنع", "Let's build", 60),
  s("hero_headline_accent", "hero", "العنوان الملوّن", "واقعك الرقمي.", "your digital reality.", 60),
  s("hero_rotator_label", "hero", "كلمة قبل العبارات المتحركة", "نبني لك", "We build", 30),
  s("hero_rotator_1", "hero", "عبارة متحركة 1", "تطبيقات تبهر مستخدميك", "apps that wow your users", 50),
  s("hero_rotator_2", "hero", "عبارة متحركة 2", "مواقع تحوّل الزائر إلى عميل", "websites that convert visitors", 50),
  s("hero_rotator_3", "hero", "عبارة متحركة 3", "أنظمة تدير عملك بذكاء", "systems that run your business smartly", 50),
  p("hero_subtext", "hero", "النص التعريفي",
    "في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية. نحوّل فكرتك إلى تطبيق ومنصة ونظام متكامل — بتصميم عصري، وأداء خاطف، وأمان تثق به.",
    "In a world moving at the speed of technology, an ordinary idea is not enough. We turn your idea into an app, a platform and a complete system — modern, lightning fast and secure."),
  s("hero_cta_whatsapp", "hero", "زر واتساب", "تواصل معنا واتساب", "Chat on WhatsApp", 40),
  s("hero_scroll", "hero", "نص التمرير", "اكتشف المزيد", "Discover more", 30),

  s("stat_1_value", "stats", "رقم 1: القيمة", "5", "5", 10),
  s("stat_1_label", "stats", "رقم 1: الوصف", "خدمات رقمية متكاملة", "Complete digital services", 50),
  s("stat_2_value", "stats", "رقم 2: القيمة", "3", "3", 10),
  s("stat_2_label", "stats", "رقم 2: الوصف", "مراحل تنقل فكرتك إلى واقع", "Stages from idea to reality", 50),
  s("stat_3_value", "stats", "رقم 3: القيمة", "2", "2", 10),
  s("stat_3_label", "stats", "رقم 3: الوصف", "منصتان: iOS و Android", "Two platforms: iOS & Android", 50),
  s("stat_4_value", "stats", "رقم 4: القيمة", "100%", "100%", 10),
  s("stat_4_label", "stats", "رقم 4: الوصف", "تصميم متجاوب مع كل الشاشات", "Responsive on every screen", 50),

  s("about_chip", "about", "الشارة", "من نحن", "About us", 30),
  s("about_title", "about", "العنوان", "نصنع التقنية بروح المبدعين", "We craft technology with a creator's spirit", 60),
  p("about_description", "about", "الوصف",
    "نحن شركة متخصصة في تقديم الحلول البرمجية وتطوير تطبيقات الجوال والمواقع الإلكترونية. نجمع بين التصميم العصري والمهارة التقنية العالية لنحوّل أفكارك إلى منتجات رقمية تلفت الأنظار وتحقق النتائج.",
    "We are a company specialized in software solutions, mobile apps and websites. We combine modern design with high technical skill to turn your ideas into digital products that get noticed and deliver results."),
  s("about_point_1", "about", "نقطة 1", "تصميم عصري يلفت الأنظار", "Modern design that turns heads"),
  s("about_point_2", "about", "نقطة 2", "حلول تُبنى بأعلى معايير الجودة والأمان", "Solutions built to the highest quality and security standards"),
  s("about_point_3", "about", "نقطة 3", "مهارة تقنية عالية في كل سطر كود", "High technical skill in every line of code"),
  s("about_badge", "about", "شارة الصورة", "تصميم · أمان · جودة", "Design · Security · Quality", 40),

  s("services_chip", "services", "الشارة", "خدماتنا", "Our services", 30),
  s("services_heading", "services", "عنوان القسم", "خدمات تصنع الفرق", "Services that make the difference", 60),
  s("services_subtext", "services", "النص الفرعي", "نصنع لك حلولاً رقمية تتكيف مع تطلعاتك — من أول فكرة حتى الإطلاق.", "We craft digital solutions that adapt to your ambitions — from first idea to launch.", 120),
  s("service_cta", "services", "نص رابط الخدمة", "اطلب الخدمة", "Request this service", 30),
  s("service_1_title", "services", "خدمة 1: العنوان", "تطوير تطبيقات الجوال", "Mobile Apps"),
  p("service_1_body", "services", "خدمة 1: الوصف",
    "نصمم ونبرمج تطبيقات ذكية وسريعة لنظامي iOS و Android بأحدث التقنيات، لأداء سلس وتجربة مستخدم لا تُنسى.",
    "We design and build smart, fast apps for iOS and Android with the latest technologies."),
  s("service_2_title", "services", "خدمة 2: العنوان", "تصميم وبرمجة المواقع والمنصات", "Web Development"),
  p("service_2_body", "services", "خدمة 2: الوصف",
    "موقع تعريفي، متجر إلكتروني، أو منصة سحابية معقدة — نبنيه متجاوباً مع جميع الشاشات وسريع التحميل.",
    "Landing page, e-commerce store or complex cloud platform — responsive and fast."),
  s("service_3_title", "services", "خدمة 3: العنوان", "الأنظمة والحلول البرمجية المخصصة", "Custom Software"),
  p("service_3_body", "services", "خدمة 3: الوصف",
    "نحل مشكلات أعمالك البرمجية ونؤتمت عملياتك اليومية بأنظمة مخصصة تناسب حجم مؤسستك ونشاطها.",
    "We solve your business software problems and automate daily operations with tailored systems."),
  s("service_4_title", "services", "خدمة 4: العنوان", "تصميم واجهات وتجربة المستخدم", "UI / UX Design"),
  p("service_4_body", "services", "خدمة 4: الوصف",
    "واجهات عصرية جذابة وبسيطة، تقود زوار مشروعك إلى الخدمة التي يريدونها بسهولة وفاعلية.",
    "Modern, attractive and simple interfaces that guide visitors to what they need."),
  s("service_5_title", "services", "خدمة 5: العنوان", "إدارة وقواعد البيانات", "Database & Backend"),
  p("service_5_body", "services", "خدمة 5: الوصف",
    "بنية تحتية صلبة وآمنة تحمي بياناتك وتعالجها وتستدعيها بسرعة في أي وقت.",
    "Solid, secure infrastructure to protect your data and process it fast."),

  s("stages_chip", "stages", "الشارة", "كيف نعمل", "How we work", 30),
  s("stages_heading", "stages", "العنوان", "في عالم يتحرك بسرعة التقنية، لا تكفي الفكرة العادية.", "In a world moving at the speed of technology, an ordinary idea is not enough.", 120),
  s("stage_1", "stages", "المرحلة 1", "الفكرة العادية", "Ordinary idea"),
  s("stage_2", "stages", "المرحلة 2", "تكنيك متقن", "Tekniq craftsmanship"),
  s("stage_3", "stages", "المرحلة 3", "واقع رقمي قوي ومستدام", "Strong, sustainable digital reality"),
  s("stage_1_body", "stages", "المرحلة 1: الوصف", "نقطة البداية: فكرة تحتاج إلى من يصقلها.", "The starting point: an idea waiting to be refined.", 120),
  s("stage_2_body", "stages", "المرحلة 2: الوصف", "ندرس ونصمم ونبرمج بإتقان لنرتقي بها.", "We study, design and build with precision to elevate it.", 120),
  s("stage_3_body", "stages", "المرحلة 3: الوصف", "منتج رقمي قوي وآمن، جاهز للنمو والاستمرار.", "A strong, secure digital product, ready to grow and last.", 120),

  s("why_chip", "why", "الشارة", "لماذا نحن", "Why us", 30),
  s("why_heading", "why", "العنوان", "لماذا Tekniq؟", "Why Tekniq?", 60),
  s("why_subtitle", "why", "العنوان الفرعي", "لأننا لا نكتفي بكتابة الأكواد.", "Because we do more than write code.", 100),
  s("why_1", "why", "ميزة 1", "ندرس مشروعاتكم بعناية", "We study your projects carefully"),
  s("why_2", "why", "ميزة 2", "أداء سريع", "Fast performance"),
  s("why_3", "why", "ميزة 3", "تجربة مستخدم سلسة", "Smooth user experience"),
  s("why_4", "why", "ميزة 4", "نمو وتميز الأعمال", "Business growth and excellence"),
  s("why_1_body", "why", "ميزة 1: الوصف", "نفهم هدفك وجمهورك قبل أن نكتب سطراً واحداً من الكود.", "We understand your goal and audience before writing a single line of code.", 140),
  s("why_2_body", "why", "ميزة 2: الوصف", "صفحات خفيفة وتطبيقات سلسة تفتح في لحظة.", "Light pages and smooth apps that open in an instant.", 140),
  s("why_3_body", "why", "ميزة 3: الوصف", "واجهات بسيطة تقود الزائر إلى ما يريده بلا عناء.", "Simple interfaces that lead visitors to what they want, effortlessly.", 140),
  s("why_4_body", "why", "ميزة 4: الوصف", "حلول تُبنى لتكبر مع مشروعك وتمنحك أفضلية على منافسيك.", "Solutions built to grow with your project and give you an edge.", 140),

  s("projects_chip", "projects", "الشارة", "أعمالنا", "Our work", 30),
  s("projects_heading", "projects", "العنوان", "مشاريعنا", "Our projects", 60),
  s("projects_subtext", "projects", "النص الفرعي", "نماذج من المشاريع التي نفذناها لعملائنا.", "A selection of projects delivered for our clients.", 120),
  s("projects_link_label", "projects", "نص رابط المشروع", "زيارة المشروع", "Visit project", 30),

  s("contact_chip", "contact", "الشارة", "ابدأ اليوم", "Start today", 30),
  s("contact_heading", "contact", "العنوان", "لنصنع واقعك الرقمي.", "Let's build your digital reality.", 60),
  s("contact_subtext", "contact", "النص الفرعي", "فكرتك تستحق أن تتحول إلى واقع. راسلنا الآن ولنبدأ أول خطوة معاً.", "Your idea deserves to become real. Message us now and let's take the first step together.", 140),
  s("contact_whatsapp_label", "contact", "زر واتساب", "واتساب", "WhatsApp", 30),
  s("contact_instagram_label", "contact", "زر إنستقرام", "إنستقرام", "Instagram", 30),

  s("footer_copyright", "footer", "نص الحقوق", "تكنيك Tekniq", "Tekniq", 60),
  s("footer_tagline", "footer", "الشعار النصي", "نحوّل الأفكار إلى واقع رقمي.", "We turn ideas into digital reality.", 60),
  s("footer_admin_label", "footer", "رابط الإدارة", "الإدارة", "Admin", 30),
];

export type MediaDefault = {
  key: string;
  section: string;
  label: string;
  url: string;
  altAr: string;
  altEn: string;
  hint: string;
};

export const MEDIA_DEFAULTS: MediaDefault[] = [
  { key: "hero_logo_3d", section: "hero", label: "صورة الواجهة الرئيسية", url: logo.url, altAr: "هوية تكنيك Tekniq ثلاثية الأبعاد", altEn: "Tekniq 3D brand identity", hint: "مربعة 1:1" },
  { key: "about_img", section: "about", label: "صورة من نحن", url: about.url, altAr: "عرض ثلاثي الأبعاد يوضح تصميم وأمان وجودة حلول تكنيك", altEn: "3D visual of Tekniq design, security and quality", hint: "أفقية 4:3" },
  { key: "services_img", section: "services", label: "صورة الخدمات", url: services.url, altAr: "رسم ثلاثي الأبعاد لخدمات تكنيك البرمجية", altEn: "3D illustration of Tekniq services", hint: "مربعة" },
  { key: "stages_img", section: "stages", label: "صورة المراحل", url: stages.url, altAr: "مراحل تحويل الفكرة إلى واقع رقمي", altEn: "Stages from idea to digital reality", hint: "أفقية 4:3" },
  { key: "why_img", section: "why", label: "صورة لماذا تكنيك", url: why.url, altAr: "لماذا تكنيك: أداء سريع ونمو للأعمال", altEn: "Why Tekniq: fast performance and growth", hint: "أفقية 4:3" },
  { key: "uiux_img", section: "why", label: "صورة UI/UX", url: uiux.url, altAr: "تصميم واجهات وتجربة المستخدم UI UX", altEn: "UI/UX design", hint: "أفقية 16:9" },
  { key: "cta_banner", section: "contact", label: "بانر التواصل", url: cta.url, altAr: "تكنيك Tekniq — لنصنع واقعك الرقمي", altEn: "Tekniq — let us build your digital reality", hint: "عريضة 21:9" },
];

export const DEFAULT_LOGO_URL = logo.url;

export type SocialLinks = {
  whatsapp?: string;
  instagram?: string;
  instagram_handle?: string;
  [k: string]: string | undefined;
};

export const SETTINGS_DEFAULTS = {
  id: "default",
  logo_url: null as string | null,
  favicon_url: null as string | null,
  site_name_ar: "تكنيك",
  site_name_en: "Tekniq",
  contact_phone: "776567738",
  contact_email: "",
  social_links: {
    whatsapp: "https://wa.me/967776567738",
    instagram: "https://instagram.com/tekni_q",
    instagram_handle: "@tekni_q",
  } as SocialLinks,
};
