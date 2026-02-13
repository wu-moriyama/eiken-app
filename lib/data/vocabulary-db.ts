import { supabase } from "@/lib/supabase/client";
import type { VocabularyItem } from "./sample-vocabulary";

/** プロフィールの目標級（英検2級）を vocabulary レベル（2級）に変換 */
export function profileLevelToVocabularyLevel(
  profileLevel: string | null
): string {
  if (!profileLevel) return "5級";
  const m = profileLevel.match(/英検(準?[0-9一二]級)/);
  if (m) return m[1]; // 準2級, 2級 など
  if (profileLevel.includes("5")) return "5級";
  if (profileLevel.includes("4")) return "4級";
  if (profileLevel.includes("3")) return "3級";
  if (profileLevel.includes("準2") || profileLevel.includes("准2"))
    return "準2級";
  if (profileLevel.includes("2")) return "2級";
  if (profileLevel.includes("準1") || profileLevel.includes("准1"))
    return "準1級";
  if (profileLevel.includes("1")) return "1級";
  return "5級";
}

/** 単語習熟度（マスター語数 / 対象級の総語数 × 100） */
export async function getVocabularyProficiency(
  profileId: string,
  profileTargetLevel: string | null
): Promise<{ percentage: number; mastered: number; total: number }> {
  const level = profileLevelToVocabularyLevel(profileTargetLevel);

  const [{ count: total }, { data: results }] = await Promise.all([
    supabase
      .from("vocabulary")
      .select("id", { count: "exact", head: true })
      .eq("level", level),
    supabase
      .from("vocabulary_quiz_results")
      .select("vocabulary_id, is_correct, vocabulary(level)")
      .eq("user_id", profileId)
  ]);

  const totalCount = total ?? 0;
  if (totalCount === 0) return { percentage: 0, mastered: 0, total: 0 };

  const scoreMap = new Map<number, { correct: number; wrong: number }>();
  for (const row of results ?? []) {
    const r = row as {
      vocabulary_id: number;
      is_correct: boolean;
      vocabulary: { level: string } | null;
    };
    if (r.vocabulary?.level !== level) continue;
    const cur = scoreMap.get(r.vocabulary_id) ?? { correct: 0, wrong: 0 };
    if (r.is_correct) cur.correct += 1;
    else cur.wrong += 1;
    scoreMap.set(r.vocabulary_id, cur);
  }

  const mastered = [...scoreMap.values()].filter(
    (s) => s.correct > s.wrong
  ).length;
  const percentage = Math.round((mastered / totalCount) * 100);

  return { percentage, mastered, total: totalCount };
}

/** ログインユーザーに紐づく user_profiles.id を取得 */
export async function getProfileId(): Promise<string | null> {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return data?.id ?? null;
}

/** 過去のクイズ履歴（単語ごとの正誤・回答日時） */
export type QuizHistoryEntry = {
  id: number;
  vocabularyId: number;
  word: string;
  meaningJa: string;
  level: string;
  isCorrect: boolean;
  createdAt: string;
};

/** 過去のクイズ履歴を取得（新しい順） */
export async function getQuizHistory(
  profileId: string,
  limit = 100
): Promise<QuizHistoryEntry[]> {
  const { data, error } = await supabase
    .from("vocabulary_quiz_results")
    .select(`
      id,
      vocabulary_id,
      is_correct,
      created_at,
      vocabulary(word, meaning_ja, level)
    `)
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[vocabulary-db] getQuizHistory error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const r = row as {
      id: number;
      vocabulary_id: number;
      is_correct: boolean;
      created_at: string;
      vocabulary: { word: string; meaning_ja: string; level: string } | null;
    };
    return {
      id: r.id,
      vocabularyId: r.vocabulary_id,
      word: r.vocabulary?.word ?? "",
      meaningJa: r.vocabulary?.meaning_ja ?? "",
      level: r.vocabulary?.level ?? "",
      isCorrect: r.is_correct,
      createdAt: r.created_at
    };
  });
}

/** 間違えた単語の一覧（間違い回数が多い順） */
export type WrongWordStats = {
  vocabularyId: number;
  word: string;
  meaningJa: string;
  level: string;
  wrongCount: number;
};

export async function getWrongWordStats(
  profileId: string
): Promise<WrongWordStats[]> {
  const { data, error } = await supabase
    .from("vocabulary_quiz_results")
    .select("vocabulary_id, vocabulary(word, meaning_ja, level)")
    .eq("user_id", profileId)
    .eq("is_correct", false);

  if (error || !data) return [];

  const countMap = new Map<
    number,
    { word: string; meaningJa: string; level: string; count: number }
  >();
  for (const row of data) {
    const r = row as {
      vocabulary_id: number;
      vocabulary: { word: string; meaning_ja: string; level: string } | null;
    };
    const v = r.vocabulary;
    if (!v) continue;
    const cur = countMap.get(r.vocabulary_id);
    if (cur) {
      cur.count += 1;
    } else {
      countMap.set(r.vocabulary_id, {
        word: v.word,
        meaningJa: v.meaning_ja,
        level: v.level,
        count: 1
      });
    }
  }
  return [...countMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([vocabularyId, v]) => ({
      vocabularyId,
      word: v.word,
      meaningJa: v.meaningJa,
      level: v.level,
      wrongCount: v.count
    }));
}

