"use client";

/** 添削文をパースし、[[...]] で囲まれた部分を赤字・太字で表示 */
export function CorrectedTextWithHighlights({
  text,
  variant = "light"
}: {
  text: string;
  variant?: "light" | "dark";
}) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  const baseCls = variant === "dark" ? "text-slate-200" : "text-slate-800";
  const highlightCls =
    variant === "dark" ? "font-bold text-red-400" : "font-bold text-red-600";
  return (
    <p className={`whitespace-pre-wrap text-sm ${baseCls}`}>
      {parts.map((seg, i) =>
        seg.startsWith("[[") && seg.endsWith("]]") ? (
          <strong key={i} className={highlightCls}>
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{seg}</span>
        )
      )}
    </p>
  );
}
