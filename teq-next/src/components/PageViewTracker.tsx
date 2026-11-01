"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackPageView } from "@/lib/analytics";

const IGNORED = ["/admin", "/auth"];

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || IGNORED.some((p) => pathname.startsWith(p))) return;
    void trackPageView(pathname);
  }, [pathname]);

  return null;
}
