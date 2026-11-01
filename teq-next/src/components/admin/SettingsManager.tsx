"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SETTINGS_DEFAULTS, DEFAULT_LOGO_URL } from "@/lib/site-defaults";
import { useInvalidateSite, useSiteSettings } from "@/lib/site";
import { ImageField } from "./ImageField";

export function SettingsManager() {
  const { settings, data, isLoading } = useSiteSettings();
  const invalidate = useInvalidateSite();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site_name_ar: settings.site_name_ar,
    site_name_en: settings.site_name_en,
    contact_phone: settings.contact_phone,
    contact_email: settings.contact_email,
    whatsapp: settings.social_links.whatsapp ?? "",
    instagram: settings.social_links.instagram ?? "",
    instagram_handle: settings.social_links.instagram_handle ?? "",
  });

  useEffect(() => {
    if (data === undefined) return;
    setForm({
      site_name_ar: settings.site_name_ar,
      site_name_en: settings.site_name_en,
      contact_phone: settings.contact_phone,
      contact_email: settings.contact_email,
      whatsapp: settings.social_links.whatsapp ?? "",
      instagram: settings.social_links.instagram ?? "",
      instagram_handle: settings.social_links.instagram_handle ?? "",
    });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const upsert = async (patch: Record<string, unknown>) => {
    const { error } = await supabase.from("site_settings").upsert(
      {
        id: "default",
        site_name_ar: form.site_name_ar,
        site_name_en: form.site_name_en,
        contact_phone: form.contact_phone,
        contact_email: form.contact_email,
        social_links: {
          ...settings.social_links,
          whatsapp: form.whatsapp,
          instagram: form.instagram,
          instagram_handle: form.instagram_handle,
        },
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
        ...patch,
      },
      { onConflict: "id" },
    );
    if (error) throw error;
    await invalidate();
  };

  const save = async () => {
    setSaving(true);
    try {
      await upsert({});
      toast.success("تم حفظ الإعدادات.");
    } catch (err) {
      console.error(err);
      toast.error("تعذر حفظ الإعدادات.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm({
      site_name_ar: SETTINGS_DEFAULTS.site_name_ar,
      site_name_en: SETTINGS_DEFAULTS.site_name_en,
      contact_phone: SETTINGS_DEFAULTS.contact_phone,
      contact_email: SETTINGS_DEFAULTS.contact_email,
      whatsapp: SETTINGS_DEFAULTS.social_links.whatsapp ?? "",
      instagram: SETTINGS_DEFAULTS.social_links.instagram ?? "",
      instagram_handle: SETTINGS_DEFAULTS.social_links.instagram_handle ?? "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const field = (label: string, key: keyof typeof form, dir: "rtl" | "ltr" = "rtl", type = "text") => (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      <Input dir={dir} type={type} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          label="شعار الموقع"
          hint="يظهر في القائمة العلوية والتذييل — مربع 1:1"
          folder="branding"
          aspect="aspect-square"
          currentUrl={settings.logo_url}
          defaultUrl={DEFAULT_LOGO_URL}
          onChange={(url) => upsert({ logo_url: url })}
        />
        <ImageField
          label="أيقونة المتصفح (Favicon)"
          hint="PNG أو ICO مربعة 64×64 أو أكبر"
          folder="branding"
          aspect="aspect-square"
          currentUrl={settings.favicon_url}
          defaultUrl="/favicon.ico"
          onChange={(url) => upsert({ favicon_url: url })}
        />
      </div>

      <div className="glass-panel space-y-4 p-5">
        <h3 className="font-extrabold text-primary">بيانات الموقع والتواصل</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("اسم الموقع (عربي)", "site_name_ar")}
          {field("Site name (English)", "site_name_en", "ltr")}
          {field("رقم الهاتف", "contact_phone", "ltr", "tel")}
          {field("البريد الإلكتروني", "contact_email", "ltr", "email")}
          {field("رابط واتساب", "whatsapp", "ltr", "url")}
          {field("رابط إنستقرام", "instagram", "ltr", "url")}
          {field("معرّف إنستقرام (@)", "instagram_handle", "ltr")}
        </div>
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving} className="gap-1">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ الإعدادات
          </Button>
          <Button variant="outline" onClick={reset} disabled={saving}>
            إعادة للافتراضي
          </Button>
        </div>
      </div>
    </div>
  );
}
