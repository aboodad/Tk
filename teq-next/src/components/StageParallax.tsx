"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * الجزء التفاعلي الوحيد في المشهد ثلاثي الأبعاد:
 * - parallax يتبع المؤشر (مع rAF)
 * - إيقاف كل الحركات تلقائيًا عندما يخرج المشهد من الشاشة أو تكون التبويبة مخفية
 *   (يوفّر GPU/بطارية، ويُسرّع بقية الصفحة أثناء التمرير)
 */
export function StageParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => {
      el.dataset["paused"] = onScreen && !document.hidden ? "false" : "true";
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting;
        sync();
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", (((clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", (((clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  };

  const onLeave = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <div ref={ref} className="tk-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
