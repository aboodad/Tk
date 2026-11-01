import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  CONTENT_DEFAULTS,
  MEDIA_DEFAULTS,
  SETTINGS_DEFAULTS,
  DEFAULT_LOGO_URL,
  type SocialLinks,
} from "@/lib/site-defaults";

export const SITE_BUCKET = "site-assets";

export type SiteContentRow = {
  id: string;
  content_key: string;
  section: string;
  text_ar: string;
  text_en: string;
  field_type: string;
  updated_at: string;
};

export type MediaAssetRow = {
  id: string;
  asset_key: string;
  image_url: string | null;
  alt_text_ar: string;
  alt_text_en: string;
  section: string;
  size_bytes: number | null;
  original_bytes: number | null;
  updated_at: string;
};

/** تنسيق حجم الملف بصيغة مقروءة (KB / MB). */
export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export type SiteSettingsRow = {
  id: string;
  logo_url: string | null;
  favicon_url: string | null;
  site_name_ar: string;
  site_name_en: string;
  contact_phone: string;
  contact_email: string;
  social_links: SocialLinks;
  updated_at: string;
};

/* ---------- queries ---------- */

export const siteContentQuery = queryOptions({
  queryKey: ["site", "content"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_content").select("*");
    if (error) throw error;
    return (data ?? []) as SiteContentRow[];
  },
  staleTime: 60_000,
});

export const mediaAssetsQuery = queryOptions({
  queryKey: ["site", "media"],
  queryFn: async () => {
    const { data, error } = await supabase.from("media_assets").select("*");
    if (error) throw error;
    return (data ?? []) as MediaAssetRow[];
  },
  staleTime: 60_000,
});

export const siteSettingsQuery = queryOptions({
  queryKey: ["site", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
    if (error) throw error;
    return (data ?? null) as SiteSettingsRow | null;
  },
  staleTime: 60_000,
});

/* ---------- hooks ---------- */

const contentDefaultMap = new Map(CONTENT_DEFAULTS.map((d) => [d.key, d]));
const mediaDefaultMap = new Map(MEDIA_DEFAULTS.map((d) => [d.key, d]));

/** بناء دوال القراءة من الصفوف (دوال نقية — تعمل على الخادم وفي المتصفح). */
export function buildContent(rows: SiteContentRow[]) {
  const byKey = new Map(rows.map((r) => [r.content_key, r]));

  /** Arabic text with English + default fallbacks — never empty. */
  const t = (key: string): string => {
    const row = byKey.get(key);
    const def = contentDefaultMap.get(key);
    return row?.text_ar?.trim() || row?.text_en?.trim() || def?.ar || def?.en || "";
  };
  const tEn = (key: string): string => {
    const row = byKey.get(key);
    const def = contentDefaultMap.get(key);
    return row?.text_en?.trim() || def?.en || "";
  };

  return { rows, byKey, t, tEn };
}

export function buildMedia(rows: MediaAssetRow[]) {
  const byKey = new Map(rows.map((r) => [r.asset_key, r]));

  const img = (key: string): { src: string; alt: string } => {
    const row = byKey.get(key);
    const def = mediaDefaultMap.get(key);
    return {
      src: row?.image_url?.trim() || def?.url || "",
      alt: row?.alt_text_ar?.trim() || row?.alt_text_en?.trim() || def?.altAr || "",
    };
  };

  return { rows, byKey, img };
}

export function buildSettings(row: SiteSettingsRow | null | undefined) {
  const settings = {
    ...SETTINGS_DEFAULTS,
    ...(row ?? {}),
    social_links: { ...SETTINGS_DEFAULTS.social_links, ...((row?.social_links as SocialLinks | null) ?? {}) },
  };
  const logoUrl = settings.logo_url?.trim() || DEFAULT_LOGO_URL;
  const whatsapp = settings.social_links.whatsapp || SETTINGS_DEFAULTS.social_links.whatsapp!;
  const instagram = settings.social_links.instagram || SETTINGS_DEFAULTS.social_links.instagram!;
  const instagramHandle = settings.social_links.instagram_handle || SETTINGS_DEFAULTS.social_links.instagram_handle!;

  return { settings, logoUrl, whatsapp, instagram, instagramHandle };
}

export function useSiteContent() {
  const query = useQuery(siteContentQuery);
  return { ...query, ...buildContent(query.data ?? []) };
}

export function useMediaAssets() {
  const query = useQuery(mediaAssetsQuery);
  return { ...query, ...buildMedia(query.data ?? []) };
}

export function useSiteSettings() {
  const query = useQuery(siteSettingsQuery);
  return { ...query, ...buildSettings(query.data) };
}

export function useInvalidateSite() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["site"] });
}

/* ---------- storage helpers ---------- */

export type UploadedAsset = {
  url: string;
  /** حجم الملف بعد الضغط (بايت). */
  sizeBytes: number;
  /** حجم الملف الأصلي قبل الضغط (بايت). */
  originalBytes: number;
};

export async function uploadSiteAsset(original: File, folder: string): Promise<UploadedAsset> {
  const { compressImage } = await import("@/lib/image-compress");
  const file = await compressImage(original);
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(SITE_BUCKET)
    .upload(path, file, { upsert: false, cacheControl: "31536000", contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(SITE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, sizeBytes: file.size, originalBytes: original.size };
}

/** Remove a previously uploaded file if it lives in our bucket. */
export async function removeSiteAssetByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/object/public/${SITE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  await supabase.storage.from(SITE_BUCKET).remove([path]);
}
