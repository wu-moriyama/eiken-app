import { supabase } from "@/lib/supabase/client";

export type ExamRoundOption = {
  value: string; // "2025-3"
  label: string; // "2025年度第3回"
  examYear: number;
  round: number;
  primaryDate: string; // YYYY-MM-DD
  secondaryDate: string;
};

/** 直近3回の試験回オプションを取得（プルダウン用） */
export async function getRecentExamRoundOptions(
  limit = 3
): Promise<ExamRoundOption[]> {
  const { data, error } = await supabase
    .from("eiken_exam_dates")
    .select("exam_year, round, primary_date, secondary_date")
    .order("exam_year", { ascending: true })
    .order("round", { ascending: true });

  if (error) {
    console.error("[eiken-exam-db] getRecentExamRoundOptions", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // primary_date でソートし、今日以降の直近 limit 件（未来の試験を優先）
  const sorted = [...data].sort(
    (a, b) =>
      new Date(a.primary_date).getTime() - new Date(b.primary_date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const future = sorted.filter(
    (r) => new Date(r.primary_date).getTime() >= today.getTime()
  );
  const past = sorted.filter(
    (r) => new Date(r.primary_date).getTime() < today.getTime()
  );

  // 未来が足りなければ直近の過去を補完
  const candidates =
    future.length >= limit
      ? future.slice(0, limit)
      : [...past.slice(-(limit - future.length)), ...future];

  return candidates.map((r) => ({
    value: `${r.exam_year}-${r.round}`,
    label: `${r.exam_year}年度第${r.round}回`,
    examYear: r.exam_year,
    round: r.round,
    primaryDate: r.primary_date,
    secondaryDate: r.secondary_date
  }));
}

/** 指定の年度・回のラベルを取得（表示用） */
export function formatExamRoundLabel(examYear: number, round: number): string {
  return `${examYear}年度第${round}回`;
}

/** 指定の年度・回の試験日を取得（一次・二次） */
export async function getDatesByRound(
  examYear: number,
  round: number
): Promise<{ primaryDate: string; secondaryDate: string } | null> {
  const { data, error } = await supabase
    .from("eiken_exam_dates")
    .select("primary_date, secondary_date")
    .eq("exam_year", examYear)
    .eq("round", round)
    .maybeSingle();

  if (error || !data?.primary_date) return null;
  return {
    primaryDate: data.primary_date,
    secondaryDate: (data.secondary_date as string) ?? data.primary_date
  };
}

/** 直近の一次試験日を取得（未設定時のフォールバック用・次の試験を優先） */
export async function getNearestPrimaryDate(): Promise<{
  date: Date;
  label: string;
} | null> {
  const { data, error } = await supabase
    .from("eiken_exam_dates")
    .select("exam_year, round, primary_date")
    .order("primary_date", { ascending: true });

  if (error || !data?.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next = data.find(
    (r) => new Date(r.primary_date).getTime() >= today.getTime()
  );
  const first = next ?? data[data.length - 1];
  if (!first?.primary_date) return null;

  return {
    date: new Date(first.primary_date),
    label: `${first.exam_year}年度第${first.round}回`
  };
}

/** 指定の年度・回の一次試験日を取得 */
export async function getPrimaryDateByRound(
  examYear: number,
  round: number
): Promise<Date | null> {
  const { data, error } = await supabase
    .from("eiken_exam_dates")
    .select("primary_date")
    .eq("exam_year", examYear)
    .eq("round", round)
    .maybeSingle();

  if (error || !data?.primary_date) return null;
  return new Date(data.primary_date);
}
