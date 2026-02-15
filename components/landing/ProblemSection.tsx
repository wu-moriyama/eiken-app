"use client";

const PROBLEMS = [
  "英検の勉強、何から手をつければいいかわからない",
  "単語帳・参考書が増えすぎて続かない",
  "ライティング・スピーキングの添削が受けられない",
  "計画を立てても3日坊主になりがち"
];

export function ProblemSection() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          こんな悩みありませんか？
        </h2>
        <ul className="mt-8 space-y-3">
          {PROBLEMS.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-left text-slate-700 shadow-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                ?
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg font-medium text-slate-700">
          だから、<span className="text-[#50c2cb]">ひとつのプラットフォーム</span>で
          <br className="sm:hidden" />
          全部まとめて対策できると便利ですよね。
        </p>
      </div>
    </section>
  );
}
