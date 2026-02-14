import { supabase } from "@/lib/supabase/client";

export interface AvatarPreset {
  id: string;
  name: string;
  image_url: string;
}

/** 全ユーザーがプロフィールで選択可能なアバタープリセット一覧 */
export async function getAvatarPresets(): Promise<AvatarPreset[]> {
  const { data, error } = await supabase
    .from("avatar_presets")
    .select("id, name, image_url")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return [];
  return (data ?? []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    image_url: r.image_url as string
  }));
}
