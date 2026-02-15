"use client";

import Image from "next/image";
import { MODULE_COLORS, type ModuleKey } from "@/lib/constants/module-colors";

/** LP用：ダッシュボード風のプレビューモックアップ */
export function DashboardMockup() {
  const modules: { key: ModuleKey; title: string; badge: string }[] = [
    { key: "vocabulary", title: "単語学習", badge: "毎日の基本" },
    { key: "writing", title: "ライティング", badge: "AI 添削" },
    { key: "reading", title: "リーディング", badge: "長文対策" }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
      {/* 簡易ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2">
        <Image
          src="/logo-aiken.png"
          alt="AiKen"
          width={80}
          height={24}
          className="h-6 w-auto"
        />
      </div>

      <div className="space-y-3 p-4">
        {/* 挨拶エリア */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div>
            <p className="text-xs font-semibold text-slate-800">こんにちは、ゲスト さん</p>
            <p className="text-[10px] text-slate-500">今日は英検2級に向けて、小さな一歩を。</p>
          </div>
        </div>

        {/* 今日のおすすめ */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
          <p className="mb-2 text-[10px] font-semibold text-slate-500">今日のおすすめ学習</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 rounded-lg border-l-4 border-[#F99F66] border-slate-200 bg-white px-2 py-1.5 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F99F66]" />
              <span>単語クイズ</span>
              <span className="ml-auto text-slate-400">約1分</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border-l-4 border-[#A6D472] border-slate-200 bg-white px-2 py-1.5 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A6D472]" />
              <span>ライティング</span>
              <span className="ml-auto text-slate-400">約15分</span>
            </div>
          </div>
        </div>

        {/* モジュールカード */}
        <div className="grid grid-cols-3 gap-2">
          {modules.map((m) => {
            const colors = MODULE_COLORS[m.key];
            return (
              <div
                key={m.key}
                className={`rounded-lg border-l-4 border border-slate-200 bg-white p-2 ${colors.borderLeft}`}
              >
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-medium ${colors.badge}`}
                >
                  {m.badge}
                </span>
                <p className="mt-1 text-[10px] font-semibold text-slate-800">{m.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
