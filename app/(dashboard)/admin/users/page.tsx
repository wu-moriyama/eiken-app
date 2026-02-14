"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { adminGetUsers, type AdminUser } from "@/lib/data/admin-db";
import { PRESET_AVATARS } from "@/lib/constants/avatars";

const PER_PAGE = 50;

function UserAvatar({
  avatarUrl,
  avatarStyle,
  displayName
}: {
  avatarUrl: string | null;
  avatarStyle: string | null;
  displayName: string | null;
}) {
  const preset = avatarStyle
    ? PRESET_AVATARS.find((a) => a.id === avatarStyle)
    : null;

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-800 text-sm font-medium text-slate-300">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : preset ? (
        <span className={`text-sm ${preset.bg} ${preset.fg}`}>
          {preset.emoji}
        </span>
      ) : (
        displayName?.[0]?.toUpperCase() ?? "?"
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetUsers();
        setUsers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = users.filter((u) => {
        const idStr = String(u.display_id);
        const name = (u.display_name ?? "").toLowerCase();
        const email = (u.email ?? "").toLowerCase();
        const level = (u.target_level ?? "").toLowerCase();
        return (
          idStr.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          level.includes(q)
        );
      });
    }
    return [...list].sort((a, b) =>
      sortOrder === "asc"
        ? a.display_id - b.display_id
        : b.display_id - a.display_id
    );
  }, [users, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredUsers.slice(start, start + PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 text-red-300">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-100">ユーザー一覧</h1>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID・名前・メール・級で検索"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 pl-9 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-brand-500"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-slate-500">
            {filteredUsers.length} 件 / {users.length} 件
          </p>
          <span className="text-xs text-slate-500">
            {PER_PAGE} 件ずつ表示
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-700 bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">
                <button
                  type="button"
                  onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                  className="flex items-center gap-1 hover:text-brand-300"
                >
                  ID
                  {sortOrder === "asc" ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-slate-300" />
              <th className="px-4 py-3 font-medium text-slate-300">メール</th>
              <th className="px-4 py-3 font-medium text-slate-300">表示名</th>
              <th className="px-4 py-3 font-medium text-slate-300">目標級</th>
              <th className="px-4 py-3 font-medium text-slate-300">学習時間</th>
              <th className="px-4 py-3 font-medium text-slate-300">連続</th>
              <th className="px-4 py-3 font-medium text-slate-300">ロール</th>
              <th className="px-4 py-3 font-medium text-slate-300">登録日</th>
              <th className="px-4 py-3 font-medium text-slate-300">V履歴</th>
              <th className="px-4 py-3 font-medium text-slate-300">W履歴</th>
              <th className="px-4 py-3 font-medium text-slate-300" />
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-800 transition hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-mono text-sm text-slate-300">
                  {u.display_id}
                </td>
                <td className="px-4 py-3">
                  <UserAvatar
                    avatarUrl={u.avatar_url}
                    avatarStyle={u.avatar_style}
                    displayName={u.display_name}
                  />
                </td>
                <td className="px-4 py-3 text-slate-200">{u.email ?? "-"}</td>
                <td className="px-4 py-3 text-slate-200">
                  {u.display_name ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-400">{u.target_level ?? "-"}</td>
                <td className="px-4 py-3 text-slate-300">
                  {u.total_study_seconds >= 3600
                    ? `${Math.floor(u.total_study_seconds / 3600)}h ${Math.floor((u.total_study_seconds % 3600) / 60)}m`
                    : u.total_study_seconds >= 60
                      ? `${Math.floor(u.total_study_seconds / 60)}m`
                      : u.total_study_seconds > 0
                        ? `${u.total_study_seconds}秒`
                        : "-"}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {u.current_streak > 0 ? `${u.current_streak} 日` : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      u.role === "admin"
                        ? "bg-amber-900/50 text-amber-300"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(u.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}/vocabulary-history`}
                    className="text-brand-400 hover:text-brand-300 hover:underline"
                    title="単語クイズ履歴"
                  >
                    V履歴
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}/writing-history`}
                    className="text-brand-400 hover:text-brand-300 hover:underline"
                    title="ライティング履歴"
                  >
                    W履歴
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-brand-400 hover:text-brand-300 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500">
            {((currentPage - 1) * PER_PAGE) + 1} -{" "}
            {Math.min(currentPage * PER_PAGE, filteredUsers.length)} 件目を表示
          </p>
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            前へ
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              return (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 2
              );
            })
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-2 text-slate-500">...</span>
                )}
                <button
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-sm ${
                    p === currentPage
                      ? "bg-brand-600 text-white"
                      : "border border-slate-600 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            次へ
          </button>
            </div>
          )}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <p className="mt-6 text-center text-slate-500">
          {searchQuery ? "検索に一致するユーザーはいません" : "ユーザーはいません"}
        </p>
      )}
    </div>
  );
}
