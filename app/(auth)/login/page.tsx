"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsLoading(false);

    if (signInError || !data.session) {
      setError(signInError?.message ?? "サインインに失敗しました。");
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : undefined
      }
    });

    setIsLoading(false);

    if (oauthError) {
      setError(oauthError.message);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            サインイン
          </h1>
          <p className="text-sm text-slate-600">
            英検対策ダッシュボードにアクセスするには、アカウントにサインインしてください。
          </p>
        </div>
  
        {/* フォーム・ボタンはクラスだけ調整 */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>
  
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="8文字以上のパスワード"
            />
          </div>
  
          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
  
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60"
          >
            {isLoading ? "サインイン中..." : "メールアドレスでサインイン"}
          </button>
        </form>
  
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px flex-1 bg-slate-200" />
          <span>または</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
  
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
        >
          <FcGoogle className="h-5 w-5" />
          <span>Google でサインイン</span>
        </button>
  
        <div className="space-y-2">
          <p className="text-[11px] leading-snug text-slate-500">
            初回サインイン時にアカウントが自動的に作成されます。登録できるメールドメインや
            Google アカウントの制限は Supabase 側の設定で制御できます。
          </p>
          <p className="text-[11px] leading-snug text-slate-500">
            まだアカウントをお持ちでない方は{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-semibold text-blue-600 hover:underline"
            >
              新規登録
            </button>
            してください。
          </p>
        </div>
      </div>
    </main>
  );
}

