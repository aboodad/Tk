import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "لوحة إدارة المشاريع | تكنيك Tekniq",
  description: "لوحة خاصة لإضافة وتعديل مشاريع تكنيك مع الصور والمحتوى والإحصائيات.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
