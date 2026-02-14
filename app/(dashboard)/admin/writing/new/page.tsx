"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCreateWritingPrompt } from "@/lib/data/admin-db";

const LEVELS = ["3級", "準2級", "2級", "準1級", "1級"];

export default function AdminWritingNewPage() {
  const router = useRouter();
  const [level, setLevel] = useState("2級");
  const [promptType, setPromptType] = useState<"essay" | "email">("essay");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [wordCountMin, setWordCountMin] = useState("");
  const [wordCountMax, setWordCountMax] = useState("");
  const [timeLimitMin, setTimeLimitMin] = useState("");
  const [timeLimitMax, setTimeLimitMax] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await adminCreateWritingPrompt({
        level,
        prompt_type: promptType,
        title: title.trim(),
        prompt: prompt.trim(),
        word_count_min: wordCountMin ? Number(wordCountMin) : null,
        word_count_max: wordCountMax ? Number(wordCountMax) : null,
        time_limit_min_seconds: timeLimitMin ? Number(timeLimitMin) : null,
        time_limit_max_seconds: timeLimitMax ? Number(timeLimitMax) : null
      });
      router.push("/admin/writing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/writing"
          className="text-sm text-slate-400 hover:text-brand-300"
        >
          ← ライティング問題一覧
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-slate-100">
        ライティング問題を登録
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">級 *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">形式 *</label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value as "essay" | "email")}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            >
              <option value="essay">英作文</option>
              <option value="email">Eメール</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">タイトル *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: 宇宙旅行について"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">問題文 *</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            rows={12}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500 font-mono text-sm"
            placeholder="TOPIC、POINTS などを入力..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">最低語数</label>
            <input
              type="number"
              min={0}
              value={wordCountMin}
              onChange={(e) => setWordCountMin(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 80"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">最高語数</label>
            <input
              type="number"
              min={0}
              value={wordCountMax}
              onChange={(e) => setWordCountMax(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 100"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">最短時間（秒）</label>
            <input
              type="number"
              min={0}
              value={timeLimitMin}
              onChange={(e) => setTimeLimitMin(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 1200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">最長時間（秒）</label>
            <input
              type="number"
              min={0}
              value={timeLimitMax}
              onChange={(e) => setTimeLimitMax(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 1500"
            />
          </div>
        </div>
        {error && (
          <p className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {saving ? "登録中..." : "登録"}
          </button>
          <Link
            href="/admin/writing"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
