"use client";

import Link from "next/link";

const ESSAY_LEVELS = [
  { level: "準2級", href: "/writing/essay?level=準2級", wordRange: "50〜60語", desc: "QUESTIONについて意見と理由を2つ述べます。" },
  { level: "2級", href: "/writing/essay?level=2級", wordRange: "80〜100語", desc: "TOPICについて意見と理由を2つ述べます。POINTSを参考に。" },
  { level: "準1級", href: "/writing/essay?level=準1級", wordRange: "120〜150語", desc: "POINTSから2つ選び、序論・本論・結論でエッセイを書きます。" },
  { level: "1級", href: "/writing/essay?level=1級", wordRange: "200〜240語", desc: "意見と理由を3つ述べます。序論・本論・結論。" },
] as const;

export default function WritingPage() {
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
            級と形式を選んで学習を開始しましょう。
          </p>

          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500">英作文</p>
            <div className="grid gap-4">
              {ESSAY_LEVELS.map(({ level, href, wordRange, desc }) => (
                <Link
                  key={level}
                  href={href}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="text-sm font-medium text-slate-900">
                    英作文（{level}）
                  </span>
                  <span className="text-xs text-slate-600">
                    {desc} {wordRange}程度。
                  </span>
                </Link>
              ))}
            </div>

            <p className="pt-2 text-xs font-medium text-slate-500">Eメール</p>
            <Link
              href="/writing/email"
              className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
            >
              <span className="text-sm font-medium text-slate-900">
                Eメール（3級）
              </span>
              <span className="text-xs text-slate-600">
                友達からのメールへの返信を書きます。15〜25語程度。
              </span>
            </Link>

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
