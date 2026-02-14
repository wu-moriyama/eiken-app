-- seed_writing_prompts_1kyu_essay.sql
-- 英検1級 ライティング 英作文（意見論述）問題（010 マイグレーション実行後に実行）
-- 形式: QUESTIONについて意見と理由を3つ述べる。序論・本論・結論。200～240語。目標約25～30分。

-- 問題1: 経済成長を最優先にすべきか
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', '経済成長を最優先にすべきか',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Agree or disagree: Economic growth should be the top priority for governments.',
  200, 240,
  1500, 1800
);

-- 問題2: 男女の真の平等は可能か
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', '男女の真の平等は可能か',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Is it possible to achieve true equality between men and women?',
  200, 240,
  1500, 1800
);

-- 問題3: 再生可能エネルギーで気候変動は止められるか
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', '再生可能エネルギーで気候変動は止められるか',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Will the development of renewable energy sources be sufficient to stop climate change?',
  200, 240,
  1500, 1800
);

-- 問題4: 絶滅危惧言語の保護
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', '絶滅危惧言語の保護',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Should more be done to preserve endangered languages?',
  200, 240,
  1500, 1800
);

-- 問題5: SNS企業の規制
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', 'SNS企業の規制',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Agree or disagree: Governments should regulate social media companies more strictly.',
  200, 240,
  1500, 1800
);

-- 問題6: ベーシックインカム
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', 'ベーシックインカム',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Is universal basic income a good idea for modern societies?',
  200, 240,
  1500, 1800
);

-- 問題7: テクノロジーと高齢化
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', 'テクノロジーと高齢化',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Can technology solve the problem of an aging population?',
  200, 240,
  1500, 1800
);

-- 問題8: 死刑制度
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'essay', '死刑制度',
  'Write an essay on the given TOPIC.
Give THREE reasons to support your answer.
Structure: introduction, main body, and conclusion.
Suggested length: 200 – 240 words.

QUESTION:
Should the death penalty be abolished worldwide?',
  200, 240,
  1500, 1800
);
