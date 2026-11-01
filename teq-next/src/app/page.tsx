import { HydrationBoundary } from "@tanstack/react-query";

import { HomeView } from "@/components/HomeView";
import { loadSiteData } from "@/lib/site-server";

// صفحة مولّدة مسبقًا على الخادم وتُجدَّد كل دقيقة (ISR): HTML جاهز فورًا + تحديث المحتوى من لوحة الإدارة.
export const revalidate = 60;

export default async function Page() {
  const { content, media, site, dehydrated } = await loadSiteData();

  return (
    <HydrationBoundary state={dehydrated}>
      <HomeView content={content} media={media} site={site} />
    </HydrationBoundary>
  );
}
