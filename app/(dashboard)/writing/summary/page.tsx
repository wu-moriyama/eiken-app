"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  fetchRandomSummaryPrompt,
  saveWritingSubmission,
  type WritingPrompt
} from "@/lib/data/writing-db";
import { getProfileId } from "@/lib/data/vocabulary-db";
import { logStudyActivity } from "@/lib/data/study-activity";
import { getGuestWritingCount, incrementGuestWritingCount, GUEST_WRITING_LIMIT } from "@/lib/guest-usage";
import { GuestLimitPrompt } from "@/components/GuestLimitPrompt";
import { MODULE_COLORS } from "@/lib/constants/module-colors";
import { WritingResult, type WritingResultData } from "@/components/features/writing/WritingResult";
import { WritingHintPanel, WritingHintButton } from "@/components/features/writing/WritingHintPanel";

const VALID_SUMMARY_LEVELS = ["2級", "準1級", "1級"] as const;
type SummaryLevel = (typeof VALID_SUMMARY_LEVELS)[number];

function isValidSummaryLevel(s: string | null): s is SummaryLevel {
  return s != null && VALID_SUMMARY_LEVELS.includes(s as SummaryLevel);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getWordCountRange(prompt: WritingPrompt): string {
  const min = prompt.word_count_min;
  const max = prompt.word_count_max;
  if (min != null && max != null) return `${min}〜${max}語`;
  return "45〜55語";
}

function WritingSummaryContent() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level");
  const level: SummaryLevel = isValidSummaryLevel(levelParam) ? levelParam : "2級";
  const [content, setContent] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WritingResultData | null>(null);
  const [showGuestLimit, setShowGuestLimit] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchRandomSummaryPrompt(level)
      .then((p) => {
        setPrompt(p ?? null);
        if (!p) setError("要約問題の取得に失敗しました。シードデータを投入してください。");
      })
      .catch(() =>
        setError("要約問題の取得に失敗しました。シードデータを投入してください。")
      )
      .finally(() => setLoading(false));
  }, [level]);

  useEffect(() => {
    if (!isStarted) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted]);

  const startWriting = () => setIsStarted(true);

  const handleSubmit = useCallback(async () => {
    if (!prompt || !content.trim()) return;
    setError(null);
    const profileId = await getProfileId();
    if (!profileId) {
      const count = getGuestWritingCount();
      if (count >= GUEST_WRITING_LIMIT) {
        setShowGuestLimit(true);
        return;
      }
      incrementGuestWritingCount();
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/writing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: prompt.level,
          promptType: "summary",
          promptText: prompt.prompt,
          userContent: content.trim(),
          wordCountMin: prompt.word_count_min,
          wordCountMax: prompt.word_count_max
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "添削に失敗しました");
      }
      const data = (await res.json()) as WritingResultData;
      setResult(data);

      if (profileId) {
        await saveWritingSubmission({
          userId: profileId,
          promptId: prompt.id,
          content: content.trim(),
          timeSeconds: elapsed,
          overallScore: data.overall_score,
          vocabularyScore: data.vocabulary_score,
          grammarScore: data.grammar_score,
          contentScore: data.content_score,
          organizationScore: data.organization_score,
          instructionScore: data.instruction_score,
          correctedText: data.corrected_text,
          feedback: data.feedback
        });
        await logStudyActivity(profileId, "writing", {
          seconds: elapsed,
          prompt_id: prompt.id,
          level: prompt.level,
          prompt_type: "summary",
          overall_score: data.overall_score
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "添削に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }, [prompt, content, elapsed]);

  const handleNewProblem = useCallback(() => {
    setResult(null);
    setContent("");
    setIsStarted(false);
    setError(null);
    setLoading(true);
    fetchRandomSummaryPrompt(level).then((p) => {
      setPrompt(p ?? null);
      setLoading(false);
      if (!p) setError("要約問題の取得に失敗しました。シードデータを投入してください。");
    });
  }, [level]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const defaultRange =
    level === "1級" ? "90〜110語" : level === "準1級" ? "60〜70語" : "45〜55語";
  const wordRange = prompt ? getWordCountRange(prompt) : defaultRange;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-slate-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <WritingResult
              data={result}
              level={level}
              promptType="summary"
              onNewProblem={handleNewProblem}
            />
          </div>
        </div>
      </main>
    );
  }

  if (error || !prompt) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-red-600">
              {error ??
                "要約問題が登録されていません。シードデータを投入してください。"}
            </p>
            <Link
              href="/writing"
              className="mt-4 inline-block text-sm text-[#50c2cb] hover:underline"
            >
              ← 形式選択に戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (showGuestLimit) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <GuestLimitPrompt type="writing" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-8">
      <WritingHintPanel
        type="summary"
        level={level}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
      />
      <WritingHintButton
        onClick={() => setIsHintOpen((o) => !o)}
        isOpen={isHintOpen}
      />
      <div className="mx-auto max-w-2xl pb-20">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/writing" className="text-sm text-slate-600 hover:text-slate-900">
            ← 形式選択に戻る
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>時間</span>
            <span className="tabular-nums">{formatTime(elapsed)}</span>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <span className={`h-2 w-2 rounded-full ${MODULE_COLORS.writing.dot}`} />
            英検{level} ライティング（要約）
          </h1>
          <p className="text-xs text-slate-500">
            目安: {wordRange} · {level === "1級" ? "約20分" : level === "準1級" ? "約20分" : "約15分"}で解きましょう
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
              {prompt.prompt}
            </p>
          </div>

          {!isStarted ? (
            <button
              type="button"
              onClick={startWriting}
              className={`w-full rounded-full px-4 py-3 text-sm font-semibold text-white shadow-sm ${MODULE_COLORS.writing.solid} ${MODULE_COLORS.writing.solidHover}`}
            >
              書き始める
            </button>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  あなたの要約
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`英文を読んで、${wordRange}で要約を入力してください...`}
                  rows={8}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#50c2cb] focus:outline-none focus:ring-1 focus:ring-[#50c2cb]"
                />
                <p className="mt-1 text-right text-xs text-slate-500">
                  目安: {wordRange}（現在 {wordCount} 語）
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${MODULE_COLORS.writing.solid} ${MODULE_COLORS.writing.solidHover}`}
                >
                  {submitting ? "添削中..." : "提出する（AI添削）"}
                </button>
                <Link
                  href="/writing"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  やめる
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function WritingSummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-64px)] px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-center text-slate-600">読み込み中...</p>
          </div>
        </main>
      }
    >
      <WritingSummaryContent />
    </Suspense>
  );
}
