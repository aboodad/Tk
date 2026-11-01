"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage("تعذر تسجيل الدخول: تحقق من البريد وكلمة المرور.");
      return;
    }
    router.replace("/admin");
  };

  return (
    <div className="circuit-bg flex min-h-screen items-center justify-center px-5 py-16">
      <div className="glass-panel w-full max-w-md p-7">
        <div className="icon-3d mb-5">
          <Lock className="size-5" />
        </div>
        <h1 className="section-title !text-2xl">لوحة إدارة تكنيك</h1>
        <p className="mt-2 text-sm text-muted-foreground">دخول خاص بالمشرف فقط — لا يمكن إنشاء حسابات جديدة.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {message ? <p className="text-sm font-semibold text-destructive">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-5 flex justify-end text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">العودة للموقع</Link>
        </div>
      </div>
    </div>
  );
}
