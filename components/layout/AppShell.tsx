"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
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
      <Link
        href="/vocabulary"
        onClick={() => setDrawerOpen(false)}
        className="hover:text-brand-300"
      >
        単語
      </Link>
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
              <Link
                href="/vocabulary"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-brand-300"
              >
                単語
              </Link>
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
