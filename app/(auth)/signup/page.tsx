"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : undefined
      }
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.user && !data.session) {
      // メール確認が有効な場合
      setMessage("確認用メールを送信しました。メール内のリンクからサインインしてください。");
      return;
    }

    // その場でセッションが作成される設定の場合
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            新規登録
          </h1>
          <p className="text-sm text-slate-600">
            メールアドレスとパスワードを登録して、英検対策ダッシュボードを利用開始しましょう。
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              パスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                placeholder="8文字以上のパスワード"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? (
                  <HiEyeSlash className="h-4 w-4" />
                ) : (
                  <HiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-[#50c2cb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#46adb5] disabled:opacity-60"
          >
            {isLoading ? "登録中..." : "アカウントを作成"}
          </button>
        </form>

        <p className="text-xs text-slate-600">
          すでにアカウントをお持ちの方は{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-[#50c2cb] hover:underline"
          >
            サインイン
          </button>
          してください。
        </p>
      </div>
    </main>
  );
}

