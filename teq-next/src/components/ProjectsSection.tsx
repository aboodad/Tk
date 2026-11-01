"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import { Reveal, Tilt } from "@/components/fx";
import { fetchPublishedProjects, signImageUrls, type Project } from "@/lib/projects";
import { useSiteContent } from "@/lib/site";

/** عرض المشاريع (منفصل عن جلب البيانات لسهولة المعاينة والاختبار). */
export function ProjectsView({ projects, urls }: { projects: Project[]; urls: Record<string, string> }) {
  const { t } = useSiteContent();

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="tk-section">
      <span className="tk-dots" aria-hidden />
      <div className="tk-container">
        <Reveal className="tk-head">
          <span className="chip">{t("projects_chip")}</span>
          <h2 className="section-title">{t("projects_heading")}</h2>
          <span className="tk-title-bar" />
          <p>{t("projects_subtext")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <Tilt className="h-full" max={7}>
                <article className="tk-card !p-0">
                  {p.image_path && urls[p.image_path] ? (
                    <div className="overflow-hidden">
                      <img
                        src={urls[p.image_path]}
                        alt={p.title}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="tk-lift p-6">
                    <h3 className="text-lg font-extrabold text-primary">{p.title}</h3>
                    {p.description ? (
                      <p className="mt-2 whitespace-pre-line text-sm leading-[1.9] text-muted-foreground">{p.description}</p>
                    ) : null}
                    {p.link_url ? (
                      <a href={p.link_url} target="_blank" rel="noreferrer" className="tk-card-link">
                        {t("projects_link_label")} <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await fetchPublishedProjects();
        if (!active) return;
        setProjects(rows);
        const signed = await signImageUrls(rows);
        if (active) setUrls(signed);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return <ProjectsView projects={projects} urls={urls} />;
}
