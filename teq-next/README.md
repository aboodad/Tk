# Tekniq — تكنيك

موقع شركة تكنيك مبني بـ **Next.js (App Router)** + **Supabase** + **Tailwind CSS v4**.

## التشغيل

```sh
npm install
npm run dev      # التطوير
npm run build    # بناء الإنتاج
npm start        # تشغيل نسخة الإنتاج
```

## ملاحظات

- الصفحة الرئيسية تُولَّد على الخادم وتُجدَّد كل 60 ثانية (ISR)، فتصل جاهزة للمتصفح مع محتوى لوحة الإدارة.
- الصور تمر عبر `next/image` (AVIF/WebP) من `src/components/Pic.tsx`.
- الصور الافتراضية في `public/images/` — استبدل الملفات بصورك الأصلية بنفس الأسماء:
  `logo.png`, `about.png`, `services.png`, `stages.png`, `why.png`, `uiux.png`, `cta.jpg`.
- ملفات الاتصال بقاعدة البيانات في `src/integrations/supabase/` و`.env` و`supabase/` كما هي دون تعديل.
  `next.config.mjs` يمرّر متغيرات `VITE_SUPABASE_*` لها وقت البناء.
- لتفعيل رابط الموقع الصحيح في صور المشاركة (OG) عيّن `NEXT_PUBLIC_SITE_URL` (على Vercel يُستخدم الدومين تلقائيًا).
