-- seed_writing_prompts_jun2kyu_email.sql
-- 英検準2級 ライティング Eメール問題（010 マイグレーション実行後に実行）
-- 形式: 外国人の知り合いからのEメールへの返信（質問への回答＋下線部への質問2つ）
-- 語数: 40〜50語

-- 問題1: Emma - ボランティアクラブ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', 'ボランティアクラブについて（Emma）',
  '{"emailFrom":"Emma","emailContent":"Hi!\n\nI joined a volunteer club at my school last month. We clean parks and help elderly people in our town. It is hard work, but I feel happy when I see people smile. I think volunteering is important for students.\n\nI spend about three hours every weekend doing volunteer work.\n\nDo you think students should do volunteer activities?\n\nYour friend,\nEmma","underlinedPart":"I spend about three hours every weekend doing volunteer work.","question":"Do you think students should do volunteer activities?"}',
  40, 50,
  360, 600
);

-- 問題2: Ryan - スポーツクラブ（テニス）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', 'スポーツクラブについて（Ryan）',
  '{"emailFrom":"Ryan","emailContent":"Hi!\n\nI started going to a sports club after school this year. I chose the tennis club because I wanted to try something new. I practice three times a week, and sometimes I feel very tired. But I enjoy playing with my teammates.\n\nOur coach is very strict but always gives us helpful advice.\n\nDo you think joining a sports club is good for students?\n\nYour friend,\nRyan","underlinedPart":"Our coach is very strict but always gives us helpful advice.","question":"Do you think joining a sports club is good for students?"}',
  40, 50,
  360, 600
);

-- 問題3: Lisa - プラスチックゴミ削減
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', '環境保護について（Lisa）',
  '{"emailFrom":"Lisa","emailContent":"Hi!\n\nLast month, my family decided to reduce plastic waste. We bring our own bags when we go shopping and try not to buy plastic bottles. At first, it was difficult, but now it feels natural.\n\nWe also started using a reusable water bottle every day.\n\nDo you think small actions like these can help the environment?\n\nYour friend,\nLisa","underlinedPart":"We also started using a reusable water bottle every day.","question":"Do you think small actions like these can help the environment?"}',
  40, 50,
  360, 600
);

-- 問題4: Tom - 音楽クラブ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', '音楽クラブについて（Tom）',
  '{"emailFrom":"Tom","emailContent":"Hi!\n\nI joined the music club at my school last April. I play the guitar and we have a band with four members. We practice together twice a week after school. It is challenging but very fun.\n\nWe are going to play at the school festival in October.\n\nDo you think learning a musical instrument is good for students?\n\nYour friend,\nTom","underlinedPart":"We are going to play at the school festival in October.","question":"Do you think learning a musical instrument is good for students?"}',
  40, 50,
  360, 600
);

-- 問題5: Sarah - 図書館・読書クラブ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', '読書クラブについて（Sarah）',
  '{"emailFrom":"Sarah","emailContent":"Hi!\n\nI love reading books. I joined the reading club at my school this year. We meet every Thursday and talk about our favorite books. I enjoy learning about different stories and characters.\n\nMy favorite kind of book is mystery because I like solving puzzles.\n\nDo you think reading books is important for students?\n\nYour friend,\nSarah","underlinedPart":"My favorite kind of book is mystery because I like solving puzzles.","question":"Do you think reading books is important for students?"}',
  40, 50,
  360, 600
);

-- 問題6: Jake - 料理
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', '料理について（Jake）',
  '{"emailFrom":"Jake","emailContent":"Hi!\n\nI started cooking with my mom last year. At first, I could only make simple things like eggs. But now I can make pasta and curry. Cooking is fun and it helps me understand different cultures.\n\nWe usually cook Italian food on weekends because my dad loves it.\n\nDo you think learning to cook is useful for students?\n\nYour friend,\nJake","underlinedPart":"We usually cook Italian food on weekends because my dad loves it.","question":"Do you think learning to cook is useful for students?"}',
  40, 50,
  360, 600
);

-- 問題7: Mia - アルバイト
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', 'アルバイトについて（Mia）',
  '{"emailFrom":"Mia","emailContent":"Hi!\n\nI got a part-time job at a cafe last month. I work there on Saturday and Sunday mornings. It is tiring but I can save money for my school trip. I also enjoy talking to customers.\n\nI work four hours each day from 9 a.m. to 1 p.m.\n\nDo you think having a part-time job is good for high school students?\n\nYour friend,\nMia","underlinedPart":"I work four hours each day from 9 a.m. to 1 p.m.","question":"Do you think having a part-time job is good for high school students?"}',
  40, 50,
  360, 600
);

-- 問題8: Alex - ホームステイ
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準2級', 'email', 'ホームステイについて（Alex）',
  '{"emailFrom":"Alex","emailContent":"Hi!\n\nI am going to study abroad in Australia next summer. I will stay for two weeks with a host family. I am excited but also nervous. I want to improve my English and learn about Australian culture.\n\nMy host family has two children who are about my age.\n\nDo you think studying abroad is a good experience for students?\n\nYour friend,\nAlex","underlinedPart":"My host family has two children who are about my age.","question":"Do you think studying abroad is a good experience for students?"}',
  40, 50,
  360, 600
);
