"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/logo-aiken.png"
            alt="AiKen"
            width={120}
            height={36}
            className="h-9 w-auto"
          />
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
        © 2025 AiKen
      </p>
    </footer>
  );
}
