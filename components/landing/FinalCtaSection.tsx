"use client";

import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="border-t border-slate-100 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          英検対策、今日からはじめよう
        </h2>
        <p className="mt-3 text-slate-600">
          無料で会員登録。すぐに学習をスタートできます。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[#50c2cb] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[#50c2cb]/25 transition hover:bg-[#46adb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#50c2cb]/60 focus-visible:ring-offset-2"
          >
            無料で会員登録
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-10 py-4 text-lg font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
          >
            ログイン
          </Link>
        </div>
      </div>
    </section>
  );
}
