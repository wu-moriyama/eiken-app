// 簡易版 SM-2 アルゴリズム実装

export type SrsRating = 0 | 1 | 2 | 3 | 4 | 5; // 0: 完全に忘れた, 5: 完全に覚えた

export interface SrsState {
  interval: number; // 日
  repetitions: number;
  easeFactor: number;
  lastReviewedAt: string; // ISO
}

export function updateSrsState(
  previous: SrsState | null,
  rating: SrsRating,
  now = new Date()
): SrsState {
  const MIN_EF = 1.3;

  if (!previous) {
    return {
      interval: rating >= 3 ? 1 : 0,
      repetitions: rating >= 3 ? 1 : 0,
      easeFactor: 2.5,
      lastReviewedAt: now.toISOString()
    };
  }

  let { repetitions, easeFactor } = previous;
  let interval = previous.interval;

  if (rating < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  // SM-2 の EF 更新式
  easeFactor =
    easeFactor +
    (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));

  if (easeFactor < MIN_EF) easeFactor = MIN_EF;

  return {
    interval,
    repetitions,
    easeFactor,
    lastReviewedAt: now.toISOString()
  };
}

