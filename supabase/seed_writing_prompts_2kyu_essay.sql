-- seed_writing_prompts_2kyu_essay.sql
-- 英検2級 ライティング 英作文問題（010 マイグレーション実行後に実行）
-- 形式: TOPICに対し、意見とその理由を2つ英文で書く。語数の目安は80～100語。POINTSは参考。

-- 問題1: 宇宙旅行
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'essay', '宇宙旅行について',
  '以下のTOPICに対し、あなたの意見とその理由を2つ英文で書きなさい
また、POINTSは理由を書く際の参考であり、これら以外の観点から理由を作っても大丈夫です
語数の目安は80～100語です

TOPIC:
Do you think it is a good idea for people to travel to space as tourists?

POINTS:
Safety, Cost, Experience',
  80, 100,
  1200, 1500
);

-- 問題2: リモートワーク
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'essay', 'リモートワークについて',
  '以下のTOPICに対し、あなたの意見とその理由を2つ英文で書きなさい
また、POINTSは理由を書く際の参考であり、これら以外の観点から理由を作っても大丈夫です
語数の目安は80～100語です

TOPIC:
There is a growing trend of people working from home. Will this become the normal way to work in the future?

POINTS:
Technology, Communication, Work-life balance',
  80, 100,
  1200, 1500
);

-- 問題3: 学生のアルバイト
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'essay', '学生のアルバイトについて',
  '以下のTOPICに対し、あなたの意見とその理由を2つ英文で書きなさい
また、POINTSは理由を書く際の参考であり、これら以外の観点から理由を作っても大丈夫です
語数の目安は80～100語です

TOPIC:
Is it a good idea for students to have part-time jobs?

POINTS:
Time management, Money, Responsibility',
  80, 100,
  1200, 1500
);

-- 問題4: デジタル教科書
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'essay', 'デジタル教科書について',
  '以下のTOPICに対し、あなたの意見とその理由を2つ英文で書きなさい
また、POINTSは理由を書く際の参考であり、これら以外の観点から理由を作っても大丈夫です
語数の目安は80～100語です

TOPIC:
Do you think using digital textbooks is better than using paper ones?

POINTS:
Cost, Environment, Convenience',
  80, 100,
  1200, 1500
);
