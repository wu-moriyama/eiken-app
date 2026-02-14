import { supabase } from "@/lib/supabase/client";

/** 管理者かどうか */
export async function checkIsAdmin(): Promise<boolean> {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return data?.role === "admin";
}

/** 管理者用: ユーザー一覧（メール含む） */
export interface AdminUser {
  id: string;
  display_id: number;
  auth_user_id: string;
  email: string | null;
  display_name: string | null;
  target_level: string | null;
  role: string;
  avatar_url: string | null;
  avatar_style: string | null;
  created_at: string;
  total_study_seconds: number;
  current_streak: number;
}

export async function adminGetUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.rpc("admin_get_users");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    display_id: (r.display_id as number) ?? 0,
    auth_user_id: r.auth_user_id as string,
    email: (r.email as string) ?? null,
    display_name: (r.display_name as string) ?? null,
    target_level: (r.target_level as string) ?? null,
    role: (r.role as string) ?? "user",
    avatar_url: (r.avatar_url as string) ?? null,
    avatar_style: (r.avatar_style as string) ?? null,
    created_at: r.created_at as string,
    total_study_seconds: (r.total_study_seconds as number) ?? 0,
    current_streak: (r.current_streak as number) ?? 0
  }));
}

/** 管理者用: ユーザー詳細（user_profiles の更新用） */
export async function adminGetUserProfile(profileId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, auth_user_id, display_name, target_level, role, created_at")
    .eq("id", profileId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/** 管理者用: ユーザープロフィール更新 */
export async function adminUpdateUserProfile(
  profileId: string,
  updates: { display_name?: string | null; target_level?: string | null; role?: string }
) {
  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", profileId);

  if (error) throw new Error(error.message);
}

// ========== 単語管理 ==========

export interface VocabularyItem {
  id: number;
  level: string;
  word: string;
  meaning_ja: string;
  part_of_speech: string | null;
  category: string | null;
  pronunciation: string | null;
  example_en: string | null;
  example_ja: string | null;
}

export async function adminGetVocabulary(): Promise<VocabularyItem[]> {
  const all: VocabularyItem[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("id, level, word, meaning_ja, part_of_speech, category, pronunciation, example_en, example_ja")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    for (const r of data) {
      all.push({
        id: r.id as number,
        level: r.level as string,
        word: r.word as string,
        meaning_ja: r.meaning_ja as string,
        part_of_speech: (r.part_of_speech as string) ?? null,
        category: (r.category as string) ?? null,
        pronunciation: (r.pronunciation as string) ?? null,
        example_en: (r.example_en as string) ?? null,
        example_ja: (r.example_ja as string) ?? null
      });
    }
    hasMore = data.length >= pageSize;
    offset += pageSize;
  }

  return all;
}

export async function adminGetVocabularyById(id: number) {
  const { data, error } = await supabase
    .from("vocabulary")
    .select("id, level, word, meaning_ja, part_of_speech, category, pronunciation, example_en, example_ja")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export interface VocabularyInput {
  level: string;
  word: string;
  meaning_ja: string;
  part_of_speech?: string | null;
  category?: string | null;
  pronunciation?: string | null;
  example_en?: string | null;
  example_ja?: string | null;
}

export async function adminCreateVocabulary(input: VocabularyInput) {
  const { data, error } = await supabase
    .from("vocabulary")
    .insert({
      level: input.level,
      word: input.word,
      meaning_ja: input.meaning_ja,
      part_of_speech: input.part_of_speech ?? null,
      category: input.category ?? null,
      pronunciation: input.pronunciation ?? null,
      example_en: input.example_en ?? null,
      example_ja: input.example_ja ?? null
    })
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.id;
}

export async function adminUpdateVocabulary(id: number, input: VocabularyInput) {
  const { error } = await supabase
    .from("vocabulary")
    .update({
      level: input.level,
      word: input.word,
      meaning_ja: input.meaning_ja,
      part_of_speech: input.part_of_speech ?? null,
      category: input.category ?? null,
      pronunciation: input.pronunciation ?? null,
      example_en: input.example_en ?? null,
      example_ja: input.example_ja ?? null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function adminDeleteVocabulary(id: number) {
  const { error } = await supabase
    .from("vocabulary")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// ========== ライティング問題管理 ==========

export interface WritingPromptItem {
  id: number;
  level: string;
  prompt_type: string;
  title: string;
  prompt: string;
  word_count_min: number | null;
  word_count_max: number | null;
  time_limit_min_seconds: number | null;
  time_limit_max_seconds: number | null;
}

export async function adminGetWritingPrompts(): Promise<WritingPromptItem[]> {
  const all: WritingPromptItem[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from("writing_prompts")
      .select("id, level, prompt_type, title, prompt, word_count_min, word_count_max, time_limit_min_seconds, time_limit_max_seconds")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    for (const r of data) {
      all.push({
        id: r.id as number,
        level: r.level as string,
        prompt_type: (r.prompt_type as string) ?? "essay",
        title: r.title as string,
        prompt: r.prompt as string,
        word_count_min: (r.word_count_min as number) ?? null,
        word_count_max: (r.word_count_max as number) ?? null,
        time_limit_min_seconds: (r.time_limit_min_seconds as number) ?? null,
        time_limit_max_seconds: (r.time_limit_max_seconds as number) ?? null
      });
    }
    hasMore = data.length >= pageSize;
    offset += pageSize;
  }

  return all;
}

export async function adminGetWritingPromptById(id: number) {
  const { data, error } = await supabase
    .from("writing_prompts")
    .select("id, level, prompt_type, title, prompt, word_count_min, word_count_max, time_limit_min_seconds, time_limit_max_seconds")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export interface WritingPromptInput {
  level: string;
  prompt_type: "essay" | "email";
  title: string;
  prompt: string;
  word_count_min?: number | null;
  word_count_max?: number | null;
  time_limit_min_seconds?: number | null;
  time_limit_max_seconds?: number | null;
}

export async function adminCreateWritingPrompt(input: WritingPromptInput) {
  const { data, error } = await supabase
    .from("writing_prompts")
    .insert({
      level: input.level,
      prompt_type: input.prompt_type,
      title: input.title,
      prompt: input.prompt,
      word_count_min: input.word_count_min ?? null,
      word_count_max: input.word_count_max ?? null,
      time_limit_min_seconds: input.time_limit_min_seconds ?? null,
      time_limit_max_seconds: input.time_limit_max_seconds ?? null
    })
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.id;
}

export async function adminUpdateWritingPrompt(id: number, input: WritingPromptInput) {
  const { error } = await supabase
    .from("writing_prompts")
    .update({
      level: input.level,
      prompt_type: input.prompt_type,
      title: input.title,
      prompt: input.prompt,
      word_count_min: input.word_count_min ?? null,
      word_count_max: input.word_count_max ?? null,
      time_limit_min_seconds: input.time_limit_min_seconds ?? null,
      time_limit_max_seconds: input.time_limit_max_seconds ?? null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function adminDeleteWritingPrompt(id: number) {
  const { error } = await supabase
    .from("writing_prompts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
