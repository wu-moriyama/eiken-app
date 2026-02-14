import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "sans-serif"
        ]
      },
      colors: {
        /** カラーチャート準拠のモジュール色 */
        module: {
          vocabulary: "#F99F66", // オレンジ
          writing: "#A6D472", // グリーン
          reading: "#31B5D1", // ブルー
          listening: "#A77CBF", // パープル
          speaking: "#F57A9C" // ピンク
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        }
      }
    }
  },
  plugins: []
};

export default config;
