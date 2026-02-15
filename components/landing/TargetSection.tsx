"use client";

const TARGETS = [
  "英検2級・準1級・1級を狙っている方",
  "独学でライティング・スピーキング対策をしたい方",
  "毎日コツコツ、継続して勉強したい方",
  "単語〜面接まで、ひとつのアプリで対策したい方"
];

export function TargetSection() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          こんな方におすすめ
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TARGETS.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#50c2cb]/20 text-sm font-bold text-[#50c2cb]">
                ✓
              </span>
              <span className="text-slate-700">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
