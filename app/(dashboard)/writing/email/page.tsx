"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchRandomEmailPrompt,
  parseEmailPromptData,
  isJun2kyuEmailFormat,
  saveWritingSubmission,
  type WritingPrompt,
  type EmailPromptData
} from "@/lib/data/writing-db";
import {
  getProfileId,
  getProfileTargetLevel,
  profileLevelToVocabularyLevel
} from "@/lib/data/vocabulary-db";
import { getGuestWritingCount, incrementGuestWritingCount, GUEST_WRITING_LIMIT } from "@/lib/guest-usage";
import { GuestLimitPrompt } from "@/components/GuestLimitPrompt";
import { WritingHintPanel, WritingHintButton } from "@/components/features/writing/WritingHintPanel";
import { logStudyActivity } from "@/lib/data/study-activity";
import { MODULE_COLORS } from "@/lib/constants/module-colors";
import { WritingResult, type WritingResultData } from "@/components/features/writing/WritingResult";

const VALID_EMAIL_LEVELS = ["3級", "準2級"] as const;
type EmailLevel = (typeof VALID_EMAIL_LEVELS)[number];

function isValidEmailLevel(s: string | null): s is EmailLevel {
  return s != null && VALID_EMAIL_LEVELS.includes(s as EmailLevel);
}

function getInstruction3kyu(emailFrom: string): string {
  return `あなたは、外国人の友達（${emailFrom}）から以下のEメールを受け取りました。
Eメールを読んで、それに対する返信Eメールを書きなさい。
あなたが書く返信Eメールの中で、友達（${emailFrom}）からの２つの質問（下線部）に対応する内容を、あなた自身で自由に考えて答えなさい。
あなたが書く返信Eメールの中で記入する英文の語数の目安は、15語から25語です。
解答が友達（${emailFrom}）のEメールに対応していないと判断された場合は、0点と採点されることがあります。友達のEメールの内容をよく読んでから答えてください。`;
}

