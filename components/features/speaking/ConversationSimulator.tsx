"use client";

import { useSpeechRecognition } from "@/hooks/useSpeech";

export function ConversationSimulator() {
  const { isSupported, isListening, transcript, start, stop } =
    useSpeechRecognition("en-US");

  if (!isSupported) {
    return (
      <p className="text-sm text-red-300">
        このブラウザは Web Speech API に対応していません。
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold">スピーキング練習（デモ）</h2>
      <p className="text-sm text-slate-300">
        「自己紹介」をテーマに、英語で話してみましょう。あなたの音声がテキストとして表示されます。
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={start}
          disabled={isListening}
          className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isListening ? "Listening..." : "録音開始"}
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!isListening}
          className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-100 disabled:opacity-50"
        >
          停止
        </button>
      </div>
      <div className="min-h-[80px] rounded-lg bg-slate-950/60 p-3 text-sm text-slate-100">
        {transcript || "ここに認識されたテキストが表示されます。"}
      </div>
    </div>
  );
}

