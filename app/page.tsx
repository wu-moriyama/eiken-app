"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
              英検5級〜1級 / 単語・ライティング・スピーキング・リスニング・リーディング対応
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              英検対策オールインワン
              <span className="block text-xl sm:text-2xl font-normal text-slate-700 mt-1">
                日々の学習を、計画的に・続けやすく。
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              単語・ライティング・スピーキング・リスニング・リーディングを一つのプラットフォームで管理。
              学習履歴にあわせて、次にやるべきことを自動で提案します。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                ログインして始める
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                ダッシュボードを試す
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-800">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">
                今日のおすすめ学習
              </p>
              <ul className="space-y-1 text-[13px]">
                <li>・英検2級 単語 20問（SRS）</li>
                <li>・ライティング 1題（AI 添削）</li>
                <li>・スピーキング面接練習 10分</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 mb-1">
                  連続学習日数
                </p>
                <p className="text-2xl font-semibold text-emerald-600">7 日</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 mb-1">
                  単語習熟度
                </p>
                <p className="text-2xl font-semibold text-blue-600">68%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}