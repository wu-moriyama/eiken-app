"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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
            priority
          />
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
            className="rounded-full bg-[#50c2cb] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#46adb5]"
          >
            会員登録
          </Link>
        </div>
      </div>
    </header>
  );
}
