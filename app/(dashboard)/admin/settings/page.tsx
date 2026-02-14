"use client";

import { useEffect, useState, useCallback } from "react";
import {
  adminGetAppSettings,
  adminUpdateAppSettings,
  adminGetExamDates,
  adminUpsertExamDate,
  type ExamDateRow
} from "@/lib/data/admin-db";

const ROUND_LABELS: Record<number, string> = {
  1: "第1回",
  2: "第2回",
  3: "第3回"
};

export default function AdminSettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [examDates, setExamDates] = useState<ExamDateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [settings, dates] = await Promise.all([
          adminGetAppSettings(),
          adminGetExamDates()
        ]);
        setAdminEmail(settings.admin_email ?? "");
        setExamDates(dates);
      } catch (e) {
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await adminUpdateAppSettings({ admin_email: adminEmail || null });
      setMessage("管理者メールを保存しました");
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExamDate = async (
    examYear: number,
    round: number,
    primaryDate: string,
    secondaryDate: string
  ) => {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await adminUpsertExamDate(examYear, round, primaryDate, secondaryDate);
      const dates = await adminGetExamDates();
      setExamDates(dates);
      setMessage(`${examYear}年度${ROUND_LABELS[round]}の試験日を保存しました`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-100">基本設定</h1>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-300">
          管理者メールアドレス
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          お問い合わせなどの送信先として使用されます
        </p>
        <form onSubmit={handleSaveEmail} className="flex gap-3">
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="admin@example.com"
            className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-300">
          英検試験日（本会場・一次・二次A日程）
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          会員のカウントダウン表示に使用されます。YYYY-MM-DD 形式で入力
        </p>

        {examDates.length === 0 ? (
          <p className="text-sm text-slate-500">
            試験日が登録されていません。seed_eiken_exam_dates.sql
            を実行して初期データを投入してください。
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-2 pr-4">年度・回</th>
                  <th className="pb-2 pr-4">一次試験日</th>
                  <th className="pb-2 pr-4">二次試験日</th>
                  <th className="pb-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {examDates.map((row) => (
                  <ExamDateRowForm
                    key={row.id}
                    row={row}
                    onSave={handleSaveExamDate}
                    saving={saving}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-emerald-900/30 px-4 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}
    </div>
  );
}

function ExamDateRowForm({
  row,
  onSave,
  saving
}: {
  row: ExamDateRow;
  onSave: (
    year: number,
    round: number,
    primary: string,
    secondary: string
  ) => Promise<void>;
  saving: boolean;
}) {
  const [primary, setPrimary] = useState(row.primary_date);
  const [secondary, setSecondary] = useState(row.secondary_date);

  useEffect(() => {
    setPrimary(row.primary_date);
    setSecondary(row.secondary_date);
  }, [row.primary_date, row.secondary_date]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void onSave(row.exam_year, row.round, primary, secondary);
    },
    [row.exam_year, row.round, primary, secondary, onSave]
  );

  return (
    <tr className="border-b border-slate-700/50">
      <td className="py-3 pr-4 font-medium text-slate-200">
        {row.exam_year}年度{ROUND_LABELS[row.round]}
      </td>
      <td className="py-3 pr-4">
        <input
          type="date"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100"
        />
      </td>
      <td className="py-3 pr-4">
        <input
          type="date"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100"
        />
      </td>
      <td className="py-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="text-brand-400 hover:text-brand-300 disabled:opacity-60"
        >
          保存
        </button>
      </td>
    </tr>
  );
}
