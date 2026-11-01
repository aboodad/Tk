import { supabase } from "@/integrations/supabase/client";

export const PROJECT_BUCKET = "project-images";

export type Project = {
  id: string;
  title: string;
  description: string;
  image_path: string | null;
  link_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export async function signImageUrls(projects: Project[]) {
  const paths = projects.map((p) => p.image_path).filter((p): p is string => !!p);
  if (paths.length === 0) return {} as Record<string, string>;

  const { data } = await supabase.storage.from(PROJECT_BUCKET).createSignedUrls(paths, 60 * 60 * 24);
  const map: Record<string, string> = {};
  data?.forEach((item, i) => {
    const path = paths[i];
    if (item.signedUrl && path) map[path] = item.signedUrl;
  });
  return map;
}

export async function fetchPublishedProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Project[];
}
