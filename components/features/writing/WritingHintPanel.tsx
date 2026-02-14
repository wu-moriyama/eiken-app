"use client";

import { useEffect } from "react";
import { getWritingHint, type WritingHintType } from "@/lib/writing-hints";

interface WritingHintPanelProps {
  type: WritingHintType;
  level: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WritingHintPanel({
  type,
  level,
  isOpen,
  onClose,
}: WritingHintPanelProps) {
  const hint = getWritingHint(type, level);
  const label = type === "essay" ? "英作文" : "Eメール";

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* オーバーレイ（パネル外クリックで閉じる） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] md:bg-transparent md:backdrop-blur-none"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* 右サイドパネル */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-out md:max-w-sm ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-base font-semibold text-slate-900">
              ヒント（英検{level} {label}）
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="ヒントを閉じる"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
              {hint}
            </pre>
          </div>
        </div>
      </aside>
    </>
  );
}

interface WritingHintButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function WritingHintButton({ onClick, isOpen }: WritingHintButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition-all hover:shadow-xl ${
        isOpen
          ? "bg-[#A6D472] text-white hover:bg-[#8FC55C]"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
      aria-label="ヒントを見る"
      aria-expanded={isOpen}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
      <span>ヒント</span>
    </button>
  );
}
