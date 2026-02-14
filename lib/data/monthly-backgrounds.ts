import { supabase } from "@/lib/supabase/client";

/** 指定月の背景画像URLを取得（省略時は今月） */
export async function getMonthlyBackgroundUrl(
  month?: number
): Promise<string | null> {
  const m = month ?? new Date().getMonth() + 1;
  const { data, error } = await supabase
    .from("monthly_backgrounds")
    .select("image_url")
    .eq("month", m)
    .maybeSingle();

  if (error) return null;
  const url = data?.image_url;
  return typeof url === "string" && url.trim() ? url : null;
}
