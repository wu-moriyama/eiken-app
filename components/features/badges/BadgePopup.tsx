"use client";

import Link from "next/link";
import Image from "next/image";
import type { UserBadge } from "@/lib/data/badges";
import { BADGE_TIER_IMAGES } from "@/lib/data/badges";

interface BadgePopupProps {
  badge: UserBadge;
  onClose: () => void;
}

export function BadgePopup({ badge, onClose }: BadgePopupProps) {
  const def = badge.def;
  if (!def) return null;

  const medalSrc = BADGE_TIER_IMAGES[def.tier] ?? BADGE_TIER_IMAGES.bronze;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold text-emerald-600">
            バッヂ獲得！
          </p>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <Image
              src={medalSrc}
              alt={def.tier}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{def.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{def.description}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => void onClose()}
              className="flex-1 rounded-full bg-[#50c2cb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#46adb5]"
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
