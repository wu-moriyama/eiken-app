import { supabase } from "@/lib/supabase/client";

/** モジュール別の活動回数（直近30日） */
export async function getModuleActivityCounts(
  profileId: string
): Promise<Record<string, number>> {
  const since = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data, error } = await supabase
    .from("user_activity_log")
    .select("activity_type")
    .eq("user_id", profileId)
    .gte("created_at", since);

  if (error) return {};

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const t = row.activity_type as string;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}

/** 累計学習時間（秒）を取得 */
export async function getTotalStudySeconds(
  profileId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("user_activity_log")
    .select("payload")
    .eq("user_id", profileId);

  if (error) return 0;

  let total = 0;
  for (const row of data ?? []) {
    const p = row.payload as { seconds?: number } | null;
    if (p?.seconds && typeof p.seconds === "number") {
      total += p.seconds;
    }
  }
  return total;
}

/** 今日の学習時間（秒）を取得 */
export async function getTodayStudySeconds(
  profileId: string
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("user_activity_log")
    .select("payload")
    .eq("user_id", profileId)
    .gte("created_at", today)
    .lt("created_at", tomorrow);

  if (error) return 0;

  let total = 0;
  for (const row of data ?? []) {
    const p = row.payload as { seconds?: number } | null;
    if (p?.seconds && typeof p.seconds === "number") {
      total += p.seconds;
    }
  }
  return total;
}

/** 連続学習日数と最長記録を取得 */
export async function getStreak(
  profileId: string
): Promise<{ current: number; longest: number }> {
  const { data, error } = await supabase
    .from("daily_streaks")
    .select("current_streak, longest_streak")
    .eq("user_id", profileId)
    .maybeSingle();

  if (error || !data) {
    return { current: 0, longest: 0 };
  }
  return {
    current: data.current_streak ?? 0,
    longest: data.longest_streak ?? 0
  };
}

/** 音読ボタンクリック時の学習時間（秒） */
export const READING_ALOUD_SECONDS = 10;

/**
 * 音読活動を記録（10秒としてカウント）
 */
export async function logReadingAloudActivity(
  profileId: string
): Promise<void> {
  await logStudyActivity(profileId, "reading_aloud", {
    seconds: READING_ALOUD_SECONDS
  });
}

/**
 * 学習活動を記録し、連続学習日数を更新
 * クイズ完了時などに呼び出す
 */
export async function logStudyActivity(
  profileId: string,
  activityType: string,
  payload: { seconds: number; [key: string]: unknown }
): Promise<void> {
  await supabase.from("user_activity_log").insert({
    user_id: profileId,
    activity_type: activityType,
    payload
  });

  await updateStreak(profileId);
}

/**
 * 連続学習日数を更新
 * last_active_date が昨日 → +1、今日 → 変更なし、それ以前 → 1にリセット
 */
async function updateStreak(profileId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("daily_streaks")
    .select("id, current_streak, longest_streak, last_active_date")
    .eq("user_id", profileId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("daily_streaks").insert({
      user_id: profileId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today
    });
    return;
  }

  const last = (existing.last_active_date as string) ?? "";
  let newCurrent = existing.current_streak ?? 0;
  let newLongest = existing.longest_streak ?? 0;

  if (last === today) {
    // 今日すでに記録済み → ストリークは変更なし
    return;
  }
  if (last === yesterday) {
    newCurrent += 1;
  } else {
    newCurrent = 1; // 1日以上空いた
  }
  if (newCurrent > newLongest) {
    newLongest = newCurrent;
  }

  await supabase
    .from("daily_streaks")
    .update({
      current_streak: newCurrent,
      longest_streak: newLongest,
      last_active_date: today
    })
    .eq("user_id", profileId);
}
