export interface VocabularyItem {
  id: string;
  word: string;
  meaning_ja: string;
  level: string;
  part_of_speech?: string; // 品詞（動詞・名詞など）
  category?: string; // カテゴリ（様子・程度、動物など）— 選択肢を似たカテゴリから選ぶのに使用
  pronunciation?: string; // IPA 表記
  example_en?: string;
  example_ja?: string;
}

export const VOCABULARY_LEVELS = [
  "5級",
  "4級",
  "3級",
  "準2級",
  "2級",
  "準1級",
  "1級"
] as const;

export type VocabularyLevel = (typeof VOCABULARY_LEVELS)[number];

/**
 * サンプル単語データ（MVP用）
 * 本番では Supabase の vocabulary テーブルから取得
 */
export const SAMPLE_VOCABULARY: VocabularyItem[] = [
  { id: "v1", word: "apple", meaning_ja: "りんご", level: "5級", pronunciation: "/ˈæpl/", example_en: "I eat an apple.", example_ja: "りんごを食べます。" },
  { id: "v2", word: "book", meaning_ja: "本", level: "5級", pronunciation: "/bʊk/", example_en: "This is my book.", example_ja: "これは私の本です。" },
  { id: "v3", word: "cat", meaning_ja: "ネコ", level: "5級", pronunciation: "/kæt/", example_en: "The cat is cute.", example_ja: "そのネコはかわいい。" },
  { id: "v4", word: "dog", meaning_ja: "犬", level: "5級", pronunciation: "/dɔːɡ/", example_en: "I have a dog.", example_ja: "犬を飼っています。" },
  { id: "v5", word: "happy", meaning_ja: "幸せな、うれしい", level: "5級", pronunciation: "/ˈhæpi/", example_en: "I am happy.", example_ja: "私は幸せです。" },
  { id: "v6", word: "school", meaning_ja: "学校", level: "5級", pronunciation: "/skuːl/", example_en: "I go to school.", example_ja: "学校に行きます。" },
  { id: "v7", word: "friend", meaning_ja: "友達", level: "4級", pronunciation: "/frend/", example_en: "He is my friend.", example_ja: "彼は私の友達です。" },
  { id: "v8", word: "weather", meaning_ja: "天気", level: "4級", pronunciation: "/ˈweðər/", example_en: "The weather is nice.", example_ja: "天気が良いです。" },
  { id: "v9", word: "interesting", meaning_ja: "おもしろい", level: "4級", pronunciation: "/ˈɪntrəstɪŋ/", example_en: "This book is interesting.", example_ja: "この本はおもしろい。" },
  { id: "v10", word: "important", meaning_ja: "重要な", level: "4級", pronunciation: "/ɪmˈpɔːrtnt/", example_en: "It is important.", example_ja: "それは重要です。" },
  { id: "v11", word: "discuss", meaning_ja: "議論する", level: "3級", pronunciation: "/dɪˈskʌs/", example_en: "Let's discuss it.", example_ja: "それを議論しましょう。" },
  { id: "v12", word: "environment", meaning_ja: "環境", level: "3級", pronunciation: "/ɪnˈvaɪrənmənt/", example_en: "Protect the environment.", example_ja: "環境を守りましょう。" },
  { id: "v13", word: "recommend", meaning_ja: "勧める、推薦する", level: "準2級", pronunciation: "/ˌrekəˈmend/", example_en: "I recommend this book.", example_ja: "この本をお勧めします。" },
  { id: "v14", word: "opportunity", meaning_ja: "機会", level: "準2級", pronunciation: "/ˌɑːpərˈtuːnəti/", example_en: "Don't miss this opportunity.", example_ja: "この機会を逃さないで。" },
  { id: "v15", word: "approximately", meaning_ja: "およそ、約", level: "2級", pronunciation: "/əˈprɑːksɪmətli/", example_en: "Approximately 100 people.", example_ja: "約100人。" },
  { id: "v16", word: "contribute", meaning_ja: "貢献する", level: "2級", pronunciation: "/kənˈtrɪbjuːt/", example_en: "He contributed to the project.", example_ja: "彼はプロジェクトに貢献した。" },
  { id: "v17", word: "nevertheless", meaning_ja: "それにもかかわらず", level: "準1級", pronunciation: "/ˌnevərðəˈles/", example_en: "Nevertheless, I'll try.", example_ja: "それにもかかわらず、やってみます。" },
  { id: "v18", word: "sophisticated", meaning_ja: "洗練された", level: "準1級", pronunciation: "/səˈfɪstɪkeɪtɪd/", example_en: "A sophisticated design.", example_ja: "洗練されたデザイン。" },
  { id: "v19", word: "paradigm", meaning_ja: "パラダイム、規範", level: "1級", pronunciation: "/ˈpærədaɪm/", example_en: "A shift in paradigm.", example_ja: "パラダイムの転換。" },
  { id: "v20", word: "ubiquitous", meaning_ja: "どこにでもある", level: "1級", pronunciation: "/juːˈbɪkwɪtəs/", example_en: "Smartphones are ubiquitous.", example_ja: "スマートフォンはどこにでもある。" }
];

