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
          reading: "#50c2cb", // ブルー（キーカラー）
          listening: "#A77CBF", // パープル
          speaking: "#F57A9C" // ピンク
        },
        brand: {
          50: "#e8f8f9",
          100: "#cceff1",
          200: "#99dfe3",
          300: "#66cfd5",
          400: "#50c2cb",
          500: "#46adb5",
          600: "#3d989f",
          700: "#338389",
          800: "#2a6e73",
          900: "#20595d"
        }
      }
    }
  },
  plugins: []
};

export default config;
