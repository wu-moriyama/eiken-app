import { supabase } from "@/lib/supabase/client";

/** Eメール形式のプロンプトデータ（3級・準2級共通） */
export interface EmailPromptData {
  emailFrom: string;
  emailContent: string;
  instruction?: string;
  /** 準2級のみ: 下線部のテキスト */
  underlinedPart?: string;
  /** 準2級のみ: 返信で答えるべき質問 */
  question?: string;
}

/** ライティング問題 */
export interface WritingPrompt {
  id: number;
  level: string;
  prompt_type: "essay" | "email";
  title: string;
  prompt: string;
  word_count_min: number | null;
  word_count_max: number | null;
  time_limit_min_seconds: number | null;
  time_limit_max_seconds: number | null;
}

/** 英作文問題のプロンプトを1件ランダム取得 */
export async function fetchRandomEssayPrompt(
  level: string
): Promise<WritingPrompt | null> {
  const { data, error } = await supabase
    .from("writing_prompts")
    .select("*")
    .eq("level", level)
    .eq("prompt_type", "essay")
    .limit(50);

  if (error || !data || data.length === 0) return null;

  const idx = Math.floor(Math.random() * data.length);
  const row = data[idx];
  return {
    id: row.id,
    level: row.level ?? "",
    prompt_type: "essay",
    title: row.title ?? "",
    prompt: row.prompt ?? "",
    word_count_min: row.word_count_min ?? null,
    word_count_max: row.word_count_max ?? null,
    time_limit_min_seconds: row.time_limit_min_seconds ?? null,
    time_limit_max_seconds: row.time_limit_max_seconds ?? null
  };
}

/** Eメール問題のプロンプトを1件ランダム取得 */
export async function fetchRandomEmailPrompt(
  level: string
): Promise<WritingPrompt | null> {
  const { data, error } = await supabase
    .from("writing_prompts")
    .select("*")
    .eq("level", level)
    .eq("prompt_type", "email")
    .limit(50);

  if (error || !data || data.length === 0) return null;

  const idx = Math.floor(Math.random() * data.length);
  const row = data[idx];
  return {
    id: row.id,
    level: row.level ?? "",
    prompt_type: "email",
    title: row.title ?? "",
    prompt: row.prompt ?? "",
    word_count_min: row.word_count_min ?? null,
    word_count_max: row.word_count_max ?? null,
    time_limit_min_seconds: row.time_limit_min_seconds ?? null,
    time_limit_max_seconds: row.time_limit_max_seconds ?? null
  };
}

/** 提出結果を保存 */
export interface WritingSubmissionInput {
  userId: string;
  promptId: number;
  content: string;
  timeSeconds: number;
  overallScore: number; // 例: 4.6
  vocabularyScore: number;
  grammarScore: number;
  contentScore: number;
  organizationScore: number;
  instructionScore: number;
  correctedText: string;
  feedback: string;
}

export async function saveWritingSubmission(
  input: WritingSubmissionInput
): Promise<{ id: number } | null> {
  const { data, error } = await supabase
    .from("writing_submissions")
    .insert({
      user_id: input.userId,
      prompt_id: input.promptId,
      content: input.content,
      time_seconds: input.timeSeconds,
      overall_score: Math.round(input.overallScore * 10),
      grammar_score: input.grammarScore,
      vocabulary_score: input.vocabularyScore,
      organization_score: input.organizationScore,
      content_score: input.contentScore,
      ai_feedback: {
        instruction_score: input.instructionScore,
        corrected_text: input.correctedText,
        feedback: input.feedback
      }
    })
    .select("id")
    .single();

  if (error) {
    console.error("[writing-db] saveWritingSubmission", error);
    return null;
  }
  return { id: data.id };
}

/** ai_feedback から overall を復元（DB は overall_score を 10 倍で保存） */
export function parseOverallScoreFromDb(stored: number): number {
  return stored / 10;
}

/** ライティング履歴1件 */
export interface WritingHistoryEntry {
  id: number;
  promptId: number;
  level: string;
  promptType: "essay" | "email";
  title: string;
  prompt: string;
  content: string;
  timeSeconds: number;
  overallScore: number;
  vocabularyScore: number;
  grammarScore: number;
  contentScore: number;
  organizationScore: number;
  instructionScore: number;
  correctedText: string;
  feedback: string;
  createdAt: string;
}

