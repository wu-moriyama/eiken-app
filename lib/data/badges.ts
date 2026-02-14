import { supabase } from "@/lib/supabase/client";

export type BadgeTier = "bronze" | "silver" | "gold";

export interface BadgeDef {
  key: string;
  title: string;
  description: string;
  tier: BadgeTier;
}

/** バッヂ定義（key で一意） */
export const BADGE_DEFINITIONS: BadgeDef[] = [
  { key: "account_created", title: "アカウント開設", description: "アカウントを作成しました", tier: "bronze" },
  { key: "vocab_first", title: "初めての単語テスト", description: "初めて単語テストに挑戦しました", tier: "bronze" },
  { key: "writing_first", title: "初めてのライティング添削", description: "初めてライティングを添削してもらいました", tier: "bronze" },
  { key: "vocab_10", title: "単語テスト10回", description: "単語テストを10回完了しました", tier: "bronze" },
  { key: "writing_10", title: "ライティング添削10回", description: "ライティング添削を10回受けました", tier: "bronze" },
  { key: "vocab_25", title: "単語テスト25回", description: "単語テストを25回完了しました", tier: "bronze" },
  { key: "writing_20", title: "ライティング添削20回", description: "ライティング添削を20回受けました", tier: "bronze" },
  { key: "vocab_50", title: "単語テスト50回", description: "単語テストを50回完了しました", tier: "silver" },
  { key: "writing_30", title: "ライティング添削30回", description: "ライティング添削を30回受けました", tier: "silver" },
  { key: "study_1h", title: "学習時間1時間", description: "累計学習時間が1時間に達しました", tier: "bronze" },
  { key: "study_5h", title: "学習時間5時間", description: "累計学習時間が5時間に達しました", tier: "bronze" },
  { key: "study_10h", title: "学習時間10時間", description: "累計学習時間が10時間に達しました", tier: "silver" },
  { key: "study_first_day", title: "初めての学習", description: "1日達成！初めて学習を記録しました", tier: "bronze" },
  { key: "streak_3", title: "3日間連続学習", description: "3日連続で学習を続けました", tier: "bronze" },
  { key: "streak_7", title: "1週間連続学習", description: "7日連続で学習を続けました", tier: "bronze" },
  { key: "streak_14", title: "2週間連続学習", description: "14日連続で学習を続けました", tier: "silver" }
];

const BADGE_MAP = new Map(BADGE_DEFINITIONS.map((b) => [b.key, b]));

export function getBadgeDef(key: string): BadgeDef | undefined {
  return BADGE_MAP.get(key);
}

export interface UserBadge {
  badgeKey: string;
  earnedAt: string;
  popupShown: boolean;
  def?: BadgeDef;
}

/** ユーザーが獲得したバッヂ一覧を取得 */
export async function getUserBadges(profileId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_key, earned_at, popup_shown")
    .eq("user_id", profileId)
    .order("earned_at", { ascending: false });

  if (error) {
    console.error("[badges] getUserBadges", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    badgeKey: row.badge_key,
    earnedAt: row.earned_at,
    popupShown: row.popup_shown ?? false,
    def: BADGE_MAP.get(row.badge_key)
  }));
}

/** 未表示の新規獲得バッヂを1件取得（ポップアップ用） */
export async function getUnshownBadge(
  profileId: string
): Promise<UserBadge | null> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_key, earned_at")
    .eq("user_id", profileId)
    .eq("popup_shown", false)
    .order("earned_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return {
    badgeKey: data.badge_key,
    earnedAt: data.earned_at,
    popupShown: false,
    def: BADGE_MAP.get(data.badge_key)
  };
}

/** バッヂのポップアップ表示済みをマーク */
export async function markBadgePopupShown(
  profileId: string,
  badgeKey: string
): Promise<void> {
  await supabase
    .from("user_badges")
    .update({ popup_shown: true })
    .eq("user_id", profileId)
    .eq("badge_key", badgeKey);
}

/** バッヂを付与（既に持っていれば何もしない） */
export async function earnBadge(
  profileId: string,
  badgeKey: string
): Promise<boolean> {
  const { error } = await supabase.from("user_badges").upsert(
    { user_id: profileId, badge_key: badgeKey },
    { onConflict: "user_id,badge_key", ignoreDuplicates: true }
  );
  if (error) {
    console.error("[badges] earnBadge", error);
    return false;
  }
  return true;
}

/** バッヂを所持しているか */
export async function hasBadge(
  profileId: string,
  badgeKey: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", profileId)
    .eq("badge_key", badgeKey)
    .maybeSingle();
  return !!data;
}

/** バッヂ条件チェック用の統計 */
export interface BadgeStats {
  vocabQuizCount: number;
  writingCount: number;
  totalStudySeconds: number;
  currentStreak: number;
  hasStudied: boolean; // 過去に1回以上学習したか
}

/** 統計に基づきバッヂをチェックし、新規獲得分を付与。獲得したバッヂの key を返す */
export async function checkAndEarnBadges(
  profileId: string,
  stats: BadgeStats
): Promise<string[]> {
  const earned: string[] = [];

  const maybeEarn = async (key: string, condition: boolean) => {
    if (!condition) return;
    const already = await hasBadge(profileId, key);
    if (!already && (await earnBadge(profileId, key))) {
      earned.push(key);
    }
  };

  await maybeEarn("account_created", true); // プロフィールがある＝アカウント開設済み
  await maybeEarn("vocab_first", stats.vocabQuizCount >= 1);
  await maybeEarn("vocab_10", stats.vocabQuizCount >= 10);
  await maybeEarn("vocab_25", stats.vocabQuizCount >= 25);
  await maybeEarn("vocab_50", stats.vocabQuizCount >= 50);

  await maybeEarn("writing_first", stats.writingCount >= 1);
  await maybeEarn("writing_10", stats.writingCount >= 10);
  await maybeEarn("writing_20", stats.writingCount >= 20);
  await maybeEarn("writing_30", stats.writingCount >= 30);

  const totalHours = stats.totalStudySeconds / 3600;
  await maybeEarn("study_1h", totalHours >= 1);
  await maybeEarn("study_5h", totalHours >= 5);
  await maybeEarn("study_10h", totalHours >= 10);

  await maybeEarn("study_first_day", stats.hasStudied);
  await maybeEarn("streak_3", stats.currentStreak >= 3);
  await maybeEarn("streak_7", stats.currentStreak >= 7);
  await maybeEarn("streak_14", stats.currentStreak >= 14);

  return earned;
}
