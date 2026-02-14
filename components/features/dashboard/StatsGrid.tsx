import { MODULE_COLORS, type ModuleKey } from "@/lib/constants/module-colors";

interface StatCardProps {
  label: string;
  value: string;
  subLabel?: string;
  moduleKey?: ModuleKey;
}

interface StatsGridProps {
  targetLevel?: string | null;
  vocabProficiency?: { percentage: number; mastered: number; total: number } | null;
  writingCount?: number | null;
}

export function StatsGrid({
  targetLevel,
  vocabProficiency,
  writingCount
}: StatsGridProps) {
  const vocabValue =
    vocabProficiency != null && vocabProficiency.total > 0
      ? `${vocabProficiency.percentage}%`
      : "—";
  const vocabSub =
    vocabProficiency != null && vocabProficiency.total > 0
      ? `${targetLevel || "目標級"} · ${vocabProficiency.mastered}/${vocabProficiency.total}語`
      : vocabProficiency != null
        ? "この級の単語データはまだありません"
        : "目標級を設定すると表示";

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <StatCard
        label="単語習熟度"
        value={vocabValue}
        subLabel={vocabSub}
        moduleKey="vocabulary"
      />
      <StatCard
        label="ライティング提出数"
        value={
          writingCount != null
            ? `${writingCount}本`
            : "—"
        }
        subLabel={
          writingCount != null
            ? `${targetLevel || "目標級"} · 直近7日`
            : "目標級を設定すると表示"
        }
        moduleKey="writing"
      />
      <StatCard
        label="スピーキング練習"
        value="25分"
        subLabel="直近7日"
        moduleKey="speaking"
      />
      <StatCard
        label="リーディング正答率"
        value="72%"
        subLabel="模試ベース"
        moduleKey="reading"
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  subLabel,
  moduleKey = "vocabulary"
}: StatCardProps) {
  const colors = MODULE_COLORS[moduleKey];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}
        />
        <p className="text-[11px] font-semibold text-slate-500">{label}</p>
      </div>
      <p className={`text-xl font-semibold ${colors.text}`}>{value}</p>
      {subLabel && (
        <p className="mt-1 text-[11px] text-slate-500">{subLabel}</p>
      )}
    </div>
  );
}

