import Link from "next/link";
import { MODULE_COLORS, type ModuleKey } from "@/lib/constants/module-colors";

const MODULES = [
  {
    key: "vocabulary",
    title: "単語学習",
    description: "フラッシュカードと SRS で効率よく暗記。",
    badge: "毎日の基本",
    href: "/vocabulary"
  },
  {
    key: "writing",
    title: "ライティング",
    description: "AI 添削で文法・構成・語彙をフィードバック。",
    badge: "AI 添削",
    href: "/writing",
    hideForLevels: ["英検4級", "英検5級"]
  },
  {
    key: "speaking",
    title: "スピーキング",
    description: "面接形式のロールプレイでアウトプット練習。",
    badge: "音声入力",
    href: "/speaking",
    hideForLevels: ["英検4級", "英検5級"]
  },
  {
    key: "listening",
    title: "リスニング",
    description: "速度調整やディクテーションで耳を鍛える。",
    badge: "音声教材",
    href: "/listening"
  },
  {
    key: "reading",
    title: "リーディング",
    description: "長文読解と要約で読解力をアップ。",
    badge: "長文対策",
    href: "/reading"
  }
] as const;

interface LearningModulesGridProps {
  targetLevel?: string | null;
}

export function LearningModulesGrid({ targetLevel }: LearningModulesGridProps) {
  const modules = MODULES.filter(
    (m) =>
      !("hideForLevels" in m && m.hideForLevels?.includes(targetLevel ?? ""))
  );
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">学習モジュール</h2>
        <p className="text-[11px] text-slate-500">
          今日は 1〜2 モジュールに集中するのがおすすめです。
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {modules.map((m) => {
          const colors = MODULE_COLORS[m.key as ModuleKey];
          return (
            <article
              key={m.key}
              className={`flex flex-col justify-between rounded-2xl border-l-4 ${colors.borderLeft} border border-slate-200 bg-white p-4 text-sm shadow-sm`}
            >
              <div className="space-y-2">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-[3px] text-[10px] font-medium ${colors.badge}`}
                >
                  <span>{m.badge}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600">{m.description}</p>
              </div>
              <div className="mt-3">
                <Link
                  href={m.href}
                  className={`inline-flex items-center text-xs font-semibold ${colors.text} ${colors.textHover}`}
                >
                  開く
                  <span aria-hidden="true" className="ml-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

