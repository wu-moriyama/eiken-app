"use client";

import { MODULE_COLORS, type ModuleKey } from "@/lib/constants/module-colors";

const BENEFITS = [
  {
    key: "vocabulary" as ModuleKey,
    title: "単語 × SRS",
    desc: "忘れそうなタイミングで復習。効率よく暗記できます。",
    icon: "📚"
  },
  {
    key: "writing" as ModuleKey,
    title: "ライティング × AI添削",
    desc: "24時間いつでも添削。文法・構成・語彙のフィードバックでブラッシュアップ。",
    icon: "✏️"
  },
  {
    key: "reading" as ModuleKey,
    title: "学習履歴・提案",
    desc: "次にやるべきことを自動提案。迷わず続けられます。",
    icon: "🎯"
  },
  {
    key: "listening" as ModuleKey,
    title: "全級・全技能",
    desc: "単語・リーディング・リスニング・スピーキングをひとつのアプリで対策。",
    icon: "📱"
  },
  {
    key: "speaking" as ModuleKey,
    title: "試験日カウントダウン",
    desc: "目標の受験日まであと何日。計画を立てて直前まで走り抜けられます。",
    icon: "📅"
  }
];

export function BenefitSection() {
  return (
    <section className="border-t border-slate-100 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          こんなことができます
        </h2>
        <p className="mt-3 text-center text-slate-600">
          単語から面接まで、英検対策に必要なものをひとつに。
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const colors = MODULE_COLORS[b.key];
            return (
              <div
                key={b.key}
                className={`rounded-2xl border-l-4 border border-slate-200 bg-slate-50/50 p-6 ${colors.borderLeft}`}
              >
                <span className="text-2xl" aria-hidden>
                  {b.icon}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
