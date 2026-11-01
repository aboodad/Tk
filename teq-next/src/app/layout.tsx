import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import type { ReactNode } from "react";

import { Providers } from "@/components/Providers";
import "../styles.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-cairo",
});

const TITLE = "تكنيك Tekniq | حلول برمجية وتطبيقات ومواقع";
const DESCRIPTION =
  "تكنيق Tekniq شركة متخصصة في تطوير تطبيقات الجوال، تصميم وبرمجة المواقع، الأنظمة المخصصة، وتصميم واجهات وتجربة المستخدم.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Tekniq" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "ar_AR",
    images: ["/images/cta.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/cta.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
