"use client";

import Link from "next/link";

interface GuestLimitPromptProps {
  type: "vocabulary" | "writing";
}

export function GuestLimitPrompt({ type }: GuestLimitPromptProps) {
  const isVocabulary = type === "vocabulary";
  const limit = isVocabulary ? 3 : 1;
  const label = isVocabulary ? "単語クイズ" : "ライティング添削";

  return (
    <div className="space-y-6 rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        ゲストの利用上限に達しました
      </h2>
      <p className="text-sm text-slate-700">
        {label}はゲストで{limit}回までお試しいただけます。
        続けて利用するには会員登録が必要です。
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="flex-1 rounded-full bg-[#50c2cb] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#46adb5]"
        >
          新規登録
        </Link>
        <Link
          href="/login"
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          サインイン
        </Link>
      </div>
      <Link
        href="/dashboard"
        className="block text-center text-sm text-slate-500 hover:text-slate-700"
      >
        ダッシュボードに戻る
      </Link>
    </div>
  );
}
