"use client";

/** 添削文をパースし、[[...]] で囲まれた部分を赤字・太字で表示 */
export function CorrectedTextWithHighlights({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <p className="whitespace-pre-wrap text-sm text-slate-800">
      {parts.map((seg, i) =>
        seg.startsWith("[[") && seg.endsWith("]]") ? (
          <strong key={i} className="font-bold text-red-600">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{seg}</span>
        )
      )}
    </p>
  );
}
