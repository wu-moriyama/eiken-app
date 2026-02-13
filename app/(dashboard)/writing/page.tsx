"use client";

import Link from "next/link";

export default function WritingPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            ライティング
          </h1>
          <p className="text-sm text-slate-600">
            形式を選んで学習を開始しましょう。英検3級のライティング問題に挑戦できます。
          </p>

          <div className="grid gap-4">
            <Link
              href="/writing/essay"
              className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
            >
              <span className="text-sm font-medium text-slate-900">
                英作文
              </span>
              <span className="text-xs text-slate-600">
                Yes/Noで答え、理由を2つ述べます。25〜35語程度。
              </span>
            </Link>

            <Link
              href="/writing/email"
              className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
            >
              <span className="text-sm font-medium text-slate-900">
                Eメール
              </span>
              <span className="text-xs text-slate-600">
                友達からのメールへの返信を書きます。15〜25語程度。
              </span>
            </Link>
          </div>

          <div className="flex justify-center pt-2">
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
