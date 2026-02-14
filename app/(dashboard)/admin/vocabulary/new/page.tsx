"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCreateVocabulary } from "@/lib/data/admin-db";

const LEVELS = ["5級", "4級", "3級", "準2級", "2級", "準1級", "1級"];

export default function AdminVocabularyNewPage() {
  const router = useRouter();
  const [level, setLevel] = useState("2級");
  const [word, setWord] = useState("");
  const [meaningJa, setMeaningJa] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [category, setCategory] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [exampleEn, setExampleEn] = useState("");
  const [exampleJa, setExampleJa] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await adminCreateVocabulary({
        level,
        word: word.trim(),
        meaning_ja: meaningJa.trim(),
        part_of_speech: partOfSpeech.trim() || null,
        category: category.trim() || null,
        pronunciation: pronunciation.trim() || null,
        example_en: exampleEn.trim() || null,
        example_ja: exampleJa.trim() || null
      });
      router.push("/admin/vocabulary");
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
          href="/admin/vocabulary"
          className="text-sm text-slate-400 hover:text-brand-300"
        >
          ← 単語一覧
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-slate-100">単語を登録</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
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
          <label className="mb-1 block text-xs font-medium text-slate-400">単語 *</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: accept"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">意味（日本語）*</label>
          <input
            type="text"
            value={meaningJa}
            onChange={(e) => setMeaningJa(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: 受け入れる・承認する"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">品詞</label>
            <input
              type="text"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 動詞"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">カテゴリ</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
              placeholder="例: 日常・基本"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">発音</label>
          <input
            type="text"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: /əkˈsɛpt/"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">例文（英語）</label>
          <input
            type="text"
            value={exampleEn}
            onChange={(e) => setExampleEn(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: I accept your invitation."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">例文（日本語）</label>
          <input
            type="text"
            value={exampleJa}
            onChange={(e) => setExampleJa(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-brand-500"
            placeholder="例: 私はあなたの招待を受け入れます。"
          />
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
            href="/admin/vocabulary"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
