"use client";

import Link from "next/link";
import { DashboardMockup } from "./DashboardMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:py-20 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* 左：キャッチコピー + CTA */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
            英検5級〜1級 / AI添削対応
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            英検対策を、
            <span className="block text-blue-600">ひとつに。</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            単語・ライティング・スピーキング・リスニング・リーディング。
            AI添削と学習履歴で、次にやるべきことを自動提案。
            続けやすく、効率よく合格へ。
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              無料で会員登録
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              ログイン
            </Link>
          </div>
        </div>

        {/* 右：ゲスト画面モックアップ */}
        <div className="flex-1">
          <div className="mx-auto max-w-sm lg:max-w-md">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
