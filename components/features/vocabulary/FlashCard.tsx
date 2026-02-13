"use client";

import { motion } from "framer-motion";

export interface FlashCardProps {
  word: string;
  meaning: string;
  level: string;
}

export function FlashCard({ word, meaning, level }: FlashCardProps) {
  return (
    <motion.div
      className="w-full max-w-sm rounded-2xl bg-slate-900/70 p-6 shadow-xl shadow-black/40 border border-slate-800 space-y-3"
      initial={{ rotateY: 0, opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
        英検 {level}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{word}</h2>
      <p className="text-sm text-slate-300">{meaning}</p>
    </motion.div>
  );
}

