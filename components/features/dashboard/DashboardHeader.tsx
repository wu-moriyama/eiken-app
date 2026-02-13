import { ReactNode } from "react";
import { PRESET_AVATARS } from "@/lib/constants/avatars";

interface DashboardHeaderProps {
  userName?: string;
  targetLevel?: string;
  avatarUrl?: string | null;
  avatarStyle?: string | null;
  todayStudyMinutes?: number;
  streakDays?: number;
  rightSlot?: ReactNode;
}

export function DashboardHeader({
  userName = "ゲスト",
  targetLevel = "英検2級",
  avatarUrl = null,
  avatarStyle = null,
  todayStudyMinutes = 0,
  streakDays = 0,
  rightSlot
}: DashboardHeaderProps) {
  const today = new Date();
  const todayLabel = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short"
  });

  const preset = avatarStyle
    ? PRESET_AVATARS.find((a) => a.id === avatarStyle)
    : null;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-base font-semibold text-slate-700">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : preset ? (
            <span className={`text-xl ${preset.bg} ${preset.fg} flex h-full w-full items-center justify-center`}>
              {preset.emoji}
            </span>
          ) : userName ? (
            userName[0]?.toUpperCase()
          ) : (
            "A"
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">{todayLabel}</p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            こんにちは、{userName} さん
          </h1>
          <p className="text-sm text-slate-600">
            今日は <span className="font-semibold">{targetLevel}</span> に向けて、
            小さな一歩を積み重ねましょう。
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            連続学習日数
          </p>
          <p className="text-xl font-semibold text-emerald-600">
            {streakDays} 日
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            今日の学習時間
          </p>
          <p className="text-xl font-semibold text-blue-600">
            {todayStudyMinutes} 分
          </p>
        </div>
        {rightSlot}
      </div>
    </div>
  );
}

