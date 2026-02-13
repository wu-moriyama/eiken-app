-- seed_writing_prompts_3kyu_email.sql
-- 英検3級 ライティング Eメール問題（010 マイグレーション実行後に実行）

-- 問題1: スマートフォン
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'email', 'スマートフォンについて',
  '{"emailFrom":"James","emailContent":"Hi,\n\nThank you for your e-mail.\nMy brother says that you use a smartphone every day.\nHow many hours a day do you use your smartphone? And What do you use it for?\n\nYour friend,\nJames"}',
  15, 25,
  300, 480
);

-- 問題2: 好きな科目
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'email', '好きな科目',
  '{"emailFrom":"Emma","emailContent":"Hi,\n\nThank you for your e-mail.\nYou said you like to study at school.\nWhat is your favorite subject? And why do you like it?\n\nYour friend,\nEmma"}',
  15, 25,
  300, 480
);

-- 問題3: 週末の過ごし方
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'email', '週末の過ごし方',
  '{"emailFrom":"Tom","emailContent":"Hi,\n\nThank you for your e-mail.\nWhat do you usually do on weekends? And what do you want to do next weekend?\n\nYour friend,\nTom"}',
  15, 25,
  300, 480
);
