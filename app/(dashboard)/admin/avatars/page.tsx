"use client";

import { useEffect, useState, useRef } from "react";
import {
  adminGetAvatarPresets,
  adminCreateAvatarPreset,
  adminDeleteAvatarPreset,
  type AvatarPresetRow
} from "@/lib/data/admin-db";
import { supabase } from "@/lib/supabase/client";

export default function AdminAvatarsPage() {
  const [presets, setPresets] = useState<AvatarPresetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const rows = await adminGetAvatarPresets();
      setPresets(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const name = newName.trim() || file.name.replace(/\.[^.]+$/, "");
    if (!name) {
      setError("名前を入力してください");
      return;
    }

    setError(null);
    setMessage(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const id = crypto.randomUUID();
      const path = `presets/${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await adminCreateAvatarPreset(name, data.publicUrl);
      setNewName("");
      await load();
      setMessage(`アバター「${name}」を登録しました`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? "アップロードに失敗しました";
      setError(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    setError(null);
    setMessage(null);
    try {
      await adminDeleteAvatarPreset(id);
      await load();
      setMessage("削除しました");
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">アバター設定</h1>
      <p className="text-sm text-slate-400">
        ユーザーがプロフィールで選択できるアバター画像を登録できます。画像をアップロードしてください。
      </p>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-300">新規登録</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">名前</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例: ネコ、犬、ウサギ"
              className="w-48 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {uploading ? "アップロード中..." : "画像を選択して登録"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-300">登録済みアバター</h2>
        {presets.length === 0 ? (
          <p className="text-sm text-slate-500">まだ登録されていません</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {presets.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
              >
                <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-600 bg-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-slate-200">{p.name}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

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