/** ユーザーのライティング履歴を取得（新しい順） */
export async function getWritingHistory(
  profileId: string,
  limit = 50
): Promise<WritingHistoryEntry[]> {
  const { data, error } = await supabase
    .from("writing_submissions")
    .select(
      `
      id,
      prompt_id,
      content,
      time_seconds,
      overall_score,
      grammar_score,
      vocabulary_score,
      organization_score,
      content_score,
      ai_feedback,
      created_at,
      writing_prompts (
        level,
        prompt_type,
        title,
        prompt
      )
    `
    )
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[writing-db] getWritingHistory", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const p = row.writing_prompts as
      | { level?: string; prompt_type?: string; title?: string; prompt?: string }
      | null;
    const af = (row.ai_feedback ?? {}) as {
      instruction_score?: number;
      corrected_text?: string;
      feedback?: string;
    };
    return {
      id: row.id,
      promptId: row.prompt_id,
      level: p?.level ?? "",
      promptType: (p?.prompt_type === "email" ? "email" : "essay") as
        | "essay"
        | "email",
      title: p?.title ?? "",
      prompt: p?.prompt ?? "",
      content: row.content ?? "",
      timeSeconds: row.time_seconds ?? 0,
      overallScore: parseOverallScoreFromDb(row.overall_score ?? 0),
      vocabularyScore: row.vocabulary_score ?? 0,
      grammarScore: row.grammar_score ?? 0,
      contentScore: row.content_score ?? 0,
      organizationScore: row.organization_score ?? 0,
      instructionScore: af.instruction_score ?? 0,
      correctedText: af.corrected_text ?? "",
      feedback: af.feedback ?? "",
      createdAt: row.created_at ?? ""
    };
  });
}

/** プロフィールの目標級（英検2級）を writing_prompts の level（2級）に変換 */
function profileLevelToWritingLevel(profileLevel: string | null): string | null {
  if (!profileLevel) return null;
  const m = profileLevel.match(/英検(準?[0-9一二]級)/);
  if (m) return m[1]; // 3級, 準2級, 2級, 準1級, 1級
  if (profileLevel.includes("準2") || profileLevel.includes("准2"))
    return "準2級";
  if (profileLevel.includes("2")) return "2級";
  if (profileLevel.includes("3")) return "3級";
  if (profileLevel.includes("準1") || profileLevel.includes("准1"))
    return "準1級";
  if (profileLevel.includes("1")) return "1級";
  return null; // 5級, 4級 などライティング非対応級
}

/** ライティング提出数（全体・目標級問わず）を取得 */
export async function getTotalWritingCount(
  profileId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("writing_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profileId);

  if (error) return 0;
  return count ?? 0;
}

/** 目標級のライティング提出数（直近N日）を取得 */
export async function getWritingSubmissionCount(
  profileId: string,
  profileTargetLevel: string | null,
  days = 7
): Promise<number> {
  const level = profileLevelToWritingLevel(profileTargetLevel);
  if (!level) return 0;

  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data, error } = await supabase
    .from("writing_submissions")
    .select("id, writing_prompts(level)")
    .eq("user_id", profileId)
    .gte("created_at", since);

  if (error) {
    console.error("[writing-db] getWritingSubmissionCount", error);
    return 0;
  }

  const count = (data ?? []).filter(
    (row) =>
      (row.writing_prompts as { level?: string } | null)?.level === level
  ).length;
  return count;
}

/** 準2級Eメール形式かどうか */
export function isJun2kyuEmailFormat(data: EmailPromptData): boolean {
  return Boolean(data.underlinedPart && data.question);
}

/** プロンプトの prompt フィールドを Eメール用 JSON としてパース */
export function parseEmailPromptData(prompt: string): EmailPromptData | null {
  try {
    const parsed = JSON.parse(prompt) as EmailPromptData;
    if (parsed.emailFrom && parsed.emailContent) return parsed;
    return null;
  } catch {
    return null;
  }
}
