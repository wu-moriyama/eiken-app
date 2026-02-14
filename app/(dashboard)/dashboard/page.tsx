 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/features/dashboard/DashboardHeader";
import { TodayPlanCard } from "@/components/features/dashboard/TodayPlanCard";
import { StatsGrid } from "@/components/features/dashboard/StatsGrid";
import { LearningModulesGrid } from "@/components/features/dashboard/LearningModulesGrid";
import { BadgePopup } from "@/components/features/badges/BadgePopup";
import { supabase } from "@/lib/supabase/client";
import {
  getProfileId,
  getVocabularyProficiency,
  getVocabularyQuizSessionCount
} from "@/lib/data/vocabulary-db";
import {
  getTodayStudySeconds,
  getStreak,
  getModuleActivityCounts,
  getTotalStudySeconds
} from "@/lib/data/study-activity";
import {
  getWritingSubmissionCount,
  getTotalWritingCount
} from "@/lib/data/writing-db";
import {
  checkAndEarnBadges,
  getUnshownBadge,
  markBadgePopupShown,
  getBadgeDef,
  type UserBadge
} from "@/lib/data/badges";

interface ProfileState {
  display_name: string | null;
  target_level: string | null;
  avatar_url: string | null;
  avatar_style: string | null;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [vocabProficiency, setVocabProficiency] = useState<{
    percentage: number;
    mastered: number;
    total: number;
  } | null>(null);
  const [activityCounts, setActivityCounts] = useState<
    Record<string, number>
  >({});
  const [writingCount, setWritingCount] = useState<number | null>(null);
  const [badgePopup, setBadgePopup] = useState<UserBadge | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_profiles")
        .select("display_name, target_level, avatar_url, avatar_style")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          display_name: data.display_name,
          target_level: data.target_level,
          avatar_url: data.avatar_url,
          avatar_style: data.avatar_style
        });
      }
    };

    void loadProfile();
  }, []);

  const handleBadgePopupClose = async () => {
    const profileId = await getProfileId();
    if (!profileId || !badgePopup) {
      setBadgePopup(null);
      return;
    }
    await markBadgePopupShown(profileId, badgePopup.badgeKey);
    const next = await getUnshownBadge(profileId);
    setBadgePopup(next);
  };

  const loadStats = async () => {
    const profileId = await getProfileId();
    if (!profileId) return;

    const targetLevel = profile?.target_level ?? null;
    const [
      seconds,
      streak,
      proficiency,
      counts,
      wCount,
      vocabSessions,
      totalWriting,
      totalStudySecs
    ] = await Promise.all([
      getTodayStudySeconds(profileId),
      getStreak(profileId),
      getVocabularyProficiency(profileId, targetLevel),
      getModuleActivityCounts(profileId),
      getWritingSubmissionCount(profileId, targetLevel, 7),
      getVocabularyQuizSessionCount(profileId),
      getTotalWritingCount(profileId),
      getTotalStudySeconds(profileId)
    ]);
    setTodayStudyMinutes(Math.round(seconds / 60));
    setStreakDays(streak.current);
    setVocabProficiency(proficiency);
    setActivityCounts(counts);
    setWritingCount(wCount);

    const newlyEarned = await checkAndEarnBadges(profileId, {
      vocabQuizCount: vocabSessions,
      writingCount: totalWriting,
      totalStudySeconds: totalStudySecs,
      currentStreak: streak.current,
      hasStudied: totalStudySecs > 0
    });
    if (newlyEarned.length > 0) {
      const first = getBadgeDef(newlyEarned[0]);
      if (first) {
        setBadgePopup({
          badgeKey: newlyEarned[0],
          earnedAt: new Date().toISOString(),
          popupShown: false,
          def: first
        });
      }
    } else {
      const unshown = await getUnshownBadge(profileId);
      if (unshown) setBadgePopup(unshown);
    }
  };

  useEffect(() => {
    void loadStats();
  }, [profile?.target_level]);

  // タブに戻ったとき・ページ復元時にも再取得（クイズ・ライティング完了後など）
  useEffect(() => {
    const onFocus = () => void loadStats();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) void loadStats(); // bfcache からの復元時
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  const userName = profile?.display_name ?? "ゲスト";
  const targetLevel = profile?.target_level ?? "英検2級";
  const avatarUrl = profile?.avatar_url ?? null;
  const avatarStyle = profile?.avatar_style ?? null;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <DashboardHeader
          userName={userName}
          targetLevel={targetLevel}
          avatarUrl={avatarUrl}
          avatarStyle={avatarStyle}
          todayStudyMinutes={todayStudyMinutes}
          streakDays={streakDays}
          rightSlot={
            <Link
              href="/profile"
              className="hidden md:inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              プロフィールを編集
            </Link>
          }
        />
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <span className="text-slate-600">
            現在の目標級：
            <span className="font-semibold text-slate-900">
              {targetLevel || "未設定"}
            </span>
          </span>
          <Link
            href="/profile"
            className="text-blue-600 hover:text-blue-500 hover:underline"
          >
            目標を変更 →
          </Link>
        </div>
        <TodayPlanCard
          targetLevel={targetLevel}
          activityCounts={activityCounts}
        />
        <StatsGrid
          targetLevel={targetLevel}
          vocabProficiency={vocabProficiency}
          writingCount={writingCount}
        />
        <LearningModulesGrid targetLevel={targetLevel} />
      </div>

      {badgePopup && (
        <BadgePopup badge={badgePopup} onClose={handleBadgePopupClose} />
      )}
    </main>
  );
}

