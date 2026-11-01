import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  /** صورة أعلى الصفحة (LCP): تُحمَّل فورًا وبأولوية. */
  priority?: boolean;
  sizes?: string;
};

const SUPABASE_HOST = /^https:\/\/[^/]+\.supabase\.co\//;

/**
 * غلاف لـ next/image: يحوّل الصور تلقائيًا إلى AVIF/WebP بمقاسات مناسبة للشاشة.
 * الروابط الخارجية خارج Supabase تُعرض كما هي دون تحسين.
 */
export function Pic({ src, alt, className, style, width = 1200, height = 900, priority, sizes }: Props) {
  if (!src) return null;
  const optimizable = src.startsWith("/") || SUPABASE_HOST.test(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      sizes={sizes ?? "(min-width: 1024px) 560px, 100vw"}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized={!optimizable}
      draggable={false}
    />
  );
}
