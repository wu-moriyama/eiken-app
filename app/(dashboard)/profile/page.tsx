"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type LevelOption =
  | "英検5級"
  | "英検4級"
  | "英検3級"
  | "英検準2級"
  | "英検2級"
  | "英検準1級"
  | "英検1級";

const LEVEL_OPTIONS: LevelOption[] = [
  "英検5級",
  "英検4級",
  "英検3級",
  "英検準2級",
  "英検2級",
  "英検準1級",
  "英検1級"
];

import { PRESET_AVATARS } from "@/lib/constants/avatars";

export default function ProfilePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [targetLevel, setTargetLevel] = useState<LevelOption>("英検2級");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [canEditEmail, setCanEditEmail] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState<string | null>(null);
  const [avatarTab, setAvatarTab] = useState<"preset" | "upload">("preset");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setRequiresLogin(true);
        setIsLoading(false);
        return;
      }

      setEmail(user.email ?? "");
      setOriginalEmail(user.email ?? "");

      const provider = (user.app_metadata.provider || "") as string;
      const isGoogle =
        provider === "google" ||
        (Array.isArray(user.identities) &&
          user.identities.some((id: any) => id.provider === "google"));
      setCanEditEmail(!isGoogle);

      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, display_name, target_level, avatar_url, avatar_style")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (profileError) {
        // RLS などで失敗しても、とりあえず表示名だけ編集できるようにする
        // eslint-disable-next-line no-console
        console.warn("[profile] failed to load profile", profileError.message);
      }

      if (data) {
        setProfileId(data.id);
        setDisplayName(data.display_name ?? "");
        if (data.target_level && LEVEL_OPTIONS.includes(data.target_level)) {
          setTargetLevel(data.target_level as LevelOption);
        }
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.avatar_style) setAvatarStyle(data.avatar_style);
      }

      setIsLoading(false);
    };

    void load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setRequiresLogin(true);
      setIsSaving(false);
      return;
    }

    try {
      // メールアドレス変更（Google ログインの場合は不可）
      if (canEditEmail && email && email !== originalEmail) {
        const { error: emailError } = await supabase.auth.updateUser({
          email
        });
        if (emailError) throw emailError;
      }

      if (profileId) {
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            display_name: displayName || null,
            target_level: targetLevel,
            avatar_url: avatarUrl,
            avatar_style: avatarStyle
          })
          .eq("id", profileId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            auth_user_id: user.id,
            display_name: displayName || null,
            target_level: targetLevel,
            avatar_url: avatarUrl,
            avatar_style: avatarStyle
          })
          .select("id")
          .maybeSingle();

        if (insertError) throw insertError;
        if (data?.id) setProfileId(data.id);
      }

      setMessage("プロフィールを保存しました。");
    } catch (err: any) {
      setError(err?.message ?? "プロフィールの保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setMessage(null);
    setIsUploadingAvatar(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setRequiresLogin(true);
      setIsUploadingAvatar(false);
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const path = `${user.id}/avatar.${fileExt ?? "png"}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      setAvatarStyle("custom");
      setMessage("アバター画像を更新しました。");
    } catch (err: any) {
      setError(err?.message ?? "アバター画像のアップロードに失敗しました。");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
        <p className="text-sm text-slate-600">読み込み中です...</p>
      </main>
    );
  }

  if (requiresLogin) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <h1 className="text-lg font-semibold text-slate-900">
            ログインが必要です
          </h1>
          <p className="text-sm text-slate-600">
            プロフィールを編集するには、アカウントにサインインしてください。
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            ログインページへ移動
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            プロフィール設定
          </h1>
          <p className="text-sm text-slate-600">
            ダッシュボードの表示名・メールアドレス・目標レベル・アバターを設定できます。
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!canEditEmail}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100 disabled:text-slate-500"
            />
            {!canEditEmail && (
              <p className="text-[11px] text-slate-500">
                Google でサインインしたアカウントのメールアドレスはここから変更できません。
                Google アカウント側の設定をご利用ください。
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              表示名（ニックネーム）
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="例）もりやま、Taro など"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              アバター
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 overflow-hidden">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : avatarStyle &&
                    PRESET_AVATARS.some((a) => a.id === avatarStyle) ? (
                    (() => {
                      const preset = PRESET_AVATARS.find(
                        (a) => a.id === avatarStyle
                      )!;
                      return (
                        <span
                          className={`flex h-full w-full items-center justify-center text-lg ${preset.bg} ${preset.fg}`}
                        >
                          {preset.emoji}
                        </span>
                      );
                    })()
                  ) : displayName ? (
                    displayName[0]?.toUpperCase()
                  ) : (
                    "A"
                  )}
                </div>
                <div className="flex flex-col gap-2 text-[11px] text-slate-600">
                  <div className="inline-flex rounded-full bg-slate-100 p-[2px] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAvatarTab("preset")}
                      className={`px-3 py-1 rounded-full ${
                        avatarTab === "preset"
                          ? "bg-white text-slate-900 border border-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      プリセット
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarTab("upload")}
                      className={`px-3 py-1 rounded-full ${
                        avatarTab === "upload"
                          ? "bg-white text-slate-900 border border-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      アップロード
                    </button>
                  </div>
                  {avatarTab === "upload" && (
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                        画像をアップロード
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarFileChange}
                          disabled={isUploadingAvatar}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500">
                        画像は Supabase Storage の avatars バケットに保存されます。
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {avatarTab === "preset" && (
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => {
                        setAvatarStyle(a.id);
                        setAvatarUrl(null);
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg ${
                        avatarStyle === a.id
                          ? "border-blue-500 shadow-sm"
                          : "border-slate-200"
                      } ${a.bg} ${a.fg}`}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">
              目標レベル
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as LevelOption)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            >
              {LEVEL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
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
            disabled={isSaving}
            className="flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60"
          >
            {isSaving ? "保存中..." : "プロフィールを保存"}
          </button>
        </form>
      </div>
    </main>
  );
}

