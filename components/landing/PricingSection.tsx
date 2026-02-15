"use client";

import Link from "next/link";

const STEPS = [
  { num: 1, title: "会員登録", desc: "メールアドレスで無料登録" },
  { num: 2, title: "目標級を選択", desc: "英検5級〜1級から選択" },
  { num: 3, title: "今日のおすすめから始める", desc: "単語・ライティングなど、提案に沿って学習" }
];

export function PricingSection() {
  return (
    <section className="border-t border-slate-100 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          まずは無料ではじめられます
        </h2>
        <p className="mt-3 text-slate-600">
          会員登録ですぐに使えます。クレジットカード不要。
        </p>

        <div className="mt-10 space-y-6">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#50c2cb] text-lg font-bold text-white">
                {s.num}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/signup"
          className="mt-10 inline-flex w-full max-w-sm items-center justify-center rounded-full bg-[#50c2cb] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#50c2cb]/25 transition hover:bg-[#46adb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#50c2cb]/60 focus-visible:ring-offset-2 sm:w-auto"
        >
          今すぐ無料ではじめる
        </Link>
      </div>
    </section>
  );
}
