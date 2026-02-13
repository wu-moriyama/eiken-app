"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  fetchRandomEmailPrompt,
  parseEmailPromptData,
  type WritingPrompt,
  type EmailPromptData
} from "@/lib/data/writing-db";

function getInstruction(emailFrom: string): string {
  return `あなたは、外国人の友達（${emailFrom}）から以下のEメールを受け取りました。
Eメールを読んで、それに対する返信Eメールを書きなさい。
あなたが書く返信Eメールの中で、友達（${emailFrom}）からの２つの質問（下線部）に対応する内容を、あなた自身で自由に考えて答えなさい。
あなたが書く返信Eメールの中で記入する英文の語数の目安は、15語から25語です。
解答が友達（${emailFrom}）のEメールに対応していないと判断された場合は、0点と採点されることがあります。友達のEメールの内容をよく読んでから答えてください。`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WritingEmailPage() {
  const [content, setContent] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchRandomEmailPrompt("3級").then((p) => {
      setPrompt(p ?? null);
      setLoading(false);
      if (!p) setError("問題の取得に失敗しました。");
    });
  }, []);

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
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-slate-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error || !prompt || !promptData) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
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
            英検3級 ライティング（Eメール）問題
          </h1>

          <div className="space-y-1 text-sm text-slate-700">
            <p className="whitespace-pre-wrap">{getInstruction(promptData.emailFrom)}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              {promptData.emailFrom}からのメール
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-800">
                {promptData.emailContent}
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
              目安: 15〜25語 {isStarted && `（現在 ${wordCount} 語）`}
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
          )}
        </div>
      </div>
    </main>
  );
}
