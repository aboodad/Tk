"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PageViewTracker } from "@/components/PageViewTracker";
import { Toaster } from "@/components/ui/sonner";
import { useSiteSettings } from "@/lib/site";

function DynamicFavicon() {
  const { settings } = useSiteSettings();
  useEffect(() => {
    const url = settings.favicon_url?.trim();
    if (!url) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
    link.type = "";
  }, [settings.favicon_url]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PageViewTracker />
      <DynamicFavicon />
      {children}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
