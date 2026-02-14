"use client";

import { useState, useCallback, useEffect } from "react";

/** 添削文の[[...]]マーカーを除去して音読用のテキストを取得 */
function getPlainTextForSpeech(text: string): string {
  return text.replace(/\[\[([^\]]+)\]\]/g, "$1").trim();
}

interface ReadAloudButtonProps {
  text: string;
  label?: string;
  className?: string;
  /** 音読開始時に呼ばれる（学習時間記録用） */
  onSpeakStart?: () => void | Promise<void>;
}

export function ReadAloudButton({
  text,
  label = "音声で聞く",
  className = "",
  onSpeakStart,
}: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  const plainText = getPlainTextForSpeech(text);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(() => {
    if (!plainText) return;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    if (isSpeaking) {
      stop();
      return;
    }
    onSpeakStart?.();
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [plainText, isSpeaking, stop]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    return () => {
      stop();
    };
  }, [stop]);

  if (!supported || !plainText) return null;

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${className}`}
      aria-label={isSpeaking ? "読み上げを停止" : label}
      title={isSpeaking ? "読み上げを停止" : label}
    >
      {isSpeaking ? (
        <>
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <span>停止</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
