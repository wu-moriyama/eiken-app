"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VocabularyItem } from "@/lib/data/sample-vocabulary";
import type { QuizOption } from "@/lib/data/sample-vocabulary";
import { ReadAloudButton } from "@/components/features/writing/ReadAloudButton";
import { getProfileId } from "@/lib/data/vocabulary-db";
import { MODULE_COLORS } from "@/lib/constants/module-colors";
import { logReadingAloudActivity } from "@/lib/data/study-activity";

interface VocabularyQuizCardProps {
  item: VocabularyItem;
  options: QuizOption[];
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

function useSpeech(word: string) {
  return useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [word]);
}

export function VocabularyQuizCard({
  item,
  options,
  onAnswer,
  onNext
}: VocabularyQuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const speak = useSpeech(item.word);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelectedIndex(index);
    setRevealed(true);
    onAnswer(options[index].isCorrect);
  };

  const getOptionStyle = (index: number) => {
    if (!revealed) {
      return "border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400";
    }
    const opt = options[index];
    if (opt.isCorrect) {
      return "border-[#F99F66] bg-[#F99F66]/15 text-[#B36A3D]";
    }
    if (selectedIndex === index) {
      return "border-red-400 bg-red-50 text-red-900";
    }
    return "border-slate-200 bg-slate-100 text-slate-700";
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${MODULE_COLORS.vocabulary.badge}`}
          >
            英検 {item.level}
          </span>
          <button
            type="button"
            onClick={speak}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="発音を聞く"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          </button>
        </div>
        <p className="text-2xl font-semibold text-slate-900">{item.word}</p>
        {item.pronunciation && (
          <p className="mt-1 text-sm text-slate-500 font-mono">{item.pronunciation}</p>
        )}
        <p className="mt-4 text-sm text-slate-600">意味を選んでください</p>
      </div>

      <div className="grid gap-3">
        {options.map((opt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(index)}
            disabled={revealed}
            className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${getOptionStyle(index)}`}
          >
            <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-slate-800">
              {["A", "B", "C", "D"][index]}
            </span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                {options[selectedIndex!]?.isCorrect ? "正解！" : "不正解"}
              </p>
              {options[selectedIndex!]?.isCorrect === false && (
                <p className="mt-1 text-sm text-slate-600">
                  正解: <span className="font-semibold">{item.meaning_ja}</span>
                </p>
              )}
              {(item.example_en || item.example_ja) && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-amber-700">
                    例文を音読してみよう！聞いてから声に出して読むと学習効果が上がります。
                  </p>
                  {item.example_en && (
                    <div className="flex flex-wrap items-center gap-2">
                        <ReadAloudButton
                          text={item.example_en}
                          label="例文を聞く"
                          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          onSpeakStart={() => {
                            getProfileId().then((pid) => {
                              if (pid) void logReadingAloudActivity(pid);
                            });
                          }}
                        />
                      <span className="text-sm text-slate-600">{item.example_en}</span>
                    </div>
                  )}
                  {item.example_ja && (
                    <p className="text-sm italic text-slate-500">{item.example_ja}</p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onNext}
              className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${MODULE_COLORS.vocabulary.solid} ${MODULE_COLORS.vocabulary.solidHover}`}
            >
              次へ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
