"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuizHistory, type QuizHistoryEntry } from "@/lib/data/vocabulary-db";
import { adminGetUserProfile } from "@/lib/data/admin-db";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminVocabularyHistoryPage() {
  const params = useParams();
  const profileId = params.id as string;

  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, profile] = await Promise.all([
          getQuizHistory(profileId, 200),
          adminGetUserProfile(profileId)
        ]);
        setHistory(h);
        setUserName(profile?.display_name ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [profileId]);

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="mb-4 rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 text-red-300">
          {error}
        </p>
        <Link href="/admin/users" className="text-brand-400 hover:underline">
          ← ユーザー一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/users"
          className="text-sm text-slate-400 hover:text-brand-300"
        >
          ← ユーザー一覧
        </Link>
      </div>
      <h1 className="mb-2 text-xl font-semibold text-slate-100">
        単語クイズ履歴
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        {userName ? `${userName} さん` : "ユーザー"}の単語クイズ履歴（最新200件）
      </p>

      {history.length === 0 ? (
        <p className="rounded-lg border border-slate-700 bg-slate-800/30 px-4 py-8 text-center text-slate-500">
          単語クイズの履歴はありません
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-300">日時</th>
                <th className="px-4 py-3 font-medium text-slate-300">単語</th>
                <th className="px-4 py-3 font-medium text-slate-300">意味</th>
                <th className="px-4 py-3 font-medium text-slate-300">級</th>
                <th className="px-4 py-3 font-medium text-slate-300">正誤</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-800 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {entry.word}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{entry.meaningJa}</td>
                  <td className="px-4 py-3 text-slate-400">{entry.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        entry.isCorrect
                          ? "bg-emerald-900/50 text-emerald-300"
                          : "bg-red-900/50 text-red-300"
                      }`}
                    >
                      {entry.isCorrect ? "正解" : "不正解"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
