/**
 * CSV を読み込み、Supabase の vocabulary テーブルに投入するスクリプト
 *
 * 使い方:
 * 1. npm run seed:vocabulary          -- Supabase API 経由で挿入（.env.local 必須）
 * 2. npm run seed:vocabulary -- --sql -- Supabase SQL Editor 用の SQL ファイルを生成
 *
 * 事前に 006_vocabulary_add_columns.sql を Supabase で実行しておくこと
 */

const fs = require("fs");
const path = require("path");

// .env.local を手動で読み込み
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    });
}

const { createClient } = require("@supabase/supabase-js");

// 例: npm run seed:vocabulary:sql -- 3kyu  または  node import-vocabulary.js --sql jun2kyu
const SUPPORTED_LEVELS = ["3kyu", "4kyu", "5kyu", "jun2kyu", "2kyu", "jun1kyu", "1kyu"];
const levelArg = process.argv.find((a) => SUPPORTED_LEVELS.includes(a)) || "5kyu";
const csvPath = path.join(__dirname, "..", "data", `eiken_${levelArg}.csv`);

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || (c === "\n" && !inQuotes)) {
      result.push(current.trim());
      current = "";
      if (c === "\n") break;
    } else {
      current += c;
    }
  }
  if (current) result.push(current.trim());
  return result;
}

function escapeSql(str) {
  if (str == null || str === "") return "NULL";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function loadRows() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found: ${csvPath} (use 3kyu, 4kyu, 5kyu, jun2kyu, 2kyu, jun1kyu, 1kyu)`);
  }
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  const header = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = values[i] || ""));
    return row;
  });
}

function generateSqlFile(rows) {
  const outPath = path.join(__dirname, "..", "supabase", `seed_vocabulary_${levelArg}.sql`);
  const inserts = rows.map(
    (row) =>
      `INSERT INTO public.vocabulary (level, word, meaning_ja, part_of_speech, category, pronunciation, example_en, example_ja) VALUES (${escapeSql(row.level)}, ${escapeSql(row.word)}, ${escapeSql(row.meaning_ja)}, ${escapeSql(row.Part_of_Speech || row.part_of_speech)}, ${escapeSql(row.category)}, ${escapeSql(row.pronunciation)}, ${escapeSql(row.example_en)}, ${escapeSql(row.example_ja)});`
  );
  const sql = [
    `-- ${levelArg} 単語を vocabulary に投入（006, 007 マイグレーション実行後に実行）`,
    "-- 既存データを消す場合は以下の行のコメントを外す:",
    "-- TRUNCATE public.vocabulary RESTART IDENTITY CASCADE;",
    "",
    ...inserts,
  ].join("\n");
  fs.writeFileSync(outPath, sql, "utf-8");
  console.log(`Generated: ${outPath} (${rows.length} rows)`);
}

async function main() {
  const useSql = process.argv.includes("--sql");
  const rows = loadRows();
  console.log(`Loading ${levelArg} from ${path.basename(csvPath)} (${rows.length} rows)`);

  if (useSql) {
    generateSqlFile(rows);
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  let inserted = 0;
  let errors = 0;

  for (const row of rows) {
    const { error } = await supabase.from("vocabulary").insert({
      level: row.level || null,
      word: row.word || null,
      meaning_ja: row.meaning_ja || null,
      part_of_speech: row.Part_of_Speech || row.part_of_speech || null,
      category: row.category || null,
      pronunciation: row.pronunciation || null,
      example_en: row.example_en || null,
      example_ja: row.example_ja || null,
    });

    if (error) {
      console.error(`Error inserting ${row.word}:`, error.message);
      errors++;
    } else {
      inserted++;
      if (inserted % 20 === 0) process.stdout.write(".");
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
