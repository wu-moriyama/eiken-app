"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfileTargetLevel, profileLevelToVocabularyLevel } from "@/lib/data/vocabulary-db";

const WRITING_LEVELS = ["3級", "準2級", "2級", "準1級", "1級"] as const;
type WritingLevel = (typeof WRITING_LEVELS)[number];

const LEVEL_INFO: Record<WritingLevel, { wordRange: string; desc: string }> = {
  "3級": { wordRange: "25〜35語", desc: "QUESTIONについて考えと理由を2つ述べます。" },
  "準2級": { wordRange: "50〜60語", desc: "QUESTIONについて意見と理由を2つ述べます。" },
  "2級": { wordRange: "80〜100語", desc: "TOPICについて意見と理由を2つ述べます。POINTSを参考に。" },
  "準1級": { wordRange: "120〜150語", desc: "POINTSから2つ選び、序論・本論・結論でエッセイを書きます。" },
  "1級": { wordRange: "200〜240語", desc: "意見と理由を3つ述べます。序論・本論・結論。" },
};

function isValidWritingLevel(s: string): s is WritingLevel {
  return WRITING_LEVELS.includes(s as WritingLevel);
}

export default function WritingPage() {
  const [selectedLevel, setSelectedLevel] = useState<WritingLevel>("3級");
  const [levelLoaded, setLevelLoaded] = useState(false);

  useEffect(() => {
    getProfileTargetLevel().then((targetLevel) => {
      setLevelLoaded(true);
      if (!targetLevel) return;
      const profileLevel = profileLevelToVocabularyLevel(targetLevel);
      if (isValidWritingLevel(profileLevel)) {
        setSelectedLevel(profileLevel);
      }
    });
  }, []);

  const info = LEVEL_INFO[selectedLevel];

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">
              ライティング
            </h1>
            <Link
              href="/writing/history"
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
            >
              履歴を見る
            </Link>
          </div>
          <p className="text-sm text-slate-600">
            級と形式を選んで学習を開始しましょう。目標級がプロフィールから自動で選ばれます。
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              級
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as WritingLevel)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {WRITING_LEVELS.map((l) => (
                <option key={l} value={l}>
                  英検{l}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500">英作文</p>
            <Link
              href={`/writing/essay?level=${selectedLevel}`}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
            >
              <span className="text-sm font-medium text-slate-900">
                英作文（{selectedLevel}）
              </span>
              <span className="text-xs text-slate-600">
                {info.desc} {info.wordRange}程度。
              </span>
            </Link>

            {(selectedLevel === "3級" || selectedLevel === "準2級") && (
              <>
                <p className="pt-2 text-xs font-medium text-slate-500">Eメール</p>
                <Link
                  href={`/writing/email?level=${selectedLevel}`}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="text-sm font-medium text-slate-900">
                    Eメール（{selectedLevel}）
                  </span>
                  <span className="text-xs text-slate-600">
                    {selectedLevel === "3級"
                      ? "友達の2つの質問に答える返信を書きます。15〜25語程度。"
                      : "質問への返信＋下線部への質問2つを書きます。40〜50語程度。"}
                  </span>
                </Link>
              </>
            )}

            <p className="pt-4 text-xs font-medium text-slate-500">履歴</p>
            <Link
              href="/writing/history"
              className="flex flex-col gap-2 rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-sm font-medium text-slate-900">
                過去のフィードバック・履歴を見る
              </span>
              <span className="text-xs text-slate-600">
                添削結果やフィードバックの履歴を確認できます。
              </span>
            </Link>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/writing/history"
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
            >
              履歴を見る
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
