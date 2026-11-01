"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2, LogOut, Plus, Trash2, Upload, Eye, EyeOff, ShieldAlert, Pencil, X, Save, BarChart3, FolderKanban, FileText, Settings } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { PROJECT_BUCKET, fetchAllProjects, signImageUrls, type Project } from "@/lib/projects";
import { ContentManager } from "@/components/admin/ContentManager";
import { SettingsManager } from "@/components/admin/SettingsManager";

// لوحة الإحصائيات (رسومات SVG) تُحمَّل عند فتح تبويبها فقط — لا تثقل بقية لوحة الإدارة.
const StatsDashboard = dynamic(() => import("@/components/stats/StatsDashboard").then((m) => m.StatsDashboard), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  ),
});

type EditState = {
  title: string;
  description: string;
  linkUrl: string;
  sortOrder: number;
  file: File | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const [tab, setTab] = useState<"projects" | "content" | "settings" | "stats">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await fetchAllProjects();
      setProjects(rows);
      setUrls(await signImageUrls(rows));
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل المشاريع.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth");
        return;
      }
      setEmail(data.session.user.email ?? null);
      const { data: claimed } = await supabase.rpc("has_role", {
        _user_id: data.session.user.id,
        _role: "admin",
      });
      setIsAdmin(claimed === true);
      if (claimed === true) await load();
      setChecking(false);
    })();
  }, [router, load]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const uploadImage = async (orig: File) => {
    const { compressImage } = await import("@/lib/image-compress");
    const f = await compressImage(orig);
    const ext = f.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(PROJECT_BUCKET)
      .upload(path, f, { contentType: f.type, cacheControl: "31536000" });
    if (upErr) throw upErr;
    return path;
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let imagePath: string | null = null;
      if (file) imagePath = await uploadImage(file);
      const { error: insErr } = await supabase.from("projects").insert({
        title,
        description,
        link_url: linkUrl || null,
        sort_order: sortOrder,
        image_path: imagePath,
      });
      if (insErr) throw insErr;

      setTitle("");
      setDescription("");
      setLinkUrl("");
      setSortOrder(0);
      setFile(null);
      await load();
    } catch (err) {
      console.error(err);
      setError("تعذر حفظ المشروع، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEdit({
      title: p.title,
      description: p.description,
      linkUrl: p.link_url ?? "",
      sortOrder: p.sort_order,
      file: null,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdit(null);
  };

  const saveEdit = async (p: Project) => {
    if (!edit) return;
    setBusy(true);
    setError(null);
    try {
      let imagePath = p.image_path;
      if (edit.file) {
        imagePath = await uploadImage(edit.file);
        if (p.image_path) await supabase.storage.from(PROJECT_BUCKET).remove([p.image_path]);
      }
      const { error: updErr } = await supabase
        .from("projects")
        .update({
          title: edit.title,
          description: edit.description,
          link_url: edit.linkUrl || null,
          sort_order: edit.sortOrder,
          image_path: imagePath,
        })
        .eq("id", p.id);
      if (updErr) throw updErr;
      cancelEdit();
      await load();
    } catch (err) {
      console.error(err);
      setError("تعذر تعديل المشروع، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (p: Project) => {
    await supabase.from("projects").update({ published: !p.published }).eq("id", p.id);
    await load();
  };

  const remove = async (p: Project) => {
    if (!window.confirm(`حذف المشروع "${p.title}"؟`)) return;
    if (p.image_path) await supabase.storage.from(PROJECT_BUCKET).remove([p.image_path]);
    await supabase.from("projects").delete().eq("id", p.id);
    await load();
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="circuit-bg flex min-h-screen items-center justify-center px-5">
        <div className="glass-panel max-w-md p-7 text-center">
          <div className="icon-3d mx-auto mb-4"><ShieldAlert className="size-5" /></div>
          <h1 className="section-title !text-2xl">هذه اللوحة خاصة بالمشرف</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            الحساب <span dir="ltr">{email}</span> لا يملك صلاحية الإدارة.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={signOut} className="btn-outline rounded-full px-5 py-2.5 text-sm font-semibold">تسجيل الخروج</button>
            <Link href="/" className="btn-glow rounded-full px-5 py-2.5 text-sm font-semibold">الموقع</Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="circuit-bg min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="section-title !text-2xl">لوحة الإدارة</h1>
            <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="btn-outline rounded-full px-4 py-2 text-sm font-semibold">الموقع</Link>
            <button onClick={signOut} className="btn-outline flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
              <LogOut className="size-4" /> خروج
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              { id: "projects", label: "المشاريع", Icon: FolderKanban },
              { id: "content", label: "محتوى الموقع", Icon: FileText },
              { id: "settings", label: "الإعدادات", Icon: Settings },
              { id: "stats", label: "الإحصائيات", Icon: BarChart3 },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${tab === id ? "btn-glow" : "btn-outline"}`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        {error ? <p className="mt-6 text-sm font-semibold text-destructive">{error}</p> : null}

        {tab === "stats" ? (
          <section className="mt-8">
            <StatsDashboard />
          </section>
        ) : tab === "content" ? (
          <section className="mt-8">
            <ContentManager />
          </section>
        ) : tab === "settings" ? (
          <section className="mt-8">
            <SettingsManager />
          </section>
        ) : (
          <>
            <form onSubmit={addProject} className="glass-panel mt-8 space-y-4 p-6">
              <h2 className="text-lg font-extrabold text-primary">إضافة مشروع جديد</h2>

              <div>
                <label className="mb-1 block text-sm font-semibold" htmlFor="title">اسم المشروع</label>
                <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold" htmlFor="desc">المحتوى / الوصف</label>
                <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold" htmlFor="link">رابط المشروع (اختياري)</label>
                  <input id="link" dir="ltr" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold" htmlFor="order">ترتيب العرض</label>
                  <input id="order" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold" htmlFor="image">صورة المشروع</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                />
              </div>

              <button type="submit" disabled={busy} className="btn-glow gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                حفظ المشروع
              </button>
            </form>

            <section className="mt-10">
              <h2 className="text-lg font-extrabold text-primary">المشاريع ({projects.length})</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                  <article key={p.id} className="service-card overflow-hidden !p-0">
                    {p.image_path && urls[p.image_path] ? (
                      <img src={urls[p.image_path]} alt={p.title} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted text-muted-foreground">
                        <Upload className="size-6" />
                      </div>
                    )}
                    <div className="p-5">
                      {editingId === p.id && edit ? (
                        <div className="space-y-3">
                          <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className={inputCls} />
                          <textarea rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className={inputCls} />
                          <input dir="ltr" placeholder="رابط المشروع" value={edit.linkUrl} onChange={(e) => setEdit({ ...edit, linkUrl: e.target.value })} className={inputCls} />
                          <input type="number" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })} className={inputCls} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEdit({ ...edit, file: e.target.files?.[0] ?? null })}
                            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(p)}
                              disabled={busy}
                              className="btn-glow flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold disabled:opacity-60"
                            >
                              {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ
                            </button>
                            <button onClick={cancelEdit} className="btn-outline flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold">
                              <X className="size-4" /> إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-extrabold text-primary">{p.title}</h3>
                          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{p.description}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => togglePublished(p)}
                              className="btn-outline flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                            >
                              {p.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                              {p.published ? "منشور" : "مخفي"}
                            </button>
                            <button
                              onClick={() => startEdit(p)}
                              className="btn-outline flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                            >
                              <Pencil className="size-4" /> تعديل
                            </button>
                            <button
                              onClick={() => remove(p)}
                              className="flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive"
                            >
                              <Trash2 className="size-4" /> حذف
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {projects.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">لا توجد مشاريع بعد — أضف أول مشروع من الأعلى.</p>
              ) : null}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
