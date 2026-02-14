-- seed_writing_prompts_jun1kyu_essay.sql
-- 英検準1級 ライティング 英作文問題（010 マイグレーション実行後に実行）
-- 形式: TOPICについてエッセイ。POINTSから2つ使用。序論・本論・結論。120～150語。目標約20分。

-- 問題1: スポーツ・体育への投資
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', 'スポーツ・体育への投資',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should governments invest more in sports and physical education?

POINTS:
Public health, National image, Education balance, Youth engagement',
  120, 150,
  1000, 1500
);

-- 問題2: 自転車の利用促進
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '自転車の利用促進',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should people be encouraged to use bicycles instead of cars in cities?

POINTS:
Health, Environment, Traffic, Safety',
  120, 150,
  1000, 1500
);

-- 問題3: 宇宙開発への投資
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '宇宙開発への投資',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should governments spend more money on space exploration?

POINTS:
Scientific discovery, National pride, Environmental concerns, Budget priorities',
  120, 150,
  1000, 1500
);

-- 問題4: 気候変動の学校教育
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '気候変動の学校教育',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should schools teach more about climate change and environmental issues?

POINTS:
Future generations, Scientific literacy, Global responsibility, Curriculum balance',
  120, 150,
  1000, 1500
);

-- 問題5: 週4日労働制
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '週4日労働制',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should companies adopt a four-day work week?

POINTS:
Productivity, Well-being, Economy, Tradition',
  120, 150,
  1000, 1500
);

-- 問題6: 大学の無償化
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '大学の無償化',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should university education be free for all students?

POINTS:
Equality, Government budget, Quality of education, Workforce',
  120, 150,
  1000, 1500
);

-- 問題7: 投票年齢の引き下げ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'essay', '投票年齢の引き下げ',
  '英検準1級ライティング問題
Write an essay on the given TOPIC.
Use TWO of the POINTS below to support your answer
Structure: introduction, main body, and conclusion
Suggested length: 120~150 words

TOPIC:
Should the voting age be lowered to 16?

POINTS:
Political engagement, Maturity, Policy impact, Democratic representation',
  120, 150,
  1000, 1500
);
