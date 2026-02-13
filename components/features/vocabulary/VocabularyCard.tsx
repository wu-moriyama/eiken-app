"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VocabularyItem } from "@/lib/data/sample-vocabulary";

interface VocabularyCardProps {
  item: VocabularyItem;
  onRate: (remembered: boolean) => void;
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

export function VocabularyCard({ item, onRate }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const speak = useSpeech(item.word);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="relative h-64 [perspective:1000px] cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front: 英単語 */}
          <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-white shadow-lg flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
              英検 {item.level}
            </span>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-slate-900">{item.word}</p>
              <button
                type="button"
                onClick={handleSpeak}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                aria-label="発音を聞く"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">タップして意味を表示</p>
          </div>

          {/* Back: 意味・発音・例文 */}
          <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 shadow-lg flex flex-col items-center justify-center p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-2">
              英検 {item.level}
            </span>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-xl font-semibold text-slate-900">{item.word}</p>
              <button
                type="button"
                onClick={handleSpeak}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
                aria-label="発音を聞く"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              </button>
            </div>
            {item.pronunciation && (
              <p className="mt-1 text-sm text-slate-500 font-mono">{item.pronunciation}</p>
            )}
            <p className="mt-1 text-lg font-medium text-slate-700">{item.meaning_ja}</p>
            {(item.example_en || item.example_ja) && (
              <div className="mt-3 space-y-1 text-left w-full">
                {item.example_en && (
                  <p className="text-sm text-slate-600">{item.example_en}</p>
                )}
                {item.example_ja && (
                  <p className="text-sm text-slate-500 italic">{item.example_ja}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex gap-3 justify-center"
          >
            <button
              type="button"
              onClick={() => onRate(false)}
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              まだ
            </button>
            <button
              type="button"
              onClick={() => onRate(true)}
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              覚えた
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
