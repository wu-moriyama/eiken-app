import { supabase } from "@/lib/supabase/client";

/** Eメール形式のプロンプトデータ */
export interface EmailPromptData {
  emailFrom: string;
  emailContent: string;
  instruction?: string;
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
