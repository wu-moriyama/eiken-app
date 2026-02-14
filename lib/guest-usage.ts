/**
 * ゲスト（未ログイン）利用回数のクッキー管理
 * 単語クイズ: 3回まで
 * ライティング添削: 1回まで
 */

const COOKIE_NAME = "eiken_guest_usage";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1年

export const GUEST_VOCABULARY_LIMIT = 3;
export const GUEST_WRITING_LIMIT = 1;

function getCookie(): { v: number; w: number } {
  if (typeof document === "undefined") return { v: 0, w: 0 };
  const match = document.cookie.match(
    new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return { v: 0, w: 0 };
  try {
    const parsed = JSON.parse(decodeURIComponent(match[2]));
    return {
      v: Math.max(0, Number(parsed.v) || 0),
      w: Math.max(0, Number(parsed.w) || 0),
    };
  } catch {
    return { v: 0, w: 0 };
  }
}

function setCookie(data: { v: number; w: number }) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getGuestVocabularyCount(): number {
  return getCookie().v;
}

export function getGuestWritingCount(): number {
  return getCookie().w;
}

export function incrementGuestVocabularyCount(): number {
  const c = getCookie();
  c.v += 1;
  setCookie(c);
  return c.v;
}

export function incrementGuestWritingCount(): number {
  const c = getCookie();
  c.w += 1;
  setCookie(c);
  return c.w;
}
