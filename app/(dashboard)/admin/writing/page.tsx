"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  adminGetWritingPrompts,
  adminDeleteWritingPrompt,
  type WritingPromptItem
} from "@/lib/data/admin-db";

const PER_PAGE = 50;
const LEVELS = ["3級", "準2級", "2級", "準1級", "1級"];
const PROMPT_TYPES = [
  { value: "", label: "すべて" },
  { value: "essay", label: "英作文" },
  { value: "email", label: "Eメール" }
];

export default function AdminWritingPage() {
  const [items, setItems] = useState<WritingPromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    try {
      const data = await adminGetWritingPrompts();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    if (levelFilter) {
      list = list.filter((v) => v.level === levelFilter);
    }
    if (typeFilter) {
      list = list.filter((v) => v.prompt_type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((v) => {
        const title = (v.title ?? "").toLowerCase();
        const prompt = (v.prompt ?? "").toLowerCase();
        const level = (v.level ?? "").toLowerCase();
        const idStr = String(v.id);
        return (
          idStr.includes(q) ||
          title.includes(q) ||
          prompt.includes(q) ||
          level.includes(q)
        );
      });
    }
    return [...list].sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
  }, [items, searchQuery, levelFilter, typeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredItems.slice(start, start + PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, levelFilter, typeFilter, sortOrder]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    try {
      await adminDeleteWritingPrompt(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 text-red-300">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-100">
        ライティング問題管理
      </h1>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID・タイトル・問題文・級で検索"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 pl-9 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-brand-500"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500"
        >
          <option value="">級で絞り込み（すべて）</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500"
        >
          {PROMPT_TYPES.map((t) => (
            <option key={t.value || "all"} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-4">
          <p className="text-xs text-slate-500">
            {filteredItems.length} 件 / {items.length} 件
          </p>
          <Link
            href="/admin/writing/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            新規登録
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-700 bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">
                <button
                  type="button"
                  onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                  className="flex items-center gap-1 hover:text-brand-300"
                >
                  ID
                  {sortOrder === "asc" ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-slate-300">級</th>
              <th className="px-4 py-3 font-medium text-slate-300">形式</th>
              <th className="px-4 py-3 font-medium text-slate-300">タイトル</th>
              <th className="px-4 py-3 font-medium text-slate-300">語数</th>
              <th className="px-4 py-3 font-medium text-slate-300" />
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((v) => (
              <tr
                key={v.id}
                className="border-b border-slate-800 transition hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-mono text-sm text-slate-300">{v.id}</td>
                <td className="px-4 py-3 text-slate-400">{v.level}</td>
                <td className="px-4 py-3 text-slate-400">
                  {v.prompt_type === "email" ? "Eメール" : "英作文"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-200">{v.title}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {v.word_count_min != null && v.word_count_max != null
                    ? `${v.word_count_min}〜${v.word_count_max}語`
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/writing/${v.id}`}
                      className="text-brand-400 hover:text-brand-300 hover:underline"
                    >
                      編集
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(v.id, v.title)}
                      className="text-red-400 hover:text-red-300 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500">
            {((currentPage - 1) * PER_PAGE) + 1} -{" "}
            {Math.min(currentPage * PER_PAGE, filteredItems.length)} 件目を表示
          </p>
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                前へ
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2;
                })
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 text-slate-500">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-sm ${
                        p === currentPage
                          ? "bg-brand-600 text-white"
                          : "border border-slate-600 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      )}

      {filteredItems.length === 0 && (
        <p className="mt-6 text-center text-slate-500">
          {searchQuery || levelFilter || typeFilter
            ? "検索に一致する問題はありません"
            : "ライティング問題が登録されていません"}
        </p>
      )}
    </div>
  );
}
