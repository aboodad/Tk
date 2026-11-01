"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import type { DayPoint, Kpi } from "@/lib/stats";
import { HEAT_WEEKDAYS } from "@/lib/stats";

/* ------------------------------------------------------------------ */
/* ألوان وتنسيقات                                                       */
/* ------------------------------------------------------------------ */
export const C = {
  main: "var(--accent-cyan)",
  second: "oklch(0.66 0.19 295)",
  prev: "var(--muted-foreground)",
  good: "oklch(0.72 0.16 160)",
  bad: "oklch(0.68 0.2 15)",
  palette: [
    "var(--accent-cyan)",
    "oklch(0.66 0.19 295)",
    "oklch(0.8 0.16 75)",
    "oklch(0.72 0.16 160)",
    "oklch(0.68 0.2 15)",
    "oklch(0.62 0.04 257)",
  ],
} as const;

export const nf = new Intl.NumberFormat("ar");
export const nf1 = new Intl.NumberFormat("ar", { maximumFractionDigits: 1 });
export const pf = new Intl.NumberFormat("ar", { style: "percent", maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/* أدوات                                                                */
/* ------------------------------------------------------------------ */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setW(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    setW(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return { ref, w };
}

type Pt = { x: number; y: number };

/** منحنى ناعم لا يتجاوز القيم (Monotone cubic — Fritsch–Carlson). */
export function smoothPath(pts: Pt[]): string {
  const n = pts.length;
  if (n === 0) return "";
  const first = pts[0] as Pt;
  if (n === 1) return `M${first.x},${first.y}`;

  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = pts[i] as Pt;
    const b = pts[i + 1] as Pt;
    dx.push(b.x - a.x);
    m.push((b.y - a.y) / (b.x - a.x || 1));
  }
  const t: number[] = new Array(n).fill(0);
  t[0] = m[0] as number;
  t[n - 1] = m[n - 2] as number;
  for (let i = 1; i < n - 1; i++) {
    const a = m[i - 1] as number;
    const b = m[i] as number;
    t[i] = a * b <= 0 ? 0 : (a + b) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    const mi = m[i] as number;
    if (mi === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = (t[i] as number) / mi;
    const b = (t[i + 1] as number) / mi;
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      t[i] = tau * a * mi;
      t[i + 1] = tau * b * mi;
    }
  }

  let d = `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i] as Pt;
    const p1 = pts[i + 1] as Pt;
    const h = (dx[i] as number) / 3;
    d += `C${(p0.x + h).toFixed(1)},${(p0.y + (t[i] as number) * h).toFixed(1)} ${(p1.x - h).toFixed(1)},${(
      p1.y -
      (t[i + 1] as number) * h
    ).toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }
  return d;
}

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * pow;
}

/** عدّاد أرقام ناعم عند تغيّر القيمة. */
export function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const start = from.current;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start) * eased;
      from.current = val;
      setV(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

/* ------------------------------------------------------------------ */
/* شارة التغيّر                                                         */
/* ------------------------------------------------------------------ */
export function Delta({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "color-mix(in oklab, var(--accent-cyan) 18%, transparent)", color: "var(--accent-cyan)" }}>
        جديد
      </span>
    );
  }
  const flat = Math.abs(value) < 0.005;
  const up = value > 0;
  const good = flat ? null : invert ? !up : up;
  const color = good === null ? "var(--muted-foreground)" : good ? C.good : C.bad;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}
      dir="ltr"
    >
      <Icon className="size-3" strokeWidth={3} />
      {pf.format(Math.abs(value))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                            */
/* ------------------------------------------------------------------ */
export function Sparkline({ values, color = C.main }: { values: number[]; color?: string }) {
  const id = useId().replace(/:/g, "");
  const W = 100;
  const H = 36;
  const { line, area } = useMemo(() => {
    const max = Math.max(1, ...values);
    const n = values.length;
    const pts = values.map((v, i) => ({ x: n === 1 ? W / 2 : (i / (n - 1)) * W, y: H - 3 - (v / max) * (H - 8) }));
    const l = smoothPath(pts);
    return { line: l, area: pts.length > 1 ? `${l}L${W},${H}L0,${H}Z` : "" };
  }, [values]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: color }} stopOpacity={0.35} />
          <stop offset="100%" style={{ stopColor: color }} stopOpacity={0} />
        </linearGradient>
      </defs>
      {area ? <path d={area} fill={`url(#sp-${id})`} className="st-fade" /> : null}
      <path d={line} fill="none" style={{ stroke: color }} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="st-draw" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* بطاقة مؤشر                                                           */
/* ------------------------------------------------------------------ */
export function KpiCard({
  icon,
  label,
  kpi,
  format,
  invert,
  color,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  kpi: Kpi;
  format: (n: number) => string;
  invert?: boolean;
  color?: string;
  delay?: number;
}) {
  const shown = useCountUp(kpi.value);
  return (
    <div className="glass-panel st-rise flex flex-col gap-3 overflow-hidden p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="icon-3d !h-10 !w-10 !rounded-xl">{icon}</div>
          <p className="text-xs font-bold text-muted-foreground">{label}</p>
        </div>
        <Delta value={kpi.delta} invert={invert ?? false} />
      </div>
      <p className="text-3xl font-extrabold tracking-tight text-primary tabular-nums" dir="ltr">
        {format(shown)}
      </p>
      <div className="-mx-1 -mb-1">
        <Sparkline values={kpi.spark} color={color ?? C.main} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* مخطط المساحة الرئيسي (زيارات + زوار + مقارنة بالفترة السابقة)           */
/* ------------------------------------------------------------------ */
export function AreaTrend({ data, height = 280 }: { data: DayPoint[]; height?: number }) {
  const { ref, w } = useWidth<HTMLDivElement>();
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const M = { t: 14, r: 10, b: 28, l: 38 };
  const innerW = Math.max(0, w - M.l - M.r);
  const innerH = height - M.t - M.b;
  const n = data.length;

  const geo = useMemo(() => {
    const peak = Math.max(1, ...data.map((d) => Math.max(d.views, d.prevViews)));
    const yMax = niceMax(peak);
    const x = (i: number) => M.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = (v: number) => M.t + innerH - (v / yMax) * innerH;
    const views = data.map((d, i) => ({ x: x(i), y: y(d.views) }));
    const sessions = data.map((d, i) => ({ x: x(i), y: y(d.sessions) }));
    const prev = data.map((d, i) => ({ x: x(i), y: y(d.prevViews) }));
    const vLine = smoothPath(views);
    return {
      yMax,
      x,
      y,
      views,
      sessions,
      vLine,
      sLine: smoothPath(sessions),
      pLine: smoothPath(prev),
      area: views.length > 1 ? `${vLine}L${x(n - 1)},${M.t + innerH}L${x(0)},${M.t + innerH}Z` : "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, innerW, innerH, n]);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * geo.yMax);
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 64))));

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = n === 1 ? 0 : Math.round((px / rect.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const h = hover !== null ? data[hover] : undefined;
  const hx = hover !== null ? geo.x(hover) : 0;
  const tipLeft = Math.max(8, Math.min(w - 168, hx - 80));

  return (
    <div ref={ref} className="relative w-full select-none" dir="ltr" style={{ height }}>
      {w > 0 ? (
        <svg width={w} height={height} role="img" aria-label="الزيارات اليومية">
          <defs>
            <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: C.main }} stopOpacity={0.45} />
              <stop offset="70%" style={{ stopColor: C.main }} stopOpacity={0.06} />
              <stop offset="100%" style={{ stopColor: C.main }} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: C.second }} />
              <stop offset="100%" style={{ stopColor: C.main }} />
            </linearGradient>
            <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {ticks.map((tv, i) => (
            <g key={i}>
              <line x1={M.l} x2={w - M.r} y1={geo.y(tv)} y2={geo.y(tv)} stroke="var(--border)" strokeDasharray="3 5" />
              <text x={M.l - 8} y={geo.y(tv) + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
                {nf.format(Math.round(tv * 10) / 10)}
              </text>
            </g>
          ))}

          {data.map((d, i) =>
            i % step === 0 ? (
              <text key={d.key} x={geo.x(i)} y={height - 8} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                {d.label}
              </text>
            ) : null,
          )}

          {geo.area ? <path d={geo.area} fill={`url(#area-${id})`} className="st-fade" /> : null}
          <path d={geo.pLine} fill="none" stroke={C.prev} strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="4 5" className="st-fade" />
          <path d={geo.sLine} fill="none" style={{ stroke: C.second }} strokeWidth={2} strokeLinecap="round" pathLength={1} className="st-draw" />
          <path d={geo.vLine} fill="none" stroke={`url(#line-${id})`} strokeWidth={3} strokeLinecap="round" pathLength={1} className="st-draw" filter={`url(#glow-${id})`} />

          {h ? (
            <g pointerEvents="none">
              <line x1={hx} x2={hx} y1={M.t} y2={M.t + innerH} stroke="var(--muted-foreground)" strokeOpacity={0.5} strokeDasharray="3 4" />
              <circle cx={hx} cy={geo.y(h.sessions)} r={4.5} style={{ fill: C.second }} stroke="var(--card)" strokeWidth={2} />
              <circle cx={hx} cy={geo.y(h.views)} r={5.5} style={{ fill: C.main }} stroke="var(--card)" strokeWidth={2.5} />
            </g>
          ) : null}

          <rect x={M.l} y={M.t} width={innerW} height={innerH} fill="transparent" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} style={{ touchAction: "pan-y" }} />
        </svg>
      ) : null}

      {h ? (
        <div
          className="pointer-events-none absolute top-2 z-10 w-40 rounded-xl border border-border px-3 py-2 text-xs shadow-xl"
          style={{ left: tipLeft, background: "color-mix(in oklab, var(--card) 92%, transparent)", backdropFilter: "blur(8px)" }}
          dir="rtl"
        >
          <p className="mb-1.5 font-extrabold text-foreground">{h.label}</p>
          <TipRow color={C.main} label="زيارات" value={nf.format(h.views)} />
          <TipRow color={C.second} label="زوار" value={nf.format(h.sessions)} />
          <TipRow color={C.prev} label="الفترة السابقة" value={nf.format(h.prevViews)} dim />
        </div>
      ) : null}
    </div>
  );
}

