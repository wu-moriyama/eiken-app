-- seed_writing_prompts_2kyu_summary.sql
-- 英検2級 ライティング 要約問題（010 マイグレーション実行後に実行）
-- 形式: 英文を読んで、その内容を45～55語の英語で要約する
-- 2024年度第1回から新設。3段落構成、advantages/disadvantages 形式が典型的

-- 問題1: リモートワーク（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'リモートワーク',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

In recent years, more people have started working from home instead of commuting to offices. Advances in technology have made it easier to communicate online and share information quickly. As a result, many companies now allow employees to work remotely at least part of the week.

There are several advantages to this change. Working from home saves commuting time and reduces transportation costs. It can also help workers achieve a better work-life balance. In addition, companies may save money because they need less office space.

However, there are also disadvantages. Some employees feel isolated because they have fewer opportunities to talk with coworkers face to face. Communication problems can also occur online. Furthermore, it may be difficult for some people to separate work from their private lives.',
  45, 55,
  600, 900
);

-- 問題2: タブレット教育（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'タブレット導入',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

Nowadays, many schools are introducing tablet computers into classrooms. Instead of using only textbooks, students can access digital materials and search for information online. This change has become more common in recent years.

One benefit of using tablets is that students can learn more interactively. They can watch videos, take online quizzes, and receive immediate feedback. Tablets also reduce the need for printed materials, which may help the environment.

On the other hand, there are some concerns. Students may become distracted by games or social media. In addition, long screen time can cause eye strain. Some teachers and parents also worry that students'' basic writing skills may decline.',
  45, 55,
  600, 900
);

-- 問題3: シェアサイクル（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'シェアサイクル',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

In many cities, bike-sharing services have become popular. People can rent bicycles for short periods and return them to different locations. This system is often supported by smartphone applications.

Bike-sharing has several advantages. It provides an environmentally friendly way to travel and reduces traffic congestion. It is also convenient for short trips and can improve people''s health through regular exercise.

However, there are some problems. Bicycles are sometimes damaged or left in inappropriate places. In addition, maintaining the system can be costly for local governments. Safety is another concern, especially in cities without enough bike lanes.',
  45, 55,
  600, 900
);

-- 問題4: 都市の人口増加（調査参考: KotobaNerds）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', '都市の人口増加',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

The number of people living in cities has been increasing rapidly over the past few decades. Many people move to urban areas in search of better job opportunities, education, and healthcare.

However, the growing population in cities has led to various problems, such as traffic congestion, air pollution, and a higher cost of living. Some experts argue that governments should invest more in public transportation and affordable housing to alleviate these issues.',
  45, 55,
  600, 900
);

-- 問題5: オンラインショッピング
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'オンラインショッピング',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

Online shopping has grown rapidly in recent years. People can buy almost anything from home using computers or smartphones. This convenience has changed the way many people shop.

There are several benefits of online shopping. Customers can compare prices easily and often find lower prices. They can also shop at any time of day. In addition, busy people save time by not having to visit physical stores.

However, there are drawbacks as well. Customers cannot see or try products before buying them. Delivery can take several days, and returns may be inconvenient. Some people also worry about the security of their personal information when paying online.',
  45, 55,
  600, 900
);

-- 問題6: ルームシェア
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'ルームシェア',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

In many cities, especially where rent is high, more people are choosing to live in shared apartments. Roommates split the rent and often share common areas such as the kitchen and living room.

Living with roommates has some advantages. It reduces housing costs, which is helpful for students and young workers. Sharing a home can also reduce loneliness and create opportunities to make new friends.

On the other hand, there can be challenges. People may have different lifestyles or schedules, which can lead to conflicts. Privacy is also limited when sharing space with others. Furthermore, finding compatible roommates is not always easy.',
  45, 55,
  600, 900
);

-- 問題7: ペットを飼うこと
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', 'ペットを飼うこと',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

Many people enjoy having pets such as dogs, cats, or birds. Pets can provide companionship and help reduce stress. In some countries, the number of people who own pets has been increasing.

There are benefits to owning a pet. Pets can encourage their owners to exercise more, especially when walking a dog. They can also help children learn about responsibility. For elderly people, pets may reduce feelings of loneliness.

However, pet ownership also has disadvantages. Pets require time, money, and care every day. Some people develop allergies to animals. In addition, finding housing can be difficult when pets are not allowed.',
  45, 55,
  600, 900
);

-- 問題8: 学校のクラブ活動
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '2級', 'summary', '学校のクラブ活動',
  '以下の英文を読んで、その内容を45～55語の英語で要約しなさい。

School club activities play an important role in student life in many countries. Students can join sports clubs, music clubs, or academic clubs based on their interests. These activities usually take place after regular classes.

Club activities offer several benefits. They help students develop teamwork and leadership skills. Students can also make friends who share the same interests. In addition, regular practice can improve physical fitness or specific talents.

However, there are some concerns. Club activities can be time-consuming and may affect students'' study time. Some students feel pressured to join clubs even when they prefer other activities. Injuries can also occur, especially in sports clubs.',
  45, 55,
  600, 900
);