/** クイズ結果を保存（vocabulary_quiz_results） */
export async function saveQuizResult(
  profileId: string,
  vocabularyId: string,
  isCorrect: boolean
): Promise<void> {
  await supabase.from("vocabulary_quiz_results").insert({
    user_id: profileId,
    vocabulary_id: parseInt(vocabularyId, 10),
    is_correct: isCorrect
  });
}

/**
 * 単語ごとの優先度スコア取得
 * スコア = 間違い回数 - 正解回数（正のとき出題優先、正解が増えると下がる）
 */
async function getVocabularyPriorityScores(
  profileId: string,
  level: string
): Promise<{ id: number; score: number }[]> {
  const { data, error } = await supabase
    .from("vocabulary_quiz_results")
    .select("vocabulary_id, is_correct, vocabulary(level)")
    .eq("user_id", profileId);

  if (error || !data) return [];

  const levelFilter = level !== "全レベル";
  const wrongMap = new Map<number, number>();
  const correctMap = new Map<number, number>();
  for (const row of data) {
    const r = row as {
      vocabulary_id: number;
      is_correct: boolean;
      vocabulary: { level: string } | null;
    };
    if (levelFilter && r.vocabulary?.level !== level) continue;
    if (r.is_correct) {
      correctMap.set(r.vocabulary_id, (correctMap.get(r.vocabulary_id) ?? 0) + 1);
    } else {
      wrongMap.set(r.vocabulary_id, (wrongMap.get(r.vocabulary_id) ?? 0) + 1);
    }
  }
  const ids = new Set([...wrongMap.keys(), ...correctMap.keys()]);
  return [...ids]
    .map((id) => ({
      id,
      score: (wrongMap.get(id) ?? 0) - (correctMap.get(id) ?? 0)
    }))
    .filter((x) => x.score > 0) // 正解が多くてマスターした単語は優先しない
    .sort((a, b) => b.score - a.score); // スコア高い順
}

/**
 * Supabase の vocabulary テーブルから単語を取得
 * @param level 級（「全レベル」の場合は全件）
 * @param quizCount 出題数（10問など）
 * @param optionPoolSize 誤答候補用に取得する件数（品詞揃えのため多めに取得、0で全件）
 * @param profileId ログインユーザーの profile id（指定時は間違えた単語を優先して出題）
 */
export async function fetchVocabularyFromSupabase(
  level: string,
  quizCount: number,
  optionPoolSize = 80,
  profileId?: string | null
): Promise<VocabularyItem[]> {
  let query = supabase
    .from("vocabulary")
    .select("id, level, word, meaning_ja, part_of_speech, category, pronunciation, example_en, example_ja");

  if (level !== "全レベル") {
    query = query.eq("level", level);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[vocabulary-db] fetch error:", error);
    return [];
  }

  const items: VocabularyItem[] = (data ?? []).map((row) => ({
    id: String(row.id),
    word: row.word ?? "",
    meaning_ja: row.meaning_ja ?? "",
    level: row.level ?? "",
    part_of_speech: row.part_of_speech ?? undefined,
    category: row.category ?? undefined,
    pronunciation: row.pronunciation ?? undefined,
    example_en: row.example_en ?? undefined,
    example_ja: row.example_ja ?? undefined
  }));

  const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  let result: VocabularyItem[];
  if (profileId) {
    const priorityScores = await getVocabularyPriorityScores(profileId, level);
    const priorityIds = new Set(priorityScores.map((p) => String(p.id)));
    const priorityItems = shuffle(
      items.filter((v) => priorityIds.has(v.id))
    );
    const restItems = shuffle(
      items.filter((v) => !priorityIds.has(v.id))
    );

    // 10問中、優先単語は最大4問まで（偏り防止）、残りは通常から、出題順はランダム
    let nFromPriority = Math.min(4, priorityItems.length);
    let nFromRest = Math.min(quizCount - nFromPriority, restItems.length);
    if (nFromRest < 0) nFromRest = 0;
    if (nFromPriority + nFromRest < quizCount) {
      nFromPriority = Math.min(quizCount - nFromRest, priorityItems.length);
    }
    const quizItems = shuffle([
      ...priorityItems.slice(0, nFromPriority),
      ...restItems.slice(0, nFromRest)
    ]);

    // オプション用に残りを足して80語
    const usedIds = new Set(quizItems.map((v) => v.id));
    const remaining = [
      ...priorityItems.slice(nFromPriority),
      ...restItems.slice(nFromRest)
    ].filter((v) => !usedIds.has(v.id));
    result = [...quizItems, ...shuffle(remaining)];
  } else {
    result = shuffle(items);
  }

  const poolSize =
    optionPoolSize > 0 ? Math.min(optionPoolSize, result.length) : result.length;
  return result.slice(0, Math.max(quizCount, poolSize));
}
