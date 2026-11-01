import Link from "next/link";
import {
  MessageCircle,
  Instagram,
  Smartphone,
  Globe,
  Cpu,
  LayoutDashboard,
  Database,
  ArrowUpLeft,
  Check,
  Search,
  Zap,
  Smile,
  TrendingUp,
  ChevronDown,
  ShieldCheck,
  Mail,
} from "lucide-react";

import { HeroStage } from "@/components/HeroStage";
import { CountUp, Particles, Reveal, ScrollProgress, Tilt } from "@/components/fx";
import { Pic } from "@/components/Pic";
import { ProjectsSection } from "@/components/ProjectsSection";
import type { buildContent, buildMedia, buildSettings } from "@/lib/site";

type Props = {
  content: ReturnType<typeof buildContent>;
  media: ReturnType<typeof buildMedia>;
  site: ReturnType<typeof buildSettings>;
};

const serviceIcons = [Smartphone, Globe, Cpu, LayoutDashboard, Database];
const whyIcons = [Search, Zap, Smile, TrendingUp];

export function HomeView({ content, media, site }: Props) {
  const { t, tEn } = content;
  const { img } = media;
  const { settings, logoUrl, whatsapp, instagram, instagramHandle } = site;

  const siteName = settings.site_name_ar || "تكنيك";
  const phone = settings.contact_phone || "776567738";
  const heroImg = img("hero_logo_3d");
  const aboutImg = img("about_img");
  const servicesImg = img("services_img");
  const stagesImg = img("stages_img");
  const whyImg = img("why_img");
  const uiuxImg = img("uiux_img");
  const ctaImg = img("cta_banner");

  const services = serviceIcons.map((Icon, i) => ({
    Icon,
    title: t(`service_${i + 1}_title`),
    en: tEn(`service_${i + 1}_title`),
    body: t(`service_${i + 1}_body`),
  }));
  const stages = [1, 2, 3].map((n) => ({
    stage: `Stage ${n}`,
    title: t(`stage_${n}`),
    body: t(`stage_${n}_body`),
  }));
  const whyList = [1, 2, 3, 4].map((n, i) => ({
    Icon: whyIcons[i],
    title: t(`why_${n}`),
    body: t(`why_${n}_body`),
  }));
  const aboutPoints = [1, 2, 3].map((n) => t(`about_point_${n}`));
  const stats = [1, 2, 3, 4].map((n) => ({ value: t(`stat_${n}_value`), label: t(`stat_${n}_label`) }));
  const rotator = [1, 2, 3].map((n) => t(`hero_rotator_${n}`));
  const marquee = services.flatMap((s) => [s.title, s.en]).filter(Boolean);

  const navLinks = [
    { href: "#about", label: t("nav_about") },
    { href: "#services", label: t("nav_services") },
    { href: "#why", label: t("nav_why") },
    { href: "#projects", label: t("projects_heading") },
    { href: "#contact", label: t("nav_contact") },
  ];

  return (
    <div className="tk-page min-h-screen bg-background text-foreground">
      <ScrollProgress />

      {/* ───────── Nav ───────── */}
      <header className="tk-nav">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <span className="tk-logo-ring">
              <Pic src={logoUrl} alt={`شعار ${siteName}`} className="h-10 w-10 object-cover" width={80} height={80} sizes="40px" priority />
            </span>
            <span className="text-lg font-extrabold tracking-tight">{siteName}</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((l) => (
              <a key={l.href} className="tk-nav-link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-glow tk-btn rounded-full px-5 py-2 text-sm font-bold">
            {t("nav_cta")}
          </a>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section id="top" className="tk-hero">
        <div className="tk-floor" aria-hidden />
        <span className="tk-orb tk-orb--a" aria-hidden />
        <span className="tk-orb tk-orb--b" aria-hidden />
        <Particles />

        <div className="tk-container">
          <div className="tk-hero-grid">
            <div className="tk-hero-copy text-center md:text-start">
              <span className="chip">{t("hero_chip")}</span>
              <h1 className="tk-h1">
                {t("hero_headline")} <span className="tk-accent">{t("hero_headline_accent")}</span>
              </h1>
              <p className="tk-rotator">
                <span className="tk-rotator-label">{t("hero_rotator_label")}</span>
                <span className="tk-rotator-words" aria-live="off">
                  {rotator.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </span>
              </p>
              <p className="tk-lead whitespace-pre-line">{t("hero_subtext")}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-glow tk-btn tk-glowpulse flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">
                  <MessageCircle className="size-4" /> {t("hero_cta_whatsapp")}
                </a>
                <a href={instagram} target="_blank" rel="noreferrer" className="btn-outline tk-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">
                  <Instagram className="size-4" /> <span dir="ltr">{instagramHandle}</span>
                </a>
              </div>
            </div>

            <HeroStage logoUrl={logoUrl} siteName={siteName} brandImg={heroImg.src ? heroImg : undefined} />
          </div>

          <a href="#about" className="tk-scroll" aria-label={t("hero_scroll")}>
            {t("hero_scroll")}
            <ChevronDown className="size-4" />
          </a>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <div className="tk-stats">
        <div className="tk-container tk-stats-grid">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <Tilt className="tk-stat" max={6}>
                <span className="tk-stat-num">
                  <CountUp value={s.value} />
                </span>
                <span className="tk-stat-label">{s.label}</span>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ───────── Marquee ───────── */}
      <div className="tk-marquee" aria-hidden>
        <div className="tk-marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="tk-marquee-item">
              {marquee.map((m, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  {m}
                  <span className="tk-diamond" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── About ───────── */}
      <section id="about" className="tk-section">
        <span className="tk-dots" aria-hidden />
        <div className="tk-container grid items-center gap-14 md:grid-cols-2">
          <Reveal>
            <Tilt className="tk-frame" max={5}>
              <div className="tk-frame-in">{aboutImg.src ? <Pic src={aboutImg.src} alt={aboutImg.alt} /> : null}</div>
              <span className="tk-badge">
                <ShieldCheck className="size-4" /> {t("about_badge")}
              </span>
            </Tilt>
          </Reveal>
          <div>
            <Reveal>
              <span className="chip">{t("about_chip")}</span>
              <h2 className="section-title tk-h2 mt-4">{t("about_title")}</h2>
              <p className="mt-4 leading-[2] whitespace-pre-line text-muted-foreground">{t("about_description")}</p>
            </Reveal>
            <ul className="mt-7 space-y-3">
              {aboutPoints.filter(Boolean).map((pt, i) => (
                <Reveal as="li" key={pt} delay={120 + i * 110} className="tk-point">
                  <span className="tk-check">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  {pt}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section id="services" className="tk-section">
        <span className="tk-dots" aria-hidden />
        <div className="tk-container">
          <Reveal className="tk-head">
            <span className="chip">{t("services_chip")}</span>
            <h2 className="section-title">{t("services_heading")}</h2>
            <span className="tk-title-bar" />
            <p>{t("services_subtext")}</p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, en, body }, i) => (
              <Reveal key={i} delay={(i % 3) * 100}>
                <Tilt className="h-full" max={7}>
                  <article className="tk-card">
                    <span className="tk-card-num" aria-hidden>
                      0{i + 1}
                    </span>
                    <div className="tk-lift">
                      <span className="tk-icon" style={{ animationDelay: `${-i * 0.9}s` }}>
                        <Icon className="size-6" />
                      </span>
                      <h3 className="mt-5 text-lg leading-snug font-extrabold">{title}</h3>
                      <span className="mt-1 block text-xs font-semibold tracking-widest text-primary/70 uppercase" dir="ltr">
                        {en}
                      </span>
                      <p className="mt-3 text-sm leading-[1.95] whitespace-pre-line text-muted-foreground">{body}</p>
                      <a href={whatsapp} target="_blank" rel="noreferrer" className="tk-card-link">
                        {t("service_cta")} <ArrowUpLeft className="size-4" />
                      </a>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            ))}
            {servicesImg.src ? (
              <Reveal delay={200}>
                <Tilt className="tk-frame tk-fill h-full" max={6}>
                  <div className="tk-frame-in">
                    <Pic src={servicesImg.src} alt={servicesImg.alt} width={1000} height={1000} sizes="(min-width: 1024px) 380px, 100vw" />
                  </div>
                </Tilt>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* ───────── Stages ───────── */}
      <section className="tk-section tk-dark" aria-labelledby="stages-title">
        <div className="tk-container grid items-center gap-14 md:grid-cols-2">
          <div>
            <Reveal>
              <span className="chip">{t("stages_chip")}</span>
              <h2 id="stages-title" className="section-title tk-h2 tk-h2--sm mt-4">
                {t("stages_heading")}
              </h2>
            </Reveal>
            <ol className="tk-steps">
              {stages.map(({ stage, title, body }, i) => (
                <Reveal as="li" key={stage} delay={i * 140} className="tk-step">
                  <span className="tk-node">{i + 1}</span>
                  <div className="tk-glass-dark">
                    <span className="tk-step-kicker" dir="ltr">
                      {stage}
                    </span>
                    <p className="tk-step-title">{title}</p>
                    {body ? <p className="tk-step-body">{body}</p> : null}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={150}>
            <Tilt className="tk-frame" max={5}>
              <div className="tk-frame-in">{stagesImg.src ? <Pic src={stagesImg.src} alt={stagesImg.alt} /> : null}</div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* ───────── Why ───────── */}
      <section id="why" className="tk-section">
        <span className="tk-dots" aria-hidden />
        <div className="tk-container">
          <Reveal className="tk-head">
            <span className="chip">{t("why_chip")}</span>
            <h2 className="section-title">{t("why_heading")}</h2>
            <span className="tk-title-bar" />
            <p className="!text-lg !font-bold !text-foreground">{t("why_subtitle")}</p>
          </Reveal>

          <div className="mt-12 grid items-center gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <Tilt className="tk-frame" max={5}>
                <div className="tk-frame-in">{whyImg.src ? <Pic src={whyImg.src} alt={whyImg.alt} /> : null}</div>
              </Tilt>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 md:col-span-7">
              {whyList.filter((w) => w.title).map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 100}>
                  <Tilt className="h-full" max={8}>
                    <article className="tk-card !p-5">
                      <div className="tk-lift">
                        <span className="tk-icon !h-12 !w-12 !rounded-2xl" style={{ animationDelay: `${-i * 1.1}s` }}>
                          <Icon className="size-5" />
                        </span>
                        <h3 className="mt-4 text-base font-extrabold text-primary">{title}</h3>
                        {body ? <p className="mt-2 text-sm leading-[1.9] text-muted-foreground">{body}</p> : null}
                      </div>
                    </article>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>

          {uiuxImg.src ? (
            <Reveal className="mx-auto mt-14 max-w-4xl">
              <Tilt className="tk-frame" max={4}>
                <div className="tk-frame-in">
                  <Pic src={uiuxImg.src} alt={uiuxImg.alt} width={1600} height={900} sizes="(min-width: 1024px) 896px, 100vw" />
                </div>
              </Tilt>
            </Reveal>
          ) : null}
        </div>
      </section>

      <ProjectsSection />

      {/* ───────── Contact ───────── */}
      <section id="contact" className="tk-section !pt-10">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="tk-cta">
              <Pic src={ctaImg.src || "/images/cta.jpg"} alt={ctaImg.alt} className="tk-cta-img" width={2100} height={900} sizes="(min-width: 1024px) 1024px, 100vw" />
              <span className="tk-orb tk-orb--a" aria-hidden />
              <span className="tk-orb tk-orb--b" aria-hidden />
              <span className="chip">{t("contact_chip")}</span>
              <h2>{t("contact_heading")}</h2>
              <p>{t("contact_subtext")}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-glow tk-btn tk-glowpulse flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">
                  <MessageCircle className="size-4" /> {t("contact_whatsapp_label")} <span dir="ltr">{phone}</span>
                </a>
                <a href={instagram} target="_blank" rel="noreferrer" className="btn-outline tk-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">
                  <Instagram className="size-4" /> {t("contact_instagram_label")} <span dir="ltr">{instagramHandle}</span>
                </a>
              </div>
              {settings.contact_email ? (
                <a href={`mailto:${settings.contact_email}`} dir="ltr" className="tk-link-soft mt-6 inline-flex items-center gap-2 text-sm">
                  <Mail className="size-4" /> {settings.contact_email}
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="tk-footer">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="tk-logo-ring">
              <Pic src={logoUrl} alt={`شعار ${siteName}`} className="h-9 w-9 object-cover" width={72} height={72} sizes="36px" />
            </span>
            <div>
              <p className="tk-footer-name font-bold">
                © {new Date().getFullYear()} {t("footer_copyright")}
              </p>
              <p className="text-xs opacity-80">{t("footer_tagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a href={whatsapp} target="_blank" rel="noreferrer" dir="ltr">
              {phone}
            </a>
            <a href={instagram} target="_blank" rel="noreferrer" dir="ltr">
              {instagramHandle}
            </a>
            <Link href="/auth">{t("footer_admin_label")}</Link>
          </div>
        </div>
      </footer>

      {/* ───────── Floating buttons ───────── */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
        <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="تواصل واتساب" className="fab fab-wa">
          <MessageCircle className="size-6" />
        </a>
        <a href={instagram} target="_blank" rel="noreferrer" aria-label="إنستقرام" className="fab fab-ig">
          <Instagram className="size-6" />
        </a>
      </div>
    </div>
  );
}
