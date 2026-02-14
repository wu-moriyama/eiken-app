"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-900"
        >
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs text-white">
            EIKEN
          </span>
          英検対策オールインワン
        </Link>
        <div className="flex gap-6 text-sm text-slate-600">
          <Link href="/login" className="hover:text-slate-900">
            ログイン
          </Link>
          <Link href="/signup" className="hover:text-slate-900">
            会員登録
          </Link>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        © 2025 英検対策オールインワン
      </p>
    </footer>
  );
}
