-- seed_writing_prompts_jun2kyu_essay.sql
-- 英検準2級 ライティング 英作文問題（010 マイグレーション実行後に実行）
-- 形式: QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。語数の目安は50～60語です。

-- 問題1: アルバイト
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'essay', 'アルバイトについて',
  'QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。
語数の目安は50～60語です。

QUESTION:
Do you think students should do part-time jobs while they are in high school?',
  50, 60,
  600, 900
);

-- 問題2: スマートフォン
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'essay', 'スマートフォンについて',
  'QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。
語数の目安は50～60語です。

QUESTION:
Do you think it is good for high school students to have smartphones?',
  50, 60,
  600, 900
);

-- 問題3: 留学
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'essay', '留学について',
  'QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。
語数の目安は50～60語です。

QUESTION:
Do you think more Japanese students should study abroad?',
  50, 60,
  600, 900
);

-- 問題4: 制服
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'essay', '制服について',
  'QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。
語数の目安は50～60語です。

QUESTION:
Do you think all high school students should wear school uniforms?',
  50, 60,
  600, 900
);

-- 問題5: 環境
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'essay', '環境保護について',
  'QUESTIONについて、あなたの意見とその理由を2つ英文で書きなさい。
語数の目安は50～60語です。

QUESTION:
Do you think people should use more public transportation to protect the environment?',
  50, 60,
  600, 900
);