export function getVocabularyByLevel(level: string): VocabularyItem[] {
  return SAMPLE_VOCABULARY.filter((v) => v.level === level);
}

export function getVocabularyForSession(level: string, count = 10): VocabularyItem[] {
  const pool =
    level === "全レベル"
      ? [...SAMPLE_VOCABULARY]
      : getVocabularyByLevel(level);
  if (pool.length >= count) {
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  }
  // 選択レベルに単語が少ない場合は、他レベルから補って10問出す
  const levelIds = new Set(pool.map((v) => v.id));
  const rest = SAMPLE_VOCABULARY.filter((v) => !levelIds.has(v.id));
  const combined = [...pool, ...rest.sort(() => Math.random() - 0.5)].slice(0, count);
  return combined.sort(() => Math.random() - 0.5);
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

/** 品詞が一致するか（「名詞・副詞」は「名詞」とマッチ） */
function matchesPartOfSpeech(itemPos: string, correctPos: string): boolean {
  if (!correctPos) return false;
  const pos = itemPos.trim();
  if (pos === correctPos) return true;
  // 「名詞・副詞」「副詞・名詞」など複合品詞に対応
  return pos.startsWith(correctPos + "・") || pos.includes("・" + correctPos);
}

/**
 * 4択クイズ用の選択肢を生成（正解1つ + 誤答3つ）
 * 同じカテゴリ → 同じ品詞 → その他 の順で誤答候補を選び、紛らわしい選択肢にする
 */
export function getQuizOptions(
  correctItem: VocabularyItem,
  pool: VocabularyItem[]
): QuizOption[] {
  const exclude = new Set([correctItem.meaning_ja]);
  const others = pool.filter(
    (v) => v.id !== correctItem.id && !exclude.has(v.meaning_ja)
  );

  const correctCategory = correctItem.category?.trim() || "";
  const correctPos = correctItem.part_of_speech?.trim() || "";

  // 1. 同じカテゴリを最優先（様子・程度同士、動物同士など）
  const sameCategory = correctCategory
    ? others.filter((v) => (v.category?.trim() || "") === correctCategory)
    : [];
  // 2. 同じ品詞（カテゴリがない場合や足りない場合の補完）
  const samePos = correctPos
    ? others
        .filter((v) => !sameCategory.includes(v))
        .filter((v) =>
          matchesPartOfSpeech(v.part_of_speech || "", correctPos)
        )
    : [];
  // 3. その他
  const rest = others.filter(
    (v) => !sameCategory.includes(v) && !samePos.includes(v)
  );

  // 優先順位を守りつつ、同じカテゴリ→同じ品詞→その他 の順で3つ選ぶ
  const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const picked = new Set<string>();
  for (const group of [sameCategory, samePos, rest]) {
    if (picked.size >= 3) break;
    for (const v of shuffle(group)) {
      if (!exclude.has(v.meaning_ja) && !picked.has(v.meaning_ja)) {
        picked.add(v.meaning_ja);
        if (picked.size >= 3) break;
      }
    }
  }
  const wrong = [...picked]
    .sort(() => Math.random() - 0.5)
    .map((text) => ({ text, isCorrect: false }));

  const options: QuizOption[] = [
    { text: correctItem.meaning_ja, isCorrect: true },
    ...wrong
  ];
  return options.sort(() => Math.random() - 0.5);
}
