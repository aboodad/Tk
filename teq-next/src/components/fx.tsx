"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* useInView — يعيد true عند ظهور العنصر في الشاشة (مرة واحدة)          */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, seen };
}

/* ------------------------------------------------------------------ */
/* Reveal — ظهور ناعم عند التمرير                                       */
/* ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const { ref, seen } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`tk-reveal ${seen ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt — ميلان ثلاثي الأبعاد يتبع المؤشر مع لمعة ضوء                    */
/* ------------------------------------------------------------------ */
type TiltProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  as?: ElementType;
};

export function Tilt({ children, className = "", max = 8, as: Tag = "div" }: TiltProps) {
  const ref = useRef<HTMLElement>(null);

  const raf = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    // نجمع التحديثات في إطار واحد (rAF) بدل تحديث CSS مع كل حركة مؤشر
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Tag ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tk-tilt ${className}`}>
      {children}
      <span className="tk-tilt-glare" aria-hidden />
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — عدّاد أرقام ("100%" ← يحافظ على اللاحقة)                   */
/* ------------------------------------------------------------------ */
export function CountUp({ value, duration = 1500 }: { value: string; duration?: number }) {
  const match = value.trim().match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : NaN;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2]?.includes(".") ? (match[2].split(".")[1]?.length ?? 0) : 0;

  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!seen || Number.isNaN(target)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, duration]);

  if (Number.isNaN(target)) return <span>{value}</span>;

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgress — شريط تقدم القراءة أعلى الصفحة                       */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
      ref.current?.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="tk-progress" aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* Particles — جسيمات متوهجة (قيم ثابتة لتفادي اختلاف SSR)               */
/* ------------------------------------------------------------------ */
export function Particles({ count = 26 }: { count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    top: (i * 53 + 7) % 100,
    size: 2 + (i % 3),
    dur: 6 + (i % 5) * 1.7,
    del: -((i * 0.83) % 8),
  }));
  return (
    <div className="tk-particles" aria-hidden>
      {dots.map((d, i) => (
        <i
          key={i}
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              "--dur": `${d.dur}s`,
              "--del": `${d.del}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
