"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfileId } from "@/lib/data/vocabulary-db";
import {
  getWritingHistory,
  type WritingHistoryEntry
} from "@/lib/data/writing-db";
import { CorrectedTextWithHighlights } from "@/components/features/writing/CorrectedTextWithHighlights";
import { ReadAloudButton } from "@/components/features/writing/ReadAloudButton";
import { getProfileId } from "@/lib/data/vocabulary-db";
import { logReadingAloudActivity } from "@/lib/data/study-activity";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-900">
            {entry.level} {typeLabel}：{entry.title}
          </span>
          <span className="text-xs text-slate-500">
            {formatDate(entry.createdAt)} · {formatTime(entry.timeSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-blue-600">
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
        <div className="border-t border-slate-100 px-4 py-4 space-y-4 bg-slate-50/50">
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">問題</h4>
            <p className="whitespace-pre-wrap text-sm text-slate-800 rounded-lg bg-white p-3 border border-slate-100">
              {entry.prompt}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">あなたの回答</h4>
            <p className="whitespace-pre-wrap text-sm text-slate-800 rounded-lg bg-white p-3 border border-slate-100">
              {entry.content}
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="rounded-lg bg-white border border-slate-100 p-2">
              <span className="block text-sm font-semibold text-slate-900">{entry.vocabularyScore}</span>
              <span className="text-[10px] text-slate-500">語彙</span>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2">
              <span className="block text-sm font-semibold text-slate-900">{entry.grammarScore}</span>
              <span className="text-[10px] text-slate-500">文法</span>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2">
              <span className="block text-sm font-semibold text-slate-900">{entry.contentScore}</span>
              <span className="text-[10px] text-slate-500">内容</span>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2">
              <span className="block text-sm font-semibold text-slate-900">{entry.organizationScore}</span>
              <span className="text-[10px] text-slate-500">構成</span>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2">
              <span className="block text-sm font-semibold text-slate-900">{entry.instructionScore}</span>
              <span className="text-[10px] text-slate-500">指示</span>
            </div>
          </div>
          {entry.correctedText && (
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h4 className="text-xs font-medium text-slate-500">添削文</h4>
                <ReadAloudButton
                  text={entry.correctedText}
                  label="音声で聞く"
                  className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  onSpeakStart={() => {
                    getProfileId().then((pid) => {
                      if (pid) void logReadingAloudActivity(pid);
                    });
                  }}
                />
              </div>
              <p className="mb-2 text-xs text-amber-700">
                音読してみよう！正しい発音を聞いて、自分でも声に出して読むと学習効果が上がります。
              </p>
              <div className="rounded-lg bg-white p-3 border border-slate-100">
                <CorrectedTextWithHighlights text={entry.correctedText} />
              </div>
            </div>
          )}
          {entry.feedback && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-1">フィードバック</h4>
              <p className="whitespace-pre-wrap text-sm text-slate-800 rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                {entry.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WritingHistoryPage() {
  const [history, setHistory] = useState<WritingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const profileId = await getProfileId();
      if (!profileId) {
        setRequiresLogin(true);
        setLoading(false);
        return;
      }
      const h = await getWritingHistory(profileId);
      setHistory(h);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl text-center text-slate-600">
          読み込み中...
        </div>
      </main>
    );
  }

  if (requiresLogin) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">ライティング履歴</h1>
          <p className="mt-4 text-sm text-slate-600">
            履歴を表示するにはログインしてください。
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            ログイン
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">ライティング履歴</h1>
          <Link
            href="/writing"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← ライティングへ
          </Link>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          過去の提出履歴です。クリックで詳細（添削文・フィードバック）を表示できます。
        </p>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              まだライティングの履歴はありません。
            </p>
            <Link
              href="/writing"
              className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              ライティングを始める
            </Link>
          </div>
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
    </main>
  );
}
