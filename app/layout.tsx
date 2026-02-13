import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "英検対策オールインワン | Eiken App",
  description: "英検5級〜1級まで対応した総合学習プラットフォーム"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}

