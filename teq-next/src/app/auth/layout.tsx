import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "دخول الإدارة | تكنيك Tekniq",
  description: "صفحة تسجيل الدخول الخاصة بلوحة إدارة موقع تكنيك Tekniq.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
