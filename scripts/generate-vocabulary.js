/**
 * OpenAI API を使って英検単語CSVを生成するスクリプト
 *
 * 使い方:
 *   node scripts/generate-vocabulary.js jun2kyu [count]
 *   node scripts/generate-vocabulary.js 2kyu 500
 *   npm run generate:vocabulary:jun2kyu
 *
 * 対応レベル: jun2kyu, 2kyu, jun1kyu, 1kyu
 * .env.local に OPENAI_API_KEY を設定すること
 */

const fs = require("fs");
const path = require("path");

// .env.local を読み込み（複数パスを試行）
const envPaths = [
  path.join(__dirname, "..", ".env.local"),
  path.join(process.cwd(), ".env.local")
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf-8")
      .split(/\r?\n/)
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const m = trimmed.match(/^([^=]+)=(.*)$/);
        if (m) {
          const key = m[1].trim();
          const val = m[2].trim().replace(/^["']|["']$/g, "");
          process.env[key] = val;
        }
      });
    break;
  }
}

const LEVEL_MAP = {
  jun2kyu: "準2級",
  "2kyu": "2級",
  jun1kyu: "準1級",
  "1kyu": "1級"
};

const LEVEL_NAMES = {
  jun2kyu: "英検準2級",
  "2kyu": "英検2級",
  jun1kyu: "英検準1級",
  "1kyu": "英検1級"
};

const BATCH_SIZE = 50;
const DELAY_MS = 2000;

function escapeCsv(str) {
  if (str == null || str === "") return "";
  const s = String(str);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

function rowToCsv(row) {
  return [
    escapeCsv(row.level),
    escapeCsv(row.word),
    escapeCsv(row.meaning_ja),
    escapeCsv(row.part_of_speech || row.Part_of_Speech),
    escapeCsv(row.category),
    escapeCsv(row.pronunciation),
    escapeCsv(row.example_en),
    escapeCsv(row.example_ja)
  ].join(",");
}

function buildPrompt(levelName, levelLabel, count, excludeWords = []) {
  const exclude = excludeWords.length
    ? `\n以下の単語は既に含まれているので出力しないでください: ${excludeWords.join(", ")}`
    : "";
  return `英検の単語リストを生成してください。

レベル: ${levelName}（${levelLabel}）
${count}語を、次のJSON形式で出力してください。説明やマークダウンは不要です。JSONのみ出力してください。

[
  {
    "word": "英単語",
    "meaning_ja": "日本語の意味（複数ある場合は・で区切る）",
    "part_of_speech": "品詞（動詞・名詞・形容詞・副詞・前置詞など）",
    "category": "カテゴリ（思考・感情、抽象概念、様子・程度、日常・基本、自然・社会、文化、政治・社会、ビジネス、学術などから適切なものを1つ）",
    "pronunciation": "IPA発音記号（スラッシュで囲む）",
    "example_en": "短い例文（英語）",
    "example_ja": "例文の日本語訳"
  }
]
${exclude}

・英検${levelLabel}の出題範囲に適した難易度の単語を選んでください。
・一般的な教材でよく出る単語を優先してください。
・品詞とカテゴリは日本語で出力してください。
・例文はその単語を使った自然な短い文にしてください。`;
}

async function generateBatch(openai, levelLabel, count, excludeWords) {
  const levelName = Object.entries(LEVEL_MAP).find(([, v]) => v === levelLabel)?.[0] || levelLabel;
  const prompt = buildPrompt(LEVEL_NAMES[levelName] || levelLabel, levelLabel, count, excludeWords);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "あなたは英検の単語リストを作成するアシスタントです。指定された形式のJSONのみを出力し、それ以外の説明やマークダウンは含めないでください。"
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content?.trim() || "";
  // JSON ブロックを抽出（```json ... ``` または生の JSON）
  let jsonStr = content;
  const codeBlock = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();

  try {
    const parsed = JSON.parse(jsonStr);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return items.map((item) => ({
      ...item,
      level: levelLabel
    }));
  } catch (e) {
    console.error("JSON parse error:", e.message);
    console.error("Raw content (first 500 chars):", content.slice(0, 500));
    return [];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const levelArg = args.find((a) => Object.keys(LEVEL_MAP).includes(a)) || "jun2kyu";
  const totalCount = parseInt(args.find((a) => /^\d+$/.test(a)), 10) || 300;

  const levelLabel = LEVEL_MAP[levelArg];
  const outputPath = path.join(__dirname, "..", "data", `eiken_${levelArg}.csv`);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY is not set in .env.local");
    process.exit(1);
  }

  const { OpenAI } = require("openai");
  const openai = new OpenAI({ apiKey });

  console.log(`Generating ${totalCount} words for ${levelLabel}...`);
  const allItems = [];
  let excludeWords = [];

  const numBatches = Math.ceil(totalCount / BATCH_SIZE);

  for (let i = 0; i < numBatches; i++) {
    const remaining = totalCount - allItems.length;
    const batchCount = Math.min(BATCH_SIZE, remaining);
    process.stdout.write(`  Batch ${i + 1}/${numBatches} (${batchCount} words)... `);

    const batch = await generateBatch(openai, levelLabel, batchCount, excludeWords);
    if (batch.length === 0) {
      console.log("failed (no items returned)");
      continue;
    }

    allItems.push(...batch);
    excludeWords = allItems.map((x) => x.word);
    console.log(`ok (${batch.length} words, total: ${allItems.length})`);

    if (i < numBatches - 1) {
      await sleep(DELAY_MS);
    }
  }

  const header = "level,word,meaning_ja,Part_of_Speech,category,pronunciation,example_en,example_ja";
  const lines = [header, ...allItems.map(rowToCsv)];
  fs.writeFileSync(outputPath, lines.join("\n"), "utf-8");

  console.log(`\nDone! Saved ${allItems.length} words to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
