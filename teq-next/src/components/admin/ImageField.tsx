"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImageIcon, Loader2, RotateCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadSiteAsset, removeSiteAssetByUrl, formatBytes } from "@/lib/site";

const MAX_MB = 5;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];

export type ImageChangeMeta = { sizeBytes: number; originalBytes: number };

type Props = {
  label: string;
  hint?: string;
  currentUrl: string | null;
  defaultUrl?: string | null;
  folder: string;
  aspect?: string;
  /** حجم الصورة الحالية بعد الضغط (بايت) إن وُجد. */
  sizeBytes?: number | null;
  /** حجم الصورة الأصلية قبل الضغط (بايت) إن وُجد. */
  originalBytes?: number | null;
  /** Called after a new image has been uploaded (or null to reset to default). */
  onChange: (url: string | null, meta?: ImageChangeMeta) => Promise<void> | void;
};

export function ImageField({ label, hint, currentUrl, defaultUrl, folder, aspect = "aspect-[4/3]", sizeBytes, originalBytes, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState<File | null>(null);

  const shown = currentUrl?.trim() || defaultUrl || "";

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم — استخدم PNG أو JPG أو WEBP أو SVG.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`حجم الصورة يجب ألا يتجاوز ${MAX_MB} ميجابايت.`);
      return;
    }
    setPending(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  };

  const cancelPending = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPending(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const save = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const asset = await uploadSiteAsset(pending, folder);
      await onChange(asset.url, { sizeBytes: asset.sizeBytes, originalBytes: asset.originalBytes });
      await removeSiteAssetByUrl(currentUrl);
      const saved = asset.originalBytes - asset.sizeBytes;
      toast.success(
        saved > 0
          ? `تم حفظ الصورة — الحجم بعد الضغط ${formatBytes(asset.sizeBytes)} (وفّرت ${formatBytes(saved)}).`
          : `تم حفظ الصورة — الحجم ${formatBytes(asset.sizeBytes)}.`,
      );
      cancelPending();
    } catch (err) {
      console.error(err);
      toast.error("تعذر رفع الصورة، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!currentUrl) return;
    if (!window.confirm("إعادة الصورة إلى الافتراضية؟")) return;
    setBusy(true);
    try {
      await onChange(null);
      await removeSiteAssetByUrl(currentUrl);
      toast.success("تمت إعادة الصورة الافتراضية.");
    } catch (err) {
      console.error(err);
      toast.error("تعذر إعادة الصورة.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-panel space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{label}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
          {sizeBytes ? (
            <p className="mt-1 text-[11px] text-muted-foreground" dir="ltr">
              {formatBytes(sizeBytes)}
              {originalBytes && originalBytes > sizeBytes ? (
                <span className="text-primary"> ← وفّر {formatBytes(originalBytes - sizeBytes)} من {formatBytes(originalBytes)}</span>
              ) : null}
            </p>
          ) : null}
        </div>
        {currentUrl ? (
          <Button type="button" size="sm" variant="ghost" onClick={reset} disabled={busy} className="gap-1 text-xs">
            <RotateCcw className="size-3.5" /> افتراضي
          </Button>
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">افتراضية</span>
        )}
      </div>

      <div className={`grid gap-3 ${preview ? "grid-cols-2" : "grid-cols-1"}`}>
        <div>
          {preview ? <p className="mb-1 text-[11px] text-muted-foreground">الحالية</p> : null}
          <div className={`${aspect} overflow-hidden rounded-xl border border-border/60 bg-muted`}>
            {shown ? (
              <img src={shown} alt={label} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageIcon className="size-6" />
              </div>
            )}
          </div>
        </div>
        {preview ? (
          <div>
            <p className="mb-1 text-[11px] text-primary">الجديدة</p>
            <div className={`${aspect} overflow-hidden rounded-xl border border-primary/60`}>
              <img src={preview} alt="معاينة" className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}
      </div>

      {preview ? (
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={save} disabled={busy} className="gap-1">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} حفظ الصورة
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={cancelPending} disabled={busy} className="gap-1">
            <Trash2 className="size-4" /> إلغاء
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-xs transition-colors ${
            dragging ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/60"
          }`}
        >
          <Upload className="size-4" /> اسحب صورة هنا أو اضغط للاختيار (حتى {MAX_MB}MB)
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}