function getInstructionJun2kyu(emailFrom: string): string {
  return `あなたは、外国人の知り合い（${emailFrom}）から、Eメールで質問を受け取りました。
この質問にわかりやすく答える返信メールを、英文で書きなさい。
あなたが書く返信メールの中で、${emailFrom}のEメール文中の下線部について、あなたがより理解を深めるために、下線部の特徴を問う具体的な質問を２つしなさい。
語数の目安は40語～50語です。
Best wishes, の後にあなたの名前を書く必要はありません。`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 下線部を含むメール本文をレンダリング用に分割 */
function renderEmailWithUnderline(
  emailContent: string,
  underlinedPart: string
) {
  const idx = emailContent.indexOf(underlinedPart);
  if (idx < 0) {
    return emailContent;
  }
  const before = emailContent.slice(0, idx);
  const underlined = emailContent.slice(idx, idx + underlinedPart.length);
  const after = emailContent.slice(idx + underlinedPart.length);
  return (
    <>
      {before}
      <span className="border-b-2 border-slate-800 font-medium">
        {underlined}
      </span>
      {after}
    </>
  );
}

function WritingEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level");
  const [selectedLevel, setSelectedLevel] = useState<EmailLevel>("3級");
  const [levelLoaded, setLevelLoaded] = useState(false);

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

  // URLまたはプロフィール目標級から初期levelを決定（Eメールは3級・準2級のみ）
  useEffect(() => {
    if (isValidEmailLevel(levelParam)) {
      setSelectedLevel(levelParam);
      setLevelLoaded(true);
      return;
    }
    let cancelled = false;
    getProfileTargetLevel()
      .then((targetLevel) => {
        if (cancelled) return;
        const profileLevel = profileLevelToVocabularyLevel(targetLevel);
        const defaultLevel: EmailLevel = isValidEmailLevel(profileLevel)
          ? profileLevel
          : "3級";
        setSelectedLevel(defaultLevel);
        setLevelLoaded(true);
        router.replace(`/writing/email?level=${defaultLevel}`);
      })
      .catch(() => {
        if (cancelled) return;
        setSelectedLevel("3級");
        setLevelLoaded(true);
        router.replace("/writing/email?level=3級");
      });
    return () => {
      cancelled = true;
    };
  }, [levelParam, router]);

  useEffect(() => {
    if (isValidEmailLevel(levelParam)) setSelectedLevel(levelParam);
  }, [levelParam]);

  const level = selectedLevel;

  useEffect(() => {
    if (!levelLoaded) return;
    setLoading(true);
    fetchRandomEmailPrompt(level)
      .then((p) => {
        setPrompt(p ?? null);
        if (!p) setError("問題の取得に失敗しました。");
      })
      .catch(() => setError("問題の取得に失敗しました。"))
      .finally(() => setLoading(false));
  }, [levelLoaded, level]);

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

  const promptData: EmailPromptData | null = prompt
    ? parseEmailPromptData(prompt.prompt)
    : null;

  const isJun2 = level === "準2級" && promptData && isJun2kyuEmailFormat(promptData);
  const getInstruction = isJun2 ? getInstructionJun2kyu : getInstruction3kyu;

  const handleSubmit = useCallback(async () => {
    if (!prompt || !promptData || !content.trim()) return;
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
    const fullContent = `Hi, ${promptData.emailFrom}!\nThank you for your e-mail.\n${content.trim()}\nBest wishes,`;
    const fullPromptText = `${getInstruction(promptData.emailFrom)}\n\n${promptData.emailFrom}からのメール:\n${promptData.emailContent}${isJun2 && promptData.underlinedPart ? `\n\n【下線部】${promptData.underlinedPart}` : ""}`;

    setSubmitting(true);
    try {
      const res = await fetch("/api/writing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          promptType: "email",
          promptText: fullPromptText,
          userContent: fullContent,
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
          content: fullContent,
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
          level,
          prompt_type: "email",
          overall_score: data.overall_score
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "添削に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }, [prompt, promptData, content, elapsed, level, isJun2]);

  const handleNewProblem = useCallback(() => {
    setResult(null);
    setContent("");
    setIsStarted(false);
    setError(null);
    setLoading(true);
    fetchRandomEmailPrompt(level).then((p) => {
      setPrompt(p ?? null);
      setLoading(false);
      if (!p) setError("問題の取得に失敗しました。");
    });
  }, [level]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  if (!levelLoaded || loading) {
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
              promptType="email"
              onNewProblem={handleNewProblem}
            />
          </div>
        </div>
      </main>
    );
  }

  if (error || !prompt || !promptData) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-red-600">
              {error ?? "問題が登録されていません。シードデータを投入してください。"}
            </p>
            <Link
              href="/writing"
              className="mt-4 inline-block text-sm text-blue-600 hover:underline"
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
        type="email"
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <span className={`h-2 w-2 rounded-full ${MODULE_COLORS.writing.dot}`} />
              英検 ライティング（Eメール）問題
            </h1>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-700">級</label>
              <select
                value={level}
                onChange={(e) => {
                  const l = e.target.value as EmailLevel;
                  setSelectedLevel(l);
                  router.replace(`/writing/email?level=${l}`);
                  setContent("");
                  setIsStarted(false);
                  setLoading(true);
                  setError(null);
                  fetchRandomEmailPrompt(l).then((p) => {
                    setPrompt(p ?? null);
                    setLoading(false);
                    if (!p) setError("問題の取得に失敗しました。");
                  });
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {VALID_EMAIL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    英検{l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 text-sm text-slate-700">
            <p className="whitespace-pre-wrap">{getInstruction(promptData.emailFrom)}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              {promptData.emailFrom}からのメール
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {isJun2 && promptData.underlinedPart
                  ? renderEmailWithUnderline(
                      promptData.emailContent,
                      promptData.underlinedPart
                    )
                  : promptData.emailContent}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              解答欄のフォーマット
            </p>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-800">Hi, {promptData.emailFrom}!</p>
              <p className="mt-1 text-sm text-slate-800">Thank you for your e-mail.</p>
              {!isStarted ? (
                <p className="mt-2 text-sm italic text-slate-500">
                  （ここに入る解答を入力）
                </p>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ここに解答を入力してください..."
                  rows={5}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              )}
              <p className="mt-2 text-sm text-slate-800">Best wishes,</p>
            </div>
            <p className="mt-1 text-right text-xs text-slate-500">
              目安: {level === "準2級" ? "40〜50語" : "15〜25語"}{" "}
              {isStarted && `（現在 ${wordCount} 語）`}
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${MODULE_COLORS.writing.solid} ${MODULE_COLORS.writing.solidHover}`}
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

export default function WritingEmailPage() {
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
      <WritingEmailContent />
    </Suspense>
  );
}
