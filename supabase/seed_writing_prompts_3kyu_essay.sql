-- seed_writing_prompts_3kyu_essay.sql
-- 英検3級 ライティング 英作文問題（010 マイグレーション実行後に実行）
-- 形式: QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。語数の目安は25語〜35語です。
-- Eメール問題とは別形式（writing_prompts.prompt_type = 'essay'）

-- 問題1: 夏に行きたい場所
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '夏に行きたい場所',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
Where would you like to go this summer?',
  25, 35,
  300, 480
);

-- 問題2: 好きなスポーツ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '好きなスポーツ',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
What is your favorite sport?',
  25, 35,
  300, 480
);

-- 問題3: 週末の過ごし方
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '週末にしたいこと',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
What do you like to do on weekends?',
  25, 35,
  300, 480
);

-- 問題4: 好きな科目
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '好きな科目',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
What is your favorite subject at school?',
  25, 35,
  300, 480
);

-- 問題5: 将来やりたいこと
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '将来やりたいこと',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
What do you want to do in the future?',
  25, 35,
  300, 480
);

-- 問題6: 好きな食べ物
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '好きな食べ物',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
What is your favorite food?',
  25, 35,
  300, 480
);

-- 問題7: 音楽を聴くこと
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '音楽について',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
Do you like to listen to music?',
  25, 35,
  300, 480
);

-- 問題8: 雨の日
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '3級', 'essay', '雨の日について',
  'QUESTIONについて、あなたの考えとその理由を２つ英文で書きなさい。
語数の目安は25語〜35語です。

QUESTION:
Do you like rainy days?',
  25, 35,
  300, 480
);
