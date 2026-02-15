import { openai } from "@/lib/ai/openai-client";

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  "3級": "中学3年生レベル（junior high school 3rd year）",
  "準2級": "高校中級程度（high school intermediate）",
  "2級": "高校卒業程度（high school graduate）",
  "準1級": "大学中級程度（university intermediate）",
  "1級": "大学上級程度（university advanced）"
};

export interface WritingFeedbackResult {
  vocabulary_score: number; // 語彙 0-5
  grammar_score: number; // 文法 0-5
  content_score: number; // 内容 0-5
  organization_score: number; // 構成 0-5
  instruction_score: number; // 指示遵守 0-5
  corrected_text: string; // 添削文
  feedback: string; // フィードバック（日本語）
}

export interface WritingFeedbackInput {
  level: string;
  promptType: "essay" | "email" | "summary";
  promptText: string;
  userContent: string;
  wordCountMin: number | null;
  wordCountMax: number | null;
}

/** 総合点を計算（5軸の平均、小数第1位） */
export function computeOverallScore(r: WritingFeedbackResult): number {
  const sum =
    r.vocabulary_score +
    r.grammar_score +
    r.content_score +
    r.organization_score +
    r.instruction_score;
  return Math.round((sum / 5) * 10) / 10;
}

export async function gradeWriting(
  input: WritingFeedbackInput
): Promise<WritingFeedbackResult> {
  const levelDesc =
    LEVEL_DESCRIPTIONS[input.level] ?? `${input.level}レベル`;
  const wordRange =
    input.wordCountMin != null && input.wordCountMax != null
      ? `${input.wordCountMin}〜${input.wordCountMax}語`
      : "指示に従った語数";

  const isSummary = input.promptType === "summary";
  const summaryNote = isSummary
    ? `
This is a SUMMARY task (要約). The student read a passage and wrote a summary in 45-55 words.
- content_score: Did they accurately capture the main points from each paragraph? No personal opinion.
- organization_score: Is the summary logically structured and easy to follow?
- instruction_score: 45-55 words, accurate summarization (not opinion essay), covers key points from the original.
`
    : "";

  const systemPrompt = `You are an expert Eiken (Japanese English proficiency test) writing grader.
Grade the student's writing according to the specified level.${summaryNote}

Level criteria:
- 3級: Junior high school 3rd year level. Be encouraging; focus on basic correctness.
- 準2級: High school intermediate. Expect simple but coherent essays.
- 2級: High school graduate. Expect clear structure and appropriate vocabulary.
- 準1級: University intermediate. Expect well-structured arguments with varied vocabulary.
- 1級: University advanced. Expect sophisticated arguments, complex structures, and precise vocabulary.

Score each category 0-5 (5 = excellent, 0 = poor). Be strict but fair for the level.
Provide corrected_text: the student's essay with grammar/spelling fixes only. Do NOT rewrite or change meaning.
WRAP EACH CORRECTED part in double brackets [[...]]. Example: "they may [[spend]] too much" (if you changed "spends" to "spend").
Provide feedback in Japanese: what was good, and specific points to improve (e.g. grammar mistakes, better word choices).`;

  const userPrompt = `Level: ${input.level} (${levelDesc})
Prompt type: ${input.promptType}
Word count target: ${wordRange}

=== PROMPT / QUESTION ===
${input.promptText}

=== STUDENT'S ANSWER ===
${input.userContent}

Grade and return a JSON object with:
- vocabulary_score (0-5)
- grammar_score (0-5)
- content_score (0-5): Did they answer the question appropriately?
- organization_score (0-5): Logical structure, flow
- instruction_score (0-5): Followed instructions (word count, format; for summary: accurate summarization, 45-55 words, no personal opinion)
- corrected_text: The student's essay with only grammar/spelling corrections. Wrap each corrected word/phrase in [[...]]. Example: "they may [[spend]] too much" and "[[healthier]] lifestyles"
- feedback: Japanese text, 2-4 sentences. Mention specific improvements (e.g. "spends" → "spend", "more healthier" → "healthier").`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("AI returned empty response");
  }

  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const clamp = (n: unknown, min: number, max: number): number => {
    const v = typeof n === "number" ? n : Number(n) || 0;
    return Math.min(max, Math.max(min, Math.round(v)));
  };

  return {
    vocabulary_score: clamp(parsed.vocabulary_score, 0, 5),
    grammar_score: clamp(parsed.grammar_score, 0, 5),
    content_score: clamp(parsed.content_score, 0, 5),
    organization_score: clamp(parsed.organization_score, 0, 5),
    instruction_score: clamp(parsed.instruction_score, 0, 5),
    corrected_text: String(parsed.corrected_text ?? input.userContent),
    feedback: String(parsed.feedback ?? "")
  };
}
