"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProfileId } from "@/lib/data/vocabulary-db";
import {
  getUserBadges,
  BADGE_DEFINITIONS,
  BADGE_TIER_IMAGES,
  type UserBadge
} from "@/lib/data/badges";

export default function BadgesPage() {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const profileId = await getProfileId();
      if (!profileId) {
        setRequiresLogin(true);
        setLoading(false);
        return;
      }
      const badges = await getUserBadges(profileId);
      setUserBadges(badges);
      setLoading(false);
    };
    load();
  }, []);

  const earnedKeys = new Set(userBadges.map((b) => b.badgeKey));
  const earnedAtMap = new Map(
    userBadges.map((b) => [b.badgeKey, b.earnedAt])
  );

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl text-center text-slate-600">
          読み込み中...
        </div>
      </main>
    );
  }

  if (requiresLogin) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">バッヂ</h1>
          <p className="mt-4 text-sm text-slate-600">
            バッヂを表示するにはログインしてください。
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-[#50c2cb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#46adb5]"
          >
            ログイン
          </Link>
        </div>
      </main>
    );
  }

  const earnedCount = earnedKeys.size;
  const totalCount = BADGE_DEFINITIONS.length;

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">バッヂ</h1>
            <p className="mt-1 text-sm text-slate-600">
              {earnedCount} / {totalCount} 獲得
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← ダッシュボード
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_DEFINITIONS.map((def) => {
            const earned = earnedKeys.has(def.key);
            const earnedAt = earnedAtMap.get(def.key);
            const medalSrc = BADGE_TIER_IMAGES[def.tier] ?? BADGE_TIER_IMAGES.bronze;

            return (
              <div
                key={def.key}
                className={`rounded-xl border p-4 ${
                  earned
                    ? "border-slate-200 bg-white shadow-sm"
                    : "border-slate-100 bg-slate-50/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center ${
                      earned ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <Image
                      src={medalSrc}
                      alt={def.tier}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-sm font-medium ${
                        earned ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {def.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {def.description}
                    </p>
                    {earnedAt && (
                      <p className="mt-2 text-[10px] text-slate-400">
                        獲得:{" "}
                        {new Date(earnedAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
