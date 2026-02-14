"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  adminGetMonthlyBackgrounds,
  adminUpsertMonthlyBackground
} from "@/lib/data/admin-db";
import { supabase } from "@/lib/supabase/client";
import { DashboardPreview } from "@/components/features/admin/DashboardPreview";

const MONTH_LABELS: Record<number, string> = {
  1: "1月",
  2: "2月",
  3: "3月",
  4: "4月",
  5: "5月",
  6: "6月",
  7: "7月",
  8: "8月",
  9: "9月",
  10: "10月",
  11: "11月",
  12: "12月"
};

export default function AdminBackgroundsPage() {
  const [backgrounds, setBackgrounds] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMonth, setPreviewMonth] = useState<number>(() => new Date().getMonth() + 1);

  const load = useCallback(async () => {
    try {
      const rows = await adminGetMonthlyBackgrounds();
      const map: Record<number, string> = {};
      for (const r of rows) {
        map[r.month] = r.image_url ?? "";
      }
      setBackgrounds(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async (month: number, url: string) => {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await adminUpsertMonthlyBackground(month, url.trim() || null);
      setBackgrounds((prev) => ({ ...prev, [month]: url }));
      setMessage(`${MONTH_LABELS[month]}の背景を保存しました`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = backgrounds[previewMonth]?.trim() || null;

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">背景設定</h1>
      <p className="text-sm text-slate-400">
        1月〜12月のダッシュボード背景画像を設定できます。画像をアップロードするか、URLを入力してください。
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr,minmax(360px,480px)]">
        {/* フォーム */}
        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-sm font-medium text-slate-300">
            月別背景画像URL
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <MonthBackgroundForm
                key={month}
                month={month}
                label={MONTH_LABELS[month]}
                value={backgrounds[month] ?? ""}
                onSave={(url) => handleSave(month, url)}
                saving={saving}
                onPreview={() => setPreviewMonth(month)}
                onUploadSuccess={(url) => {
                  setBackgrounds((prev) => ({ ...prev, [month]: url }));
                  setPreviewMonth(month);
                }}
                onUploadError={(err) => {
                  setError(err?.message ?? "アップロードに失敗しました");
                }}
              />
            ))}
          </div>
        </section>

        {/* プレビュー */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">
              ダッシュボードプレビュー
            </h2>
            <select
              value={previewMonth}
              onChange={(e) => setPreviewMonth(Number(e.target.value))}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  {MONTH_LABELS[m]}
                </option>
              ))}
            </select>
          </div>
          <DashboardPreview backgroundImageUrl={previewUrl} />
        </section>
      </div>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-emerald-900/30 px-4 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}
    </div>
  );
}

function MonthBackgroundForm({
  month,
  label,
  value,
  onSave,
  saving,
  onPreview,
  onUploadSuccess,
  onUploadError
}: {
  month: number;
  label: string;
  value: string;
  onSave: (url: string) => Promise<void>;
  saving: boolean;
  onPreview: () => void;
  onUploadSuccess: (url: string) => void;
  onUploadError: (err: Error | null) => void;
}) {
  const [url, setUrl] = useState(value);
  const [localSaving, setLocalSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSaving(true);
    try {
      await onSave(url);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `month-${month}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("backgrounds")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("backgrounds").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      setUrl(publicUrl);
      await onSave(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "アップロードに失敗しました";
      onUploadError(new Error(msg));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 sm:flex-row sm:items-center"
    >
      <span className="w-10 shrink-0 text-sm font-medium text-slate-400">
        {label}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://... またはアップロード"
        className="min-w-0 flex-1 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || saving}
          className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-60"
        >
          {uploading ? "アップロード中..." : "アップロード"}
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
        >
          プレビュー
        </button>
        <button
          type="submit"
          disabled={saving || localSaving}
          className="rounded bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-500 disabled:opacity-60"
        >
          {localSaving || saving ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
