import Link from "next/link";

const VOCABULARY_TASK = {
  key: "vocabulary",
  title: "単語クイズ",
  detail: "10問・4択（レベル選択可）",
  duration: "約1分",
  href: "/vocabulary"
} as const;

const OPTIONAL_TASKS = [
  {
    key: "writing",
    title: "ライティング",
    detail: "自由英作文 1題",
    duration: "約15分",
    href: "/writing",
    hideForLevels: ["英検4級", "英検5級"]
  },
  {
    key: "speaking",
    title: "スピーキング面接練習",
    detail: "自己紹介 + 質問",
    duration: "約10分",
    href: "/speaking",
    hideForLevels: ["英検4級", "英検5級"]
  },
  {
    key: "listening",
    title: "リスニング",
    detail: "音声を聞いて問題に答える",
    duration: "約10分",
    href: "/listening"
  },
  {
    key: "reading",
    title: "リーディング",
    detail: "長文読解と要約",
    duration: "約15分",
    href: "/reading"
  }
] as const;

// activity_type とタスク key の対応
const ACTIVITY_TYPE_MAP: Record<string, string> = {
  vocabulary_quiz: "vocabulary",
  writing: "writing",
  speaking: "speaking",
  listening: "listening",
  reading: "reading"
};

interface TodayPlanCardProps {
  targetLevel?: string | null;
  activityCounts?: Record<string, number>;
}

export function TodayPlanCard({
  targetLevel,
  activityCounts = {}
}: TodayPlanCardProps) {
  const level = targetLevel ?? "";
  const is4or5 = ["英検4級", "英検5級"].includes(level);

  const recommendedTasks = (() => {
    const tasks = [VOCABULARY_TASK];

    if (is4or5) {
      tasks.push(
        OPTIONAL_TASKS.find((t) => t.key === "listening")!,
        OPTIONAL_TASKS.find((t) => t.key === "reading")!
      );
    } else {
      const available = OPTIONAL_TASKS.filter(
        (t) => !("hideForLevels" in t && t.hideForLevels?.includes(level))
      );
      const withCounts = available.map((t) => ({
        task: t,
        count:
          Object.entries(activityCounts).reduce((sum, [type, c]) => {
            return sum + (ACTIVITY_TYPE_MAP[type] === t.key ? c : 0);
          }, 0) ?? 0
      }));
      withCounts.sort((a, b) => a.count - b.count);
      tasks.push(withCounts[0]?.task, withCounts[1]?.task);
    }

    return tasks.filter(Boolean);
  })();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">
          今日のおすすめ学習
        </h2>
        <p className="text-xs text-slate-500">
          負荷がかかりすぎないよう、3つだけに絞っています。
        </p>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-3">
        {recommendedTasks.map((t) => (
          <TodayTask
            key={t.key}
            title={t.title}
            detail={t.detail}
            duration={t.duration}
            href={t.href}
          />
        ))}
      </div>
    </section>
  );
}

interface TodayTaskProps {
  title: string;
  detail: string;
  duration: string;
  href: string;
}

function TodayTask({ title, detail, duration, href }: TodayTaskProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
            {duration}
          </span>
        </div>
        <p className="text-xs text-slate-600">{detail}</p>
      </div>
      <div className="mt-3">
        <Link
          href={href}
          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-500"
        >
          始める
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

