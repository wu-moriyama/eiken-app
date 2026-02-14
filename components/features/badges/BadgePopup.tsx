"use client";

import Link from "next/link";
import type { UserBadge } from "@/lib/data/badges";

const TIER_STYLES = {
  bronze: "from-amber-700 to-amber-900 border-amber-600/50",
  silver: "from-slate-400 to-slate-600 border-slate-300/50",
  gold: "from-amber-400 to-amber-600 border-amber-300/50"
};

const TIER_LABELS = {
  bronze: "銅",
  silver: "銀",
  gold: "金"
};

interface BadgePopupProps {
  badge: UserBadge;
  onClose: () => void;
}

export function BadgePopup({ badge, onClose }: BadgePopupProps) {
  const def = badge.def;
  if (!def) return null;

  const tierStyle = TIER_STYLES[def.tier] ?? TIER_STYLES.bronze;
  const tierLabel = TIER_LABELS[def.tier] ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold text-emerald-600">
            バッヂ獲得！
          </p>
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${tierStyle} border-2 shadow-lg`}
          >
            <span className="text-2xl font-bold text-white">{tierLabel}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{def.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{def.description}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => void onClose()}
              className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              OK
            </button>
            <Link
              href="/badges"
              onClick={() => void onClose()}
              className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              バッヂ一覧
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
