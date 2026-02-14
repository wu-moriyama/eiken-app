"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getProfileId,
  getQuizHistory,
  getWrongWordStats,
  type QuizHistoryEntry,
  type WrongWordStats
} from "@/lib/data/vocabulary-db";
import { ReadAloudButton } from "@/components/features/writing/ReadAloudButton";
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

export default function VocabularyHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [wrongStats, setWrongStats] = useState<WrongWordStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [tab, setTab] = useState<"history" | "wrong">("wrong");

  useEffect(() => {
    const load = async () => {
      const profileId = await getProfileId();
      if (!profileId) {
        setRequiresLogin(true);
        setLoading(false);
        return;
      }
      const [h, w] = await Promise.all([
        getQuizHistory(profileId),
        getWrongWordStats(profileId)
      ]);
      setHistory(h);
      setWrongStats(w);
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
          <h1 className="text-xl font-semibold text-slate-900">クイズ履歴</h1>
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
          <h1 className="text-xl font-semibold text-slate-900">クイズ履歴</h1>
          <Link
            href="/vocabulary"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← 単語クイズへ
          </Link>
        </div>

        <div className="mb-4 flex gap-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab("wrong")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              tab === "wrong"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            間違えた単語 ({wrongStats.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              tab === "history"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            解答履歴
          </button>
        </div>

        {tab === "wrong" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-slate-600">
              間違えた回数が多い順に表示しています。これらの単語は次回のクイズで優先して出題されます。
            </p>
            {wrongStats.length === 0 ? (
              <p className="text-sm text-slate-500">
                まだ間違えた単語はありません。クイズに挑戦してみましょう。
              </p>
            ) : (
              <ul className="space-y-3">
                {wrongStats.map((s) => (
                  <li
                    key={s.vocabularyId}
                    className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium text-slate-900">{s.word}</span>
                        <span className="ml-2 text-xs text-slate-500">
                          英検{s.level}
                        </span>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {s.meaningJa}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        {s.wrongCount}回
                      </span>
                    </div>
                    {s.exampleEn && (
                      <div className="mt-1 border-t border-slate-200 pt-2">
                        <p className="mb-1 text-xs text-amber-700">
                          例文を音読してみよう！
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <ReadAloudButton
                            text={s.exampleEn}
                            label="例文を聞く"
                            className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            onSpeakStart={() => {
                              getProfileId().then((pid) => {
                                if (pid) void logReadingAloudActivity(pid);
                              });
                            }}
                          />
                          <span className="text-sm text-slate-600">{s.exampleEn}</span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-slate-600">
              直近の解答履歴です。
            </p>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500">
                まだ解答履歴はありません。
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-100 px-4 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{e.word}</span>
                      <span
                        className={
                          e.isCorrect
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      >
                        {e.isCorrect ? "正解" : "不正解"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(e.createdAt)}
                      </span>
                    </div>
                    {e.exampleEn && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                        <ReadAloudButton
                          text={e.exampleEn}
                          label="例文を聞く"
                          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          onSpeakStart={() => {
                            getProfileId().then((pid) => {
                              if (pid) void logReadingAloudActivity(pid);
                            });
                          }}
                        />
                        <span className="text-sm text-slate-600">{e.exampleEn}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
