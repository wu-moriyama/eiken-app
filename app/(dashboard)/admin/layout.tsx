"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { checkIsAdmin } from "@/lib/data/admin-db";

const ADMIN_NAV = [
  { href: "/admin", label: "管理トップ" },
  { href: "/admin/users", label: "ユーザー管理" },
  { href: "/admin/vocabulary", label: "単語管理" },
  { href: "/admin/writing", label: "ライティング問題" }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    const run = async () => {
      const ok = await checkIsAdmin();
      setStatus(ok ? "ok" : "denied");
      if (!ok) {
        router.replace("/dashboard");
      }
    };
    void run();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-400">確認中...</p>
      </div>
    );
  }

  if (status === "denied") {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className="w-52 shrink-0 border-r border-slate-800 bg-slate-900/30">
        <nav className="sticky top-0 p-4">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            管理メニュー
          </p>
          <ul className="space-y-0.5">
            {ADMIN_NAV.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-brand-500/20 text-brand-300"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
