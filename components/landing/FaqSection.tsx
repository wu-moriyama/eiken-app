"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "無料でどこまで使えますか？",
    a: "会員登録後、単語クイズ・ライティング（AI添削）・リーディング・リスニング・スピーキングなど、主要な機能をご利用いただけます。"
  },
  {
    q: "英検〇級には対応していますか？",
    a: "英検5級〜1級まで対応しています。目標級を設定すると、その級に合わせた単語・ライティング問題が表示されます。"
  },
  {
    q: "スマホでも使えますか？",
    a: "はい。ブラウザからアクセスできるため、スマートフォン・タブレット・PCのどれでもご利用いただけます。"
  },
  {
    q: "退会・解約はできますか？",
    a: "いつでも退会可能です。アカウント削除の手順は設定画面から行えます。"
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-slate-100 bg-slate-50/50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          よくある質問
        </h2>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50"
              >
                <span>{item.q}</span>
                <span
                  className={`shrink-0 text-slate-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === i && (
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
