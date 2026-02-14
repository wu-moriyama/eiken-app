"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getWritingHistory,
  type WritingHistoryEntry
} from "@/lib/data/writing-db";
import { adminGetUserProfile } from "@/lib/data/admin-db";
import { CorrectedTextWithHighlights } from "@/components/features/writing/CorrectedTextWithHighlights";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function HistoryCard({
  entry,
  expanded,
  onToggle
}: {
  entry: WritingHistoryEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const typeLabel = entry.promptType === "email" ? "Eメール" : "英作文";
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-200">
            {entry.level} {typeLabel}：{entry.title}
          </span>
          <span className="text-xs text-slate-500">
            {formatDate(entry.createdAt)} · {formatTime(entry.timeSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-brand-400">
            {entry.overallScore.toFixed(1)}
          </span>
          <svg
            className={`h-5 w-5 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-slate-700 px-4 py-4 space-y-4 bg-slate-800/30">
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">問題</h4>
            <p className="whitespace-pre-wrap text-sm text-slate-200 rounded-lg bg-slate-900/50 p-3 border border-slate-700">
              {entry.prompt}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">回答</h4>
            <p className="whitespace-pre-wrap text-sm text-slate-200 rounded-lg bg-slate-900/50 p-3 border border-slate-700">
              {entry.content}
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
              <span className="block text-sm font-semibold text-slate-200">{entry.vocabularyScore}</span>
              <span className="text-[10px] text-slate-500">語彙</span>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
              <span className="block text-sm font-semibold text-slate-200">{entry.grammarScore}</span>
              <span className="text-[10px] text-slate-500">文法</span>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
              <span className="block text-sm font-semibold text-slate-200">{entry.contentScore}</span>
              <span className="text-[10px] text-slate-500">内容</span>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
              <span className="block text-sm font-semibold text-slate-200">{entry.organizationScore}</span>
              <span className="text-[10px] text-slate-500">構成</span>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
              <span className="block text-sm font-semibold text-slate-200">{entry.instructionScore}</span>
              <span className="text-[10px] text-slate-500">指示</span>
            </div>
          </div>
          {entry.correctedText && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-1">添削文</h4>
              <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700">
                <CorrectedTextWithHighlights text={entry.correctedText} variant="dark" />
              </div>
            </div>
          )}
          {entry.feedback && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-1">フィードバック</h4>
              <p className="whitespace-pre-wrap text-sm text-slate-200 rounded-lg bg-slate-900/50 p-3 border border-slate-700">
                {entry.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminWritingHistoryPage() {
  const params = useParams();
  const profileId = params.id as string;

  const [history, setHistory] = useState<WritingHistoryEntry[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, profile] = await Promise.all([
          getWritingHistory(profileId, 100),
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
        ライティング履歴
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        {userName ? `${userName} さん` : "ユーザー"}のライティング提出履歴（最新100件）
      </p>

      {history.length === 0 ? (
        <p className="rounded-lg border border-slate-700 bg-slate-800/30 px-4 py-8 text-center text-slate-500">
          ライティングの履歴はありません
        </p>
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => (
            <li key={entry.id}>
              <HistoryCard
                entry={entry}
                expanded={expandedId === entry.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === entry.id ? null : entry.id))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
