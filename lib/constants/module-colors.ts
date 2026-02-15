/**
 * 学習モジュールごとの固定カラー（カラーチャート準拠）
 * 単語・ライティング・リーディング・リスニング・スピーキングをカラフルに区別
 *
 * チャートの色: #A77CBF(紫) #F57A9C(ピンク) #F99F66(オレンジ) #FFD758(黄) #A6D472(緑) #50c2cb(青・キーカラー)
 */
export type ModuleKey =
  | "vocabulary"
  | "writing"
  | "reading"
  | "listening"
  | "speaking";

export const MODULE_COLORS: Record<
  ModuleKey,
  {
    /** カードのバッジ・アクセント背景 */
    badge: string;
    /** メインのテキスト・リンク色 */
    text: string;
    /** ホバー時のテキスト色 */
    textHover: string;
    /** カードのボーダー・左ライン */
    border: string;
    /** 左アクセントライン（border-l-4 用） */
    borderLeft: string;
    /** カードホバー時の背景 */
    bgHover: string;
    /** カードホバー時のみ背景色（border変更なし） */
    hoverBg: string;
    /** ドット・インディケータ */
    dot: string;
    /** 暗めの背景（カード全体など） */
    bg: string;
    /** ナビ・ダークモード用の強調色 */
    accent: string;
    /** ナビホバー色 */
    accentHover: string;
    /** ボタンなど塗りつぶし用 */
    solid: string;
    solidHover: string;
  }
> = {
  vocabulary: {
    badge: "bg-[#F99F66]/20 text-[#C77A3D] border-[#F99F66]/40",
    text: "text-[#D98A45]",
    textHover: "hover:text-[#F99F66]",
    border: "border-[#F99F66]/50",
    borderLeft: "border-l-[#F99F66]",
    bgHover: "hover:border-[#F99F66]/50 hover:bg-[#F99F66]/10",
    hoverBg: "hover:bg-[#F99F66]/8",
    dot: "bg-[#F99F66]",
    bg: "bg-[#F99F66]/10",
    accent: "text-[#F99F66]",
    accentHover: "hover:text-[#FFB380]",
    solid: "bg-[#F99F66]",
    solidHover: "hover:bg-[#E08F55]"
  },
  writing: {
    badge: "bg-[#A6D472]/25 text-[#5A8A3A] border-[#A6D472]/50",
    text: "text-[#7AB54D]",
    textHover: "hover:text-[#A6D472]",
    border: "border-[#A6D472]/50",
    borderLeft: "border-l-[#A6D472]",
    bgHover: "hover:border-[#A6D472]/50 hover:bg-[#A6D472]/15",
    hoverBg: "hover:bg-[#A6D472]/8",
    dot: "bg-[#A6D472]",
    bg: "bg-[#A6D472]/15",
    accent: "text-[#A6D472]",
    accentHover: "hover:text-[#B8E08A]",
    solid: "bg-[#A6D472]",
    solidHover: "hover:bg-[#96C462]"
  },
  reading: {
    badge: "bg-[#50c2cb]/20 text-[#2a6e73] border-[#50c2cb]/40",
    text: "text-[#46adb5]",
    textHover: "hover:text-[#50c2cb]",
    border: "border-[#50c2cb]/50",
    borderLeft: "border-l-[#50c2cb]",
    bgHover: "hover:border-[#50c2cb]/50 hover:bg-[#50c2cb]/10",
    hoverBg: "hover:bg-[#50c2cb]/8",
    dot: "bg-[#50c2cb]",
    bg: "bg-[#50c2cb]/10",
    accent: "text-[#50c2cb]",
    accentHover: "hover:text-[#66cfd5]",
    solid: "bg-[#50c2cb]",
    solidHover: "hover:bg-[#46adb5]"
  },
  listening: {
    badge: "bg-[#A77CBF]/25 text-[#7A5A94] border-[#A77CBF]/50",
    text: "text-[#8E67A8]",
    textHover: "hover:text-[#A77CBF]",
    border: "border-[#A77CBF]/50",
    borderLeft: "border-l-[#A77CBF]",
    bgHover: "hover:border-[#A77CBF]/50 hover:bg-[#A77CBF]/15",
    hoverBg: "hover:bg-[#A77CBF]/8",
    dot: "bg-[#A77CBF]",
    bg: "bg-[#A77CBF]/15",
    accent: "text-[#A77CBF]",
    accentHover: "hover:text-[#B899CE]",
    solid: "bg-[#A77CBF]",
    solidHover: "hover:bg-[#966BAF]"
  },
  speaking: {
    badge: "bg-[#F57A9C]/25 text-[#C45A78] border-[#F57A9C]/50",
    text: "text-[#E06A8A]",
    textHover: "hover:text-[#F57A9C]",
    border: "border-[#F57A9C]/50",
    borderLeft: "border-l-[#F57A9C]",
    bgHover: "hover:border-[#F57A9C]/50 hover:bg-[#F57A9C]/15",
    hoverBg: "hover:bg-[#F57A9C]/8",
    dot: "bg-[#F57A9C]",
    bg: "bg-[#F57A9C]/15",
    accent: "text-[#F57A9C]",
    accentHover: "hover:text-[#F89AB4]",
    solid: "bg-[#F57A9C]",
    solidHover: "hover:bg-[#E56A8C]"
  }
};

/** パスからモジュールを判定 */
export function getModuleFromPath(pathname: string): ModuleKey | null {
  if (pathname.startsWith("/vocabulary")) return "vocabulary";
  if (pathname.startsWith("/writing")) return "writing";
  if (pathname.startsWith("/reading")) return "reading";
  if (pathname.startsWith("/listening")) return "listening";
  if (pathname.startsWith("/speaking")) return "speaking";
  return null;
}
