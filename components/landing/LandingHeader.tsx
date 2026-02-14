"use client";

import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-900"
        >
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs text-white">
            EIKEN
          </span>
          <span className="hidden sm:inline">英検対策オールインワン</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            会員登録
          </Link>
        </div>
      </div>
    </header>
  );
}
