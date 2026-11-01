import type { PageView } from "@/lib/analytics";

export type RangeDays = 7 | 30 | 90;

export type Kpi = {
  value: number;
  prev: number;
  /** نسبة التغيّر عن الفترة السابقة (0.12 = +12%) — null عندما لا توجد بيانات سابقة للمقارنة */
  delta: number | null;
  spark: number[];
};

export type DayPoint = {
  key: string;
  label: string;
  views: number;
  sessions: number;
  /** زيارات نفس اليوم النسبي في الفترة السابقة (للمقارنة) */
  prevViews: number;
};

export type Dashboard = {
  days: RangeDays;
  empty: boolean;
  daily: DayPoint[];
  views: Kpi;
  sessions: Kpi;
  perSession: Kpi;
  bounce: Kpi;
  pages: { path: string; views: number; share: number }[];
  sources: { name: string; value: number; share: number }[];
  heat: { grid: number[][]; max: number };
  insights: {
    bestDay: { label: string; views: number } | null;
    peakHour: number | null;
    topSource: string | null;
  };
};

/** ترتيب أيام الأسبوع في الخريطة الحرارية: السبت أولًا (الأسبوع العربي). */
export const HEAT_WEEKDAYS = [
  { index: 6, label: "السبت" },
  { index: 0, label: "الأحد" },
  { index: 1, label: "الاثنين" },
  { index: 2, label: "الثلاثاء" },
  { index: 3, label: "الأربعاء" },
  { index: 4, label: "الخميس" },
  { index: 5, label: "الجمعة" },
] as const;

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function delta(cur: number, prev: number): number | null {
  if (prev === 0) return cur === 0 ? 0 : null;
  return (cur - prev) / prev;
}

function sourceOf(referrer: string | null): string {
  if (!referrer) return "زيارة مباشرة";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "أخرى";
  }
}

type Bucket = { views: number; sessions: Map<string, number> };
const emptyBuckets = (n: number): Bucket[] => Array.from({ length: n }, () => ({ views: 0, sessions: new Map() }));

function summarize(buckets: Bucket[]) {
  const all = new Map<string, number>();
  let views = 0;
  for (const b of buckets) {
    views += b.views;
    for (const [sid, c] of b.sessions) all.set(sid, (all.get(sid) ?? 0) + c);
  }
  const sessions = all.size;
  let single = 0;
  for (const c of all.values()) if (c === 1) single += 1;
  return {
    views,
    sessions,
    perSession: sessions ? views / sessions : 0,
    bounce: sessions ? single / sessions : 0,
  };
}

/**
 * يبني نموذج لوحة الإحصائيات من الزيارات الخام.
 * `views` يجب أن تغطي آخر `days * 2` يوم (الفترة الحالية + السابقة للمقارنة).
 */
export function buildDashboard(views: PageView[], days: RangeDays): Dashboard {
  const today = midnight(new Date());
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));

  const cur = emptyBuckets(days);
  const prev = emptyBuckets(days);

  const pages = new Map<string, number>();
  const sources = new Map<string, number>();
  const hours = new Array<number>(24).fill(0);
  const grid = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));

  for (const v of views) {
    const created = new Date(v.created_at);
    const idx = Math.round((midnight(created).getTime() - start.getTime()) / DAY_MS);

    let bucket: Bucket | undefined;
    if (idx >= 0 && idx < days) bucket = cur[idx];
    else if (idx >= -days && idx < 0) bucket = prev[idx + days];
    if (!bucket) continue;

    bucket.views += 1;
    if (v.session_id) bucket.sessions.set(v.session_id, (bucket.sessions.get(v.session_id) ?? 0) + 1);

    if (idx >= 0) {
      pages.set(v.path, (pages.get(v.path) ?? 0) + 1);
      const src = sourceOf(v.referrer);
      sources.set(src, (sources.get(src) ?? 0) + 1);
      const h = created.getHours();
      hours[h] = (hours[h] ?? 0) + 1;
      const row = grid[created.getDay()];
      if (row) row[h] = (row[h] ?? 0) + 1;
    }
  }

  const label = new Intl.DateTimeFormat("ar", { day: "numeric", month: "short" });
  const daily: DayPoint[] = cur.map((b, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return {
      key: dayKey(d),
      label: label.format(d),
      views: b.views,
      sessions: b.sessions.size,
      prevViews: prev[i]?.views ?? 0,
    };
  });

  const c = summarize(cur);
  const p = summarize(prev);

  const dayRatio = (b: Bucket) => (b.sessions.size ? b.views / b.sessions.size : 0);
  const dayBounce = (b: Bucket) => {
    if (!b.sessions.size) return 0;
    let single = 0;
    for (const n of b.sessions.values()) if (n === 1) single += 1;
    return single / b.sessions.size;
  };

  const kpi = (value: number, prevValue: number, spark: number[]): Kpi => ({
    value,
    prev: prevValue,
    delta: delta(value, prevValue),
    spark,
  });

  const pagesList = [...pages.entries()]
    .map(([path, n]) => ({ path, views: n, share: c.views ? n / c.views : 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const sorted = [...sources.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5).reduce((s, [, n]) => s + n, 0);
  if (rest > 0) top.push(["أخرى", rest]);
  const sourceList = top.map(([name, value]) => ({ name, value, share: c.views ? value / c.views : 0 }));

  const best = daily.reduce<DayPoint | null>((m, d) => (d.views > (m?.views ?? 0) ? d : m), null);
  const peak = hours.reduce((m, n, h) => (n > (hours[m] ?? 0) ? h : m), 0);

  return {
    days,
    empty: c.views === 0,
    daily,
    views: kpi(c.views, p.views, cur.map((b) => b.views)),
    sessions: kpi(c.sessions, p.sessions, cur.map((b) => b.sessions.size)),
    perSession: kpi(c.perSession, p.perSession, cur.map(dayRatio)),
    bounce: kpi(c.bounce, p.bounce, cur.map(dayBounce)),
    pages: pagesList,
    sources: sourceList,
    heat: { grid, max: Math.max(0, ...grid.flat()) },
    insights: {
      bestDay: best && best.views > 0 ? { label: best.label, views: best.views } : null,
      peakHour: c.views ? peak : null,
      topSource: sorted[0]?.[0] ?? null,
    },
  };
}
