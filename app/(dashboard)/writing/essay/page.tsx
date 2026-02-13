"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WritingEssayPage() {
  const [content, setContent] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // 仮の問題（シードデータ登録後にSupabaseから取得する）
  const prompt = {
    title: "英作文（サンプル）",
    prompt:
      "Do you like to watch movies?（あなたは映画を見るのが好きですか？）\n\nPlease answer the question and give two reasons."
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
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
          <h1 className="text-xl font-semibold text-slate-900">
            英作文（3級）
          </h1>
          <p className="text-xs text-slate-500">
            目安: 25〜35語 / 8〜12分
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-sm text-slate-800">
              {prompt.prompt}
            </p>
          </div>

          {!isStarted ? (
            <button
              type="button"
              onClick={startWriting}
              className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              書き始める
            </button>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  あなたの回答
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ここに英文を入力してください..."
                  rows={8}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-right text-xs text-slate-500">
                  {content.trim().split(/\s+/).filter(Boolean).length} 語
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  提出する（AI添削）
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
