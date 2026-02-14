"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { checkIsAdmin } from "@/lib/data/admin-db";
import { getMonthlyBackgroundUrl } from "@/lib/data/monthly-backgrounds";
import { MODULE_COLORS } from "@/lib/constants/module-colors";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const url = await getMonthlyBackgroundUrl();
        if (mounted) setBackgroundUrl(url);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("[AppShell] background load error", err);
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!mounted) return;
        setIsLoggedIn(!!user);
        if (user) {
          const admin = await checkIsAdmin();
          if (!mounted) return;
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        throw err;
      }
    };
    void checkAuth().catch((err) => {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[AppShell] checkAuth error", err);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      void checkAuth().catch((err) => {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("[AppShell] checkAuth error", err);
      });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
        className="text-slate-800 hover:text-brand-600"
      >
        ダッシュボード
      </Link>

      {/* 単語 ドロップダウン */}
      <div className="group relative">
        <button
          type="button"
          className="flex items-center gap-0.5 text-slate-800 hover:text-[#F99F66]"
        >
          <span
            className={`mr-1 h-1.5 w-1.5 shrink-0 rounded-full ${MODULE_COLORS.vocabulary.dot}`}
          />
          単語
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="invisible absolute left-0 top-full pt-0.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          <div className="min-w-[140px] rounded-lg border border-slate-200 bg-white/95 py-1 shadow-lg backdrop-blur-sm">
            <Link
              href="/vocabulary"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left text-slate-800 hover:bg-slate-100 hover:text-[#F99F66]"
            >
              単語クイズ
            </Link>
            <Link
              href="/vocabulary/history"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left text-slate-800 hover:bg-slate-100 hover:text-[#F99F66]"
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
          className="flex items-center gap-0.5 text-slate-800 hover:text-[#A6D472]"
        >
          <span
            className={`mr-1 h-1.5 w-1.5 shrink-0 rounded-full ${MODULE_COLORS.writing.dot}`}
          />
          ライティング
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="invisible absolute left-0 top-full pt-0.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          <div className="min-w-[140px] rounded-lg border border-slate-200 bg-white/95 py-1 shadow-lg backdrop-blur-sm">
            <Link
              href="/writing"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left text-slate-800 hover:bg-slate-100 hover:text-[#A6D472]"
            >
              英文添削
            </Link>
            <Link
              href="/writing/history"
              onClick={() => setDrawerOpen(false)}
              className="block px-4 py-2 text-left text-slate-800 hover:bg-slate-100 hover:text-[#A6D472]"
            >
              学習履歴
            </Link>
          </div>
        </div>
      </div>

      <Link
        href="/badges"
        onClick={() => setDrawerOpen(false)}
        className="text-slate-800 hover:text-brand-600"
      >
        バッヂ
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => setDrawerOpen(false)}
          className="text-slate-800 hover:text-amber-600"
        >
          管理画面
        </Link>
      )}
      <Link
        href="/profile"
        onClick={() => setDrawerOpen(false)}
        className="text-slate-800 hover:text-brand-600"
      >
        プロフィール
      </Link>
      {isLoggedIn && (
        <button
          type="button"
          onClick={handleLogout}
          className="text-slate-600 hover:text-slate-900"
        >
          ログアウト
        </button>
      )}
    </>
  );

  const logoHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="relative z-20 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href={logoHref}
            className="flex items-center gap-2 text-sm font-bold text-slate-900"
          >
            <span className="rounded-md bg-brand-500 px-2 py-1 text-xs text-white">EIKEN</span>
            <span className="hidden sm:inline">英検対策オールインワン</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-800">
            {navLinks}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-800 hover:bg-slate-200/60 md:hidden"
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
            className="fixed right-0 top-0 z-50 h-full w-64 border-l border-slate-200 bg-white/95 px-4 py-6 shadow-xl backdrop-blur-md md:hidden"
            aria-label="ナビゲーションメニュー"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-slate-900">
                メニュー
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                aria-label="閉じる"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
              <Link
                href="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-brand-600"
              >
                ダッシュボード
              </Link>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${MODULE_COLORS.vocabulary.dot}`}
                />
                単語
              </div>
              <Link
                href="/vocabulary"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-100 hover:text-[#F99F66]"
              >
                単語クイズ
              </Link>
              <Link
                href="/vocabulary/history"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-100 hover:text-[#F99F66]"
              >
                学習履歴
              </Link>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${MODULE_COLORS.writing.dot}`}
                />
                ライティング
              </div>
              <Link
                href="/writing"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-100 hover:text-[#A6D472]"
              >
                英文添削
              </Link>
              <Link
                href="/writing/history"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg pl-6 pr-3 py-2 hover:bg-slate-100 hover:text-[#A6D472]"
              >
                学習履歴
              </Link>
              <Link
                href="/badges"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-brand-600"
              >
                バッヂ
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-amber-600"
                >
                  管理画面
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-brand-600"
              >
                プロフィール
              </Link>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left hover:bg-slate-100 hover:text-slate-900"
                >
                  ログアウト
                </button>
              )}
            </nav>
          </aside>
        </>
      )}

      {/* 固定背景レイヤー（全ページ共通） */}
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={
          backgroundUrl
            ? {
                backgroundImage: `linear-gradient(rgba(248,250,252,0.9) 0%, rgba(248,250,252,0.8) 100%), url(${backgroundUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
              }
            : { backgroundColor: "rgb(248, 250, 252)" }
        }
      />

      <main className="relative z-10 min-h-[calc(100vh-56px)]">{children}</main>
    </div>
  );
}
