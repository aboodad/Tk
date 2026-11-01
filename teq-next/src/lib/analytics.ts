import { supabase } from "@/integrations/supabase/client";

export type PageView = {
  id: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  created_at: string;
};

const SESSION_KEY = "tekniq_session_id";

function getSessionId() {
  if (typeof window === "undefined") return null;
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      session_id: getSessionId(),
    });
  } catch (err) {
    console.warn("page view tracking failed", err);
  }
}

const PAGE_SIZE = 1000; // الحد الأقصى للصفوف في كل طلب من Supabase
const MAX_PAGES = 40; // سقف أمان: 40 ألف زيارة

/** يجلب كل الزيارات خلال المدة (بالصفحات) بدل الاكتفاء بأول 1000 صف. */
export async function fetchPageViews(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const all: PageView[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from("page_views")
      .select("id, path, referrer, session_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    const rows = (data ?? []) as PageView[];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }

  return all;
}
