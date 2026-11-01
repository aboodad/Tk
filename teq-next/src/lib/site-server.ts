import { QueryClient, dehydrate } from "@tanstack/react-query";

import {
  buildContent,
  buildMedia,
  buildSettings,
  mediaAssetsQuery,
  siteContentQuery,
  siteSettingsQuery,
} from "@/lib/site";

/**
 * جلب بيانات الموقع على الخادم (يُخزَّن الناتج عبر ISR في app/page.tsx).
 * أي فشل في الاتصال لا يكسر الصفحة: نرجع للنصوص والصور الافتراضية.
 */
export async function loadSiteData() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  await Promise.allSettled([
    qc.prefetchQuery(siteContentQuery),
    qc.prefetchQuery(mediaAssetsQuery),
    qc.prefetchQuery(siteSettingsQuery),
  ]);

  return {
    content: buildContent(qc.getQueryData(siteContentQuery.queryKey) ?? []),
    media: buildMedia(qc.getQueryData(mediaAssetsQuery.queryKey) ?? []),
    site: buildSettings(qc.getQueryData(siteSettingsQuery.queryKey)),
    dehydrated: dehydrate(qc),
  };
}
