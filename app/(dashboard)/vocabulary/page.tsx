"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { VocabularyQuizCard } from "@/components/features/vocabulary/VocabularyQuizCard";
import {
  VOCABULARY_LEVELS,
  getQuizOptions,
  type VocabularyItem
} from "@/lib/data/sample-vocabulary";
import {
  fetchVocabularyFromSupabase,
  getProfileId,
  getProfileTargetLevel,
  profileLevelToVocabularyLevel,
  saveQuizResult
} from "@/lib/data/vocabulary-db";
import { logStudyActivity } from "@/lib/data/study-activity";
import {
  getGuestVocabularyCount,
  incrementGuestVocabularyCount,
  GUEST_VOCABULARY_LIMIT,
} from "@/lib/guest-usage";
import { GuestLimitPrompt } from "@/components/GuestLimitPrompt";
import { MODULE_COLORS } from "@/lib/constants/module-colors";

export default function VocabularyPage() {
  const [stage, setStage] = useState<"select" | "session" | "result">("select");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [levelLoaded, setLevelLoaded] = useState(false);
  const [showGuestLimit, setShowGuestLimit] = useState(false);
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [optionPool, setOptionPool] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileIdRef = useRef<string | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  // 目標級が設定されていればデフォルトで選択、未設定なら空のまま自分で選ぶ
  useEffect(() => {
    Promise.all([
      getProfileTargetLevel(),
      getProfileId(),
    ]).then(([targetLevel, profileId]) => {
      setLevelLoaded(true);
      setIsGuest(!profileId);
      if (!targetLevel) return;
      const vocabLevel = profileLevelToVocabularyLevel(targetLevel);
      if (VOCABULARY_LEVELS.includes(vocabLevel as (typeof VOCABULARY_LEVELS)[number])) {
        setSelectedLevel(vocabLevel);
      }
    });
  }, []);

  const startSession = async () => {
    setError(null);
    setShowGuestLimit(false);
    const pid = await getProfileId();
    profileIdRef.current = pid;
    if (!pid) {
      const count = getGuestVocabularyCount();
      if (count >= GUEST_VOCABULARY_LIMIT) {
        setShowGuestLimit(true);
        return;
      }
      incrementGuestVocabularyCount();
    }
    setLoading(true);
    try {
      // ログイン時は間違えた単語を優先、10問 + 誤答候補用に80語取得
      const pool = await fetchVocabularyFromSupabase(
        selectedLevel,
        10,
        80,
        pid
      );
      if (pool.length === 0) {
        setError("該当する単語がありません。別のレベルをお試しください。");
        setLoading(false);
        return;
      }
      const quizItems = pool.slice(0, 10);
      setItems(quizItems);
      setOptionPool(pool);
      setCurrentIndex(0);
      setCorrectCount(0);
      sessionStartRef.current = Date.now();
      setStage("session");
    } catch (e) {
      setError("単語の取得に失敗しました。しばらくしてから再試行してください。");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = items[currentIndex];
  const options = useMemo(
    () => (currentItem ? getQuizOptions(currentItem, optionPool) : []),
    [currentItem, optionPool]
  );

  const handleAnswer = async (isCorrect: boolean, vocabularyId: string) => {
    if (isCorrect) setCorrectCount((c) => c + 1);
    const pid = profileIdRef.current;
    if (pid) {
      await saveQuizResult(pid, vocabularyId, isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= items.length) {
      setStage("result");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // 結果画面に遷移したら学習時間を記録
  useEffect(() => {
    if (stage !== "result") return;
    const start = sessionStartRef.current;
    if (!start) return;
    const seconds = Math.round((Date.now() - start) / 1000);
    const pid = profileIdRef.current;
    if (pid && seconds > 0) {
      logStudyActivity(pid, "vocabulary_quiz", {
        seconds,
        question_count: items.length,
        correct_count: correctCount
      });
    }
    sessionStartRef.current = null;
  }, [stage, items.length, correctCount]);

  if (showGuestLimit) {
    return (
      <main className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-xl">
          <GuestLimitPrompt type="vocabulary" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="mx-auto max-w-xl">
        {stage === "select" && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <span
                className={`h-2 w-2 rounded-full ${MODULE_COLORS.vocabulary.dot}`}
              />
              単語クイズ
            </h1>
            <p className="text-sm text-slate-600">
              レベルを選んで学習を開始しましょう。選んだ級の単語から10問が出題されます。ログイン中は間違えた単語が優先して出題されます。
            </p>
            {isGuest && levelLoaded && (
              <p className="text-xs text-slate-500">
                ゲストの方は{GUEST_VOCABULARY_LIMIT}回までお試しいただけます。（残り{Math.max(0, GUEST_VOCABULARY_LIMIT - getGuestVocabularyCount())}回）
              </p>
            )}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                レベル
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="">
                  {levelLoaded ? "選択してください" : "読み込み中..."}
                </option>
                {VOCABULARY_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    英検{l}
                  </option>
                ))}
                <option value="全レベル">全レベル（混在）</option>
              </select>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="button"
              onClick={startSession}
              disabled={loading || !selectedLevel}
              className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${MODULE_COLORS.vocabulary.solid} ${MODULE_COLORS.vocabulary.solidHover}`}
            >
              {loading ? "読み込み中..." : "学習を開始"}
            </button>
            <div className="flex justify-center gap-4 text-sm">
              <Link
                href="/vocabulary/history"
                className={`${MODULE_COLORS.vocabulary.text} ${MODULE_COLORS.vocabulary.textHover}`}
              >
                過去の履歴を見る
              </Link>
              <Link
                href="/dashboard"
                className="text-slate-500 hover:text-slate-700"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        )}

        {stage === "session" && currentItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                {currentIndex + 1} / {items.length}
              </span>
              <Link href="/dashboard" className="hover:text-slate-900">
                終了
              </Link>
            </div>
            <VocabularyQuizCard
              key={currentItem.id}
              item={currentItem}
              options={options}
              onAnswer={(isCorrect) => handleAnswer(isCorrect, currentItem.id)}
              onNext={handleNext}
            />
          </div>
        )}

        {stage === "result" && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">学習完了</h1>
            <p className="text-3xl font-bold text-emerald-600">
              {correctCount} / {items.length} 問 正解
            </p>
            <p className="text-sm text-slate-600">
              お疲れさまです。続けて学習する場合は「もう一度」を押してください。
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={startSession}
                className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${MODULE_COLORS.vocabulary.solid} ${MODULE_COLORS.vocabulary.solidHover}`}
              >
                もう一度
              </button>
              <Link
                href="/dashboard"
                className="block w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
