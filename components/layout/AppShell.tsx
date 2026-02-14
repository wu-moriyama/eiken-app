"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { checkIsAdmin } from "@/lib/data/admin-db";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };
    void checkAuth();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => void checkAuth());
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDrawerOpen(false);
    router.push("/");
  };

  const navLinks = (
    <>
      <Link
        href="/dashboard"
        onClick={() => setDrawerOpen(false)}
        className="hover:text-brand-300"
      >
        ダッシュボード
      </Link>

      {/* 単語 ドロップダウン */}
      <div className="group relative">
        <button
          type="button"
          className="flex items-center gap-0.5 hover:text-brand-300"
        >
          単語
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="invisible absolute left-0 top-full pt-0.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          <div className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-lg">
            <Link
              href="/vocabulary"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left hover:bg-slate-800 hover:text-brand-300"
            >
              単語クイズ
            </Link>
            <Link
              href="/vocabulary/history"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left hover:bg-slate-800 hover:text-brand-300"
            >
              学習履歴
            </Link>
          </div>
        </div>
      </div>

      {/* ライティング ドロップダウン */}
      <div className="group relative">
        <button
          type="button"
          className="flex items-center gap-0.5 hover:text-brand-300"
        >
          ライティング
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="invisible absolute left-0 top-full pt-0.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          <div className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-lg">
            <Link
              href="/writing"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left hover:bg-slate-800 hover:text-brand-300"
            >
              英文添削
            </Link>
            <Link
              href="/writing/history"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left hover:bg-slate-800 hover:text-brand-300"
            >
              学習履歴
            </Link>
          </div>
        </div>
      </div>

      <Link
        href="/badges"
        onClick={() => setDrawerOpen(false)}
        className="hover:text-brand-300"
      >
        バッヂ
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => setDrawerOpen(false)}
          className="text-amber-400 hover:text-amber-300"
        >
          管理画面
        </Link>
      )}
      <Link
        href="/profile"
        onClick={() => setDrawerOpen(false)}
        className="hover:text-brand-300"
      >
        プロフィール
      </Link>
      {isLoggedIn && (
        <button
          type="button"
          onClick={handleLogout}
          className="text-slate-400 hover:text-slate-200"
        >
          ログアウト
        </button>
      )}
    </>
  );

  const logoHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href={logoHref}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <span className="rounded-md bg-brand-500 px-2 py-1 text-xs">EIKEN</span>
            <span className="hidden sm:inline">英検対策オールインワン</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-3 text-xs text-slate-300">
            {navLinks}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 md:hidden"
            aria-label="メニューを開く"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer overlay */}
      {drawerOpen && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setDrawerOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            aria-label="メニューを閉じる"
          />
          <aside
            className="fixed right-0 top-0 z-50 h-full w-64 border-l border-slate-800 bg-slate-950 px-4 py-6 shadow-xl md:hidden"
            aria-label="ナビゲーションメニュー"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-200">
                メニュー
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                aria-label="閉じる"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-sm text-slate-300">
              <Link
                href="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                ダッシュボード
              </Link>
              <div className="rounded-lg px-3 py-2 text-slate-400">単語</div>
              <Link
                href="/vocabulary"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                単語クイズ
              </Link>
              <Link
                href="/vocabulary/history"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                学習履歴
              </Link>
              <div className="rounded-lg px-3 py-2 text-slate-400">ライティング</div>
              <Link
                href="/writing"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                英文添削
              </Link>
              <Link
                href="/writing/history"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                学習履歴
              </Link>
              <Link
                href="/badges"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                バッヂ
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg px-3 py-2 text-amber-400 hover:bg-slate-800 hover:text-amber-300"
                >
                  管理画面
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                プロフィール
              </Link>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left hover:bg-slate-800 hover:text-brand-300"
                >
                  ログアウト
                </button>
              )}
            </nav>
          </aside>
        </>
      )}

      <main>{children}</main>
    </div>
  );
}
