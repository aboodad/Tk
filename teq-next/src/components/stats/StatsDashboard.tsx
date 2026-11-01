"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, Eye, Globe2, Loader2, MousePointerClick, RefreshCw, Sparkles, Trophy, Users } from "lucide-react";

import { fetchPageViews } from "@/lib/analytics";
import { buildDashboard, type RangeDays } from "@/lib/stats";
import { AreaTrend, C, Donut, Heatmap, KpiCard, LegendDot, RankedBars, nf, nf1, pf } from "@/components/stats/charts";

const RANGES: { days: RangeDays; label: string }[] = [
  { days: 7, label: "٧ أيام" },
  { days: 30, label: "٣٠ يومًا" },
  { days: 90, label: "٩٠ يومًا" },
];

function Panel({ title, hint, right, children, delay = 0, className = "" }: { title: string; hint?: string; right?: ReactNode; children: ReactNode; delay?: number; className?: string }) {
  return (
    <section className={`glass-panel st-rise p-5 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-primary">{title}</h3>
          {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

function Insight({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3" style={{ background: "color-mix(in oklab, var(--muted) 45%, transparent)" }}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground" style={{ background: `linear-gradient(140deg, var(--primary), ${C.main})` }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-extrabold text-foreground" dir="auto">
          {value}
        </p>
      </div>
    </div>
  );
}

function hourLabel(h: number) {
  const suffix = h >= 12 ? "م" : "ص";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${nf.format(h12)} ${suffix}`;
}

function Skeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="glass-panel h-36 animate-pulse" />
        ))}
      </div>
      <div className="glass-panel h-80 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel h-72 animate-pulse" />
        <div className="glass-panel h-72 animate-pulse" />
      </div>
    </div>
  );
}

export function StatsDashboard() {
  const [days, setDays] = useState<RangeDays>(30);

  // نجلب ضعف المدة: الفترة الحالية + الفترة السابقة للمقارنة
  const query = useQuery({
    queryKey: ["admin", "page_views", days * 2],
    queryFn: () => fetchPageViews(days * 2),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const data = useMemo(() => (query.data ? buildDashboard(query.data, days) : null), [query.data, days]);

  const updated = query.dataUpdatedAt
    ? new Intl.DateTimeFormat("ar", { hour: "numeric", minute: "2-digit" }).format(new Date(query.dataUpdatedAt))
    : null;

  return (
    <div className="space-y-6">
      {/* الشريط العلوي */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex rounded-full border border-border p-1"
          style={{ background: "color-mix(in oklab, var(--muted) 55%, transparent)" }}
          role="tablist"
          aria-label="المدة"
        >
          {RANGES.map((r) => (
            <button
              key={r.days}
              role="tab"
              aria-selected={days === r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${days === r.days ? "btn-glow" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {updated ? <span>آخر تحديث {updated}</span> : null}
          <button
            onClick={() => query.refetch()}
            disabled={query.isFetching}
            className="btn-outline flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold disabled:opacity-60"
          >
            {query.isFetching ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            تحديث
          </button>
        </div>
      </div>

      {query.isError ? (
        <div className="glass-panel p-6 text-center">
          <p className="text-sm font-semibold text-destructive">تعذر تحميل الإحصائيات.</p>
          <button onClick={() => query.refetch()} className="btn-outline mt-3 rounded-full px-4 py-2 text-xs font-bold">
            إعادة المحاولة
          </button>
        </div>
      ) : !data ? (
        <Skeleton />
      ) : (
        <div key={days} className="space-y-6">
          {/* المؤشرات */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard icon={<Eye className="size-5" />} label="إجمالي الزيارات" kpi={data.views} format={(n) => nf.format(Math.round(n))} />
            <KpiCard icon={<Users className="size-5" />} label="الزوار (جلسات)" kpi={data.sessions} format={(n) => nf.format(Math.round(n))} color={C.second} delay={60} />
            <KpiCard icon={<MousePointerClick className="size-5" />} label="صفحات لكل جلسة" kpi={data.perSession} format={(n) => nf1.format(n)} color={C.palette[2]} delay={120} />
            <KpiCard icon={<Activity className="size-5" />} label="معدل الارتداد" kpi={data.bounce} format={(n) => pf.format(n)} invert color={C.palette[4]} delay={180} />
          </div>

          {/* لمحات سريعة */}
          {!data.empty ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <Insight icon={<Trophy className="size-4" />} label="أفضل يوم" value={data.insights.bestDay ? `${data.insights.bestDay.label} · ${nf.format(data.insights.bestDay.views)} زيارة` : "—"} />
              <Insight icon={<Clock className="size-4" />} label="ذروة الزيارات" value={data.insights.peakHour !== null ? hourLabel(data.insights.peakHour) : "—"} />
              <Insight icon={<Globe2 className="size-4" />} label="أقوى مصدر" value={data.insights.topSource ?? "—"} />
            </div>
          ) : null}

          {/* الاتجاه */}
          <Panel
            title="اتجاه الزيارات"
            hint="مقارنة مع الفترة السابقة المماثلة"
            delay={100}
            right={
              <div className="flex flex-wrap items-center gap-4">
                <LegendDot color={C.main} label="زيارات" />
                <LegendDot color={C.second} label="زوار" />
                <LegendDot color="var(--muted-foreground)" label="الفترة السابقة" dashed />
              </div>
            }
          >
            {data.empty ? (
              <div className="grid h-56 place-items-center text-center text-sm text-muted-foreground">
                <div>
                  <Sparkles className="mx-auto mb-2 size-6 opacity-60" />
                  لا توجد زيارات في هذه الفترة بعد.
                </div>
              </div>
            ) : (
              <AreaTrend data={data.daily} />
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="مصادر الزيارات" hint="من أين يصل الزوار" delay={140}>
              {data.sources.length ? <Donut items={data.sources} /> : <Empty />}
            </Panel>
            <Panel title="أكثر الصفحات زيارة" hint="حسب عدد المشاهدات" delay={180}>
              {data.pages.length ? <RankedBars items={data.pages} /> : <Empty />}
            </Panel>
          </div>

          <Panel title="أوقات النشاط" hint="الأيام × ساعات اليوم — الأغمق أكثر زيارة" delay={220}>
            {data.heat.max ? <Heatmap grid={data.heat.grid} max={data.heat.max} /> : <Empty />}
          </Panel>
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <p className="py-10 text-center text-sm text-muted-foreground">لا توجد بيانات كافية بعد.</p>;
}
