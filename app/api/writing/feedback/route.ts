import { NextRequest, NextResponse } from "next/server";
import {
  gradeWriting,
  computeOverallScore,
  type WritingFeedbackResult
} from "@/lib/ai/writing-feedback";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      level,
      promptType,
      promptText,
      userContent,
      wordCountMin,
      wordCountMax
    } = body;

    if (
      !level ||
      !promptType ||
      !promptText ||
      typeof userContent !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing required fields: level, promptType, promptText, userContent" },
        { status: 400 }
      );
    }

    const result: WritingFeedbackResult = await gradeWriting({
      level: String(level),
      promptType: promptType === "email" ? "email" : "essay",
      promptText: String(promptText),
      userContent: String(userContent),
      wordCountMin:
        typeof wordCountMin === "number" ? wordCountMin : null,
      wordCountMax:
        typeof wordCountMax === "number" ? wordCountMax : null
    });

    const overallScore = computeOverallScore(result);
    return NextResponse.json({
      ...result,
      overall_score: overallScore
    });
  } catch (err) {
    console.error("[writing/feedback]", err);
    return NextResponse.json(
      { error: "AI添削に失敗しました。しばらくしてから再試行してください。" },
      { status: 500 }
    );
  }
}
