"use client";

import { DashboardHeader } from "@/components/features/dashboard/DashboardHeader";
import { TodayPlanCard } from "@/components/features/dashboard/TodayPlanCard";
import { StatsGrid } from "@/components/features/dashboard/StatsGrid";
import { LearningModulesGrid } from "@/components/features/dashboard/LearningModulesGrid";

interface DashboardPreviewProps {
  backgroundImageUrl: string | null;
}

/** 管理画面用: 背景設定のプレビュー表示 */
export function DashboardPreview({ backgroundImageUrl }: DashboardPreviewProps) {
  const bgStyle = backgroundImageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.75) 100%), url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    : undefined;

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-700 bg-slate-50 shadow-xl"
      style={bgStyle}
    >
      <div className="min-h-[400px] px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <DashboardHeader
            userName="プレビュー"
            targetLevel="英検2級"
            todayStudyMinutes={15}
            streakDays={7}
          />
          <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm backdrop-blur-sm">
            <span className="text-slate-600">
              現在の目標級：
              <span className="font-semibold text-slate-900">英検2級</span>
            </span>
          </div>
          <TodayPlanCard
            targetLevel="英検2級"
            activityCounts={{ vocabulary_quiz: 2, writing: 0 }}
          />
          <StatsGrid
            targetLevel="英検2級"
            vocabProficiency={{ percentage: 45, mastered: 90, total: 200 }}
            writingCount={3}
          />
          <LearningModulesGrid targetLevel="英検2級" />
        </div>
      </div>
    </div>
  );
}