function TipRow({ color, label, value, dim }: { color: string; label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <i className="inline-block size-2 rounded-full" style={{ background: color, opacity: dim ? 0.6 : 1 }} />
        {label}
      </span>
      <b className="text-foreground tabular-nums">{value}</b>
    </div>
  );
}

export function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <i className="inline-block h-0.5 w-4 rounded-full" style={{ background: dashed ? "transparent" : color, borderTop: dashed ? `2px dashed ${color}` : undefined }} />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* دونات المصادر                                                        */
/* ------------------------------------------------------------------ */
export function Donut({ items }: { items: { name: string; value: number; share: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const R = 74;
  const CIRC = 2 * Math.PI * R;
  const total = items.reduce((s, i) => s + i.value, 0);
  const gap = items.length > 1 ? 5 : 0;

  let acc = 0;
  const segs = items.map((it, i) => {
    const len = total ? (it.value / total) * CIRC : 0;
    const seg = { len: Math.max(0, len - gap), offset: acc, color: C.palette[i % C.palette.length] as string };
    acc += len;
    return seg;
  });

  const cur = active !== null ? items[active] : undefined;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-around">
      <div className="relative size-[200px] shrink-0" dir="ltr">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90" role="img" aria-label="مصادر الزيارات">
          <circle cx={100} cy={100} r={R} fill="none" stroke="var(--muted)" strokeWidth={20} />
          {segs.map((s, i) => (
            <circle
              key={i}
              cx={100}
              cy={100}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? 26 : 20}
              strokeLinecap="round"
              strokeDasharray={`${ready ? s.len : 0} ${CIRC}`}
              strokeDashoffset={-s.offset}
              opacity={active === null || active === i ? 1 : 0.35}
              style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1), stroke-width .2s, opacity .2s", cursor: "pointer" }}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="max-w-[110px] truncate text-[11px] font-bold text-muted-foreground" dir="auto">
            {cur ? cur.name : "إجمالي الزيارات"}
          </span>
          <span className="text-3xl font-extrabold text-primary tabular-nums">{nf.format(cur ? cur.value : total)}</span>
          {cur ? <span className="text-xs font-bold text-muted-foreground">{pf.format(cur.share)}</span> : null}
        </div>
      </div>

      <ul className="w-full max-w-xs space-y-1.5">
        {items.map((it, i) => (
          <li
            key={it.name}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            className="flex cursor-default items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-sm transition-colors"
            style={{ background: active === i ? "color-mix(in oklab, var(--muted) 80%, transparent)" : "transparent" }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <i className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: C.palette[i % C.palette.length] }} />
              <span className="truncate font-semibold" dir="auto">
                {it.name}
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-muted-foreground tabular-nums">
              {nf.format(it.value)} · {pf.format(it.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* أعمدة أفقية مرتبة (أكثر الصفحات زيارة)                                */
/* ------------------------------------------------------------------ */
export function RankedBars({ items }: { items: { path: string; views: number; share: number }[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const max = Math.max(1, ...items.map((i) => i.views));

  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={it.path} className="st-rise" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <b className="grid size-5 shrink-0 place-items-center rounded-md bg-muted text-[11px] text-muted-foreground">{nf.format(i + 1)}</b>
              <span className="truncate font-semibold" dir="ltr">
                {it.path}
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-muted-foreground tabular-nums">
              {nf.format(it.views)} · {pf.format(it.share)}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted" dir="ltr">
            <div
              className="h-full rounded-full"
              style={{
                width: ready ? `${(it.views / max) * 100}%` : "0%",
                background: `linear-gradient(90deg, ${C.second}, ${C.main})`,
                transition: `width 900ms cubic-bezier(.22,1,.36,1) ${i * 60}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* خريطة حرارية: أيام الأسبوع × ساعات اليوم                               */
/* ------------------------------------------------------------------ */
export function Heatmap({ grid, max }: { grid: number[][]; max: number }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-[560px]" dir="ltr">
        <div className="grid gap-1" style={{ gridTemplateColumns: "64px repeat(24, minmax(0, 1fr))" }}>
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="text-center text-[10px] font-semibold text-muted-foreground tabular-nums">
              {h % 3 === 0 ? nf.format(h) : ""}
            </span>
          ))}
          {HEAT_WEEKDAYS.map(({ index, label }) => (
            <HeatRow key={index} label={label} row={grid[index] ?? []} max={max} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeatRow({ label, row, max }: { label: string; row: number[]; max: number }) {
  return (
    <>
      <span className="pe-2 text-end text-[11px] font-bold text-muted-foreground" dir="rtl">
        {label}
      </span>
      {Array.from({ length: 24 }, (_, h) => {
        const v = row[h] ?? 0;
        const p = max ? v / max : 0;
        return (
          <i
            key={h}
            title={`${label} · ${nf.format(h)}:٠٠ — ${nf.format(v)} زيارة`}
            className="block aspect-square rounded-[5px] transition-transform hover:z-10 hover:scale-125"
            style={{
              background: v === 0 ? "color-mix(in oklab, var(--muted) 70%, transparent)" : `color-mix(in oklab, ${C.main} ${Math.round(18 + p * 82)}%, var(--muted))`,
              boxShadow: p > 0.7 ? `0 0 10px color-mix(in oklab, ${C.main} 55%, transparent)` : undefined,
            }}
          />
        );
      })}
    </>
  );
}
