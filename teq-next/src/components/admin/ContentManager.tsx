"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONTENT_DEFAULTS, MEDIA_DEFAULTS, SECTIONS } from "@/lib/site-defaults";
import { useInvalidateSite, useMediaAssets, useSiteContent } from "@/lib/site";
import { ImageField } from "./ImageField";

type Draft = { ar: string; en: string };

export function ContentManager() {
  const content = useSiteContent();
  const media = useMediaAssets();
  const invalidate = useInvalidateSite();

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // seed drafts from DB rows (or defaults)
  useEffect(() => {
    if (!content.data) return;
    const next: Record<string, Draft> = {};
    for (const d of CONTENT_DEFAULTS) {
      const row = content.byKey.get(d.key);
      next[d.key] = { ar: row?.text_ar ?? d.ar, en: row?.text_en ?? d.en };
    }
    setDrafts(next);
  }, [content.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = useMemo(() => {
    const set = new Set<string>();
    for (const d of CONTENT_DEFAULTS) {
      const row = content.byKey.get(d.key);
      const cur = drafts[d.key];
      if (!cur) continue;
      const baseAr = row?.text_ar ?? d.ar;
      const baseEn = row?.text_en ?? d.en;
      if (cur.ar !== baseAr || cur.en !== baseEn) set.add(d.key);
    }
    return set;
  }, [drafts, content.byKey]);

  const saveKey = async (key: string) => {
    const d = CONTENT_DEFAULTS.find((c) => c.key === key);
    const cur = drafts[key];
    if (!d || !cur) return;
    setSaving(key);
    try {
      const { error } = await supabase.from("site_content").upsert(
        { content_key: key, section: d.section, text_ar: cur.ar, text_en: cur.en, field_type: d.type },
        { onConflict: "content_key" },
      );
      if (error) throw error;
      await invalidate();
      toast.success(`تم حفظ «${d.label}».`);
    } catch (err) {
      console.error(err);
      toast.error("تعذر الحفظ، حاول مرة أخرى.");
    } finally {
      setSaving(null);
    }
  };

  const saveSection = async (section: string) => {
    const keys = CONTENT_DEFAULTS.filter((c) => c.section === section && dirty.has(c.key));
    if (keys.length === 0) return;
    setSaving(section);
    try {
      const { error } = await supabase.from("site_content").upsert(
        keys.map((d) => ({
          content_key: d.key,
          section: d.section,
          text_ar: drafts[d.key]?.ar ?? "",
          text_en: drafts[d.key]?.en ?? "",
          field_type: d.type,
        })),
        { onConflict: "content_key" },
      );
      if (error) throw error;
      await invalidate();
      toast.success(`تم حفظ ${keys.length} حقل.`);
    } catch (err) {
      console.error(err);
      toast.error("تعذر الحفظ، حاول مرة أخرى.");
    } finally {
      setSaving(null);
    }
  };

  const resetKey = async (key: string) => {
    const d = CONTENT_DEFAULTS.find((c) => c.key === key);
    if (!d) return;
    setSaving(key);
    try {
      const { error } = await supabase.from("site_content").delete().eq("content_key", key);
      if (error) throw error;
      setDrafts((p) => ({ ...p, [key]: { ar: d.ar, en: d.en } }));
      await invalidate();
      toast.success("تمت الإعادة إلى النص الافتراضي.");
    } catch (err) {
      console.error(err);
      toast.error("تعذر الإعادة.");
    } finally {
      setSaving(null);
    }
  };

  const saveMedia = async (key: string, url: string | null, meta?: { sizeBytes: number; originalBytes: number }) => {
    const d = MEDIA_DEFAULTS.find((m) => m.key === key)!;
    if (url === null) {
      const { error } = await supabase.from("media_assets").delete().eq("asset_key", key);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("media_assets").upsert(
        {
          asset_key: key,
          section: d.section,
          image_url: url,
          alt_text_ar: d.altAr,
          alt_text_en: d.altEn,
          size_bytes: meta?.sizeBytes ?? null,
          original_bytes: meta?.originalBytes ?? null,
        },
        { onConflict: "asset_key" },
      );
      if (error) throw error;
    }
    await invalidate();
  };

  if (content.isLoading || media.isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue={SECTIONS[1]?.id ?? "hero"} className="w-full">
      <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {SECTIONS.map((sec) => (
          <TabsTrigger
            key={sec.id}
            value={sec.id}
            className="rounded-full border border-border px-4 py-2 text-xs font-bold data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {sec.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {SECTIONS.map((sec) => {
        const fields = CONTENT_DEFAULTS.filter((c) => c.section === sec.id);
        const images = MEDIA_DEFAULTS.filter((m) => m.section === sec.id);
        const sectionDirty = fields.some((f) => dirty.has(f.key));
        return (
          <TabsContent key={sec.id} value={sec.id} className="mt-6 space-y-6">
            {images.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((m) => {
                  const row = media.byKey.get(m.key);
                  return (
                    <ImageField
                      key={m.key}
                      label={m.label}
                      hint={m.hint}
                      folder={`sections/${sec.id}`}
                      currentUrl={row?.image_url ?? null}
                      defaultUrl={m.url}
                      sizeBytes={row?.size_bytes ?? null}
                      originalBytes={row?.original_bytes ?? null}
                      onChange={(url, meta) => saveMedia(m.key, url, meta)}
                    />
                  );
                })}
              </div>
            ) : null}

            {fields.length > 0 ? (
              <div className="glass-panel space-y-5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-primary">نصوص {sec.label}</h3>
                  <Button size="sm" onClick={() => saveSection(sec.id)} disabled={!sectionDirty || saving !== null} className="gap-1">
                    {saving === sec.id ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    حفظ الكل
                  </Button>
                </div>
                {fields.map((f) => {
                  const cur = drafts[f.key] ?? { ar: f.ar, en: f.en };
                  const isDirty = dirty.has(f.key);
                  const custom = content.byKey.has(f.key);
                  const Field = f.type === "single_line" ? Input : Textarea;
                  return (
                    <div key={f.key} className="space-y-2 border-t border-border/50 pt-4 first:border-0 first:pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-sm font-semibold">
                          {f.label}
                          {isDirty ? <span className="mr-2 text-xs text-primary">• غير محفوظ</span> : null}
                        </label>
                        <div className="flex gap-1">
                          {custom ? (
                            <Button size="sm" variant="ghost" onClick={() => resetKey(f.key)} disabled={saving !== null} className="gap-1 text-xs">
                              <RotateCcw className="size-3.5" /> افتراضي
                            </Button>
                          ) : null}
                          <Button size="sm" variant={isDirty ? "default" : "outline"} onClick={() => saveKey(f.key)} disabled={!isDirty || saving !== null} className="gap-1 text-xs">
                            {saving === f.key ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} حفظ
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <span className="mb-1 block text-[11px] text-muted-foreground">عربي</span>
                          <Field
                            dir="rtl"
                            value={cur.ar}
                            maxLength={f.max}
                            rows={3}
                            onChange={(e) => setDrafts((p) => ({ ...p, [f.key]: { ...cur, ar: e.target.value } }))}
                          />
                        </div>
                        <div>
                          <span className="mb-1 block text-[11px] text-muted-foreground">English</span>
                          <Field
                            dir="ltr"
                            value={cur.en}
                            maxLength={f.max}
                            rows={3}
                            onChange={(e) => setDrafts((p) => ({ ...p, [f.key]: { ...cur, en: e.target.value } }))}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {cur.ar.length}/{f.max}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
