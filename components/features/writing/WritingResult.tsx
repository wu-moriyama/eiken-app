"use client";

import Link from "next/link";
import { MODULE_COLORS } from "@/lib/constants/module-colors";
import { CorrectedTextWithHighlights } from "./CorrectedTextWithHighlights";
import { ReadAloudButton } from "./ReadAloudButton";
import { getProfileId } from "@/lib/data/vocabulary-db";
import { logReadingAloudActivity } from "@/lib/data/study-activity";

/** レーダーチャート（5軸、0-5スケール） */
function ScoreRadarChart({
  vocabulary,
  grammar,
  content,
  organization,
  instruction
}: {
  vocabulary: number;
  grammar: number;
  content: number;
  organization: number;
  instruction: number;
}) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = (size / 2) * 0.85;
  const labels = ["語彙", "文法", "内容", "構成", "指示"] as const;
  const values = [vocabulary, grammar, content, organization, instruction];

  const angleStep = (2 * Math.PI) / 5;
  const points = values.map((v, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (v / 5) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 24) * Math.cos(angle),
      labelY: cy + (maxR + 24) * Math.sin(angle)
    };
  });
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [1, 2, 3, 4, 5];
  return (
    <div className="flex justify-center">
      <svg width={size + 80} height={size + 80} className="overflow-visible">
        <g transform={`translate(40, 40)`}>
          {gridLevels.map((level) => {
            const r = (level / 5) * maxR;
            const gridPts = Array.from({ length: 5 }, (_, i) => {
              const a = -Math.PI / 2 + i * angleStep;
              return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
            }).join(" ");
            return (
              <polygon
                key={level}
                points={gridPts}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.5"
              />
            );
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const a = -Math.PI / 2 + i * angleStep;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + maxR * Math.cos(a)}
                y2={cy + maxR * Math.sin(a)}
                stroke="#e2e8f0"
                strokeWidth="0.5"
              />
            );
          })}
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#3b82f6"
            />
          ))}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.labelX}
              y={p.labelY}
              textAnchor={p.labelX > cx ? "start" : p.labelX < cx ? "end" : "middle"}
              dominantBaseline="middle"
              className="fill-slate-600 text-[10px] font-medium"
            >
              {labels[i]} {values[i]}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

export interface WritingResultData {
  overall_score: number;
  vocabulary_score: number;
  grammar_score: number;
  content_score: number;
  organization_score: number;
  instruction_score: number;
  corrected_text: string;
  feedback: string;
}

interface WritingResultProps {
  data: WritingResultData;
  level: string;
  promptType: "essay" | "email" | "summary";
  onNewProblem?: () => void;
}

const SCORE_LABELS: Record<string, string> = {
  vocabulary_score: "語彙",
  grammar_score: "文法",
  content_score: "内容",
  organization_score: "構成",
  instruction_score: "指示遵守"
};

export function WritingResult({ data, level, promptType, onNewProblem }: WritingResultProps) {
  const scoreItems = [
    "vocabulary_score",
    "grammar_score",
    "content_score",
    "organization_score",
    "instruction_score"
  ] as const;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">添削結果</h2>

      <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
        <span className={`text-3xl font-bold ${MODULE_COLORS.writing.text}`}>
          {data.overall_score.toFixed(1)}
        </span>
        <span className="text-slate-600">総合</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {scoreItems.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-3"
          >
            <span className="text-lg font-semibold text-slate-900">
              {data[key]}
            </span>
            <span className="text-xs text-slate-500">
              {SCORE_LABELS[key]}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-700">スコア分布</h3>
        <ScoreRadarChart
          vocabulary={data.vocabulary_score}
          grammar={data.grammar_score}
          content={data.content_score}
          organization={data.organization_score}
          instruction={data.instruction_score}
        />
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-slate-700">
            添削文
            <span className="ml-2 text-xs font-normal text-slate-500">
              （赤字・太字＝修正箇所）
            </span>
          </h3>
          <ReadAloudButton
            text={data.corrected_text}
            label="音声で聞く"
            className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            onSpeakStart={() => {
              getProfileId().then((pid) => {
                if (pid) void logReadingAloudActivity(pid);
              });
            }}
          />
        </div>
        <p className="mb-2 text-xs text-amber-700">
          音読してみよう！正しい発音を聞いて、自分でも声に出して読むと学習効果が上がります。
        </p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <CorrectedTextWithHighlights text={data.corrected_text} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700">フィードバック</h3>
        <div className="rounded-lg border border-[#A6D472]/40 bg-[#A6D472]/15 p-4">
          <p className="whitespace-pre-wrap text-sm text-slate-800">
            {data.feedback}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/writing"
          className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white ${MODULE_COLORS.writing.solid} ${MODULE_COLORS.writing.solidHover}`}
        >
          形式選択に戻る
        </Link>
        <Link
          href="/writing/history"
          className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          履歴を見る
        </Link>
        {onNewProblem ? (
          <button
            type="button"
            onClick={onNewProblem}
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            別の問題に挑戦
          </button>
        ) : (
          <Link
            href={
              promptType === "summary"
                ? `/writing/summary?level=${encodeURIComponent(level)}`
                : `/writing/${promptType}${promptType === "essay" ? "?level=" + encodeURIComponent(level) : ""}`
            }
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            別の問題に挑戦
          </Link>
        )}
      </div>
    </div>
  );
}
