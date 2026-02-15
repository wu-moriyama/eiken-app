-- seed_writing_prompts_jun1kyu_summary.sql
-- 英検準1級 ライティング 要約問題（010 マイグレーション実行後に実行）
-- 形式: 英文を読んで、自分の言葉で60～70語の英語で要約する
-- 2024年度から導入。約200語の英文、3段落（導入・賛成派・反対派）構成

-- 問題1: 淡水化（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'summary', '淡水化（Desalination）',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 60 and 70 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[Desalination]

Fresh water is essential for human life, but it is becoming scarce in many parts of the world due to climate change and population growth. To solve this problem, some countries are turning to a process called desalination. This technology removes salt and other minerals from seawater to produce water that is safe for humans to drink.

Supporters argue that desalination is a vital technology for the future. The primary benefit is that it provides a reliable source of water that does not depend on rainfall. While droughts can dry up rivers and lakes, the ocean provides a limitless supply. Furthermore, having a local desalination plant allows dry regions to be independent, meaning they do not have to rely on buying water from other countries.

However, critics point out significant drawbacks to this method. The process requires a large amount of energy to separate salt from water, which makes it very expensive compared to traditional water sources. Additionally, there are environmental concerns. The leftover waste, which contains highly concentrated salt and chemicals, is often pumped back into the ocean. This can harm local marine life and damage ocean ecosystems.',
  60, 70,
  900, 1200
);

-- 問題2: キャッシュレス社会（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'summary', 'キャッシュレス社会',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 60 and 70 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[A Cashless Society]

In recent years, the way people pay for goods and services has changed dramatically. Many countries are moving quickly toward a "cashless society," where physical money, such as coins and bills, is no longer used. Instead, people rely on credit cards or smartphone applications to make their daily transactions.

Supporters believe this shift is highly beneficial for society. First, electronic payments offer great convenience. They are much faster than counting out change, which saves time for both shoppers and store employees. Second, a cashless society can improve public safety. If businesses and individuals do not carry large amounts of cash, there is significantly less risk of robbery and theft.

However, critics have serious concerns about disappearing cash. One major issue is privacy. When people pay digitally, banks and companies can track exactly what they buy and where they go, leading to a loss of personal freedom. Another problem is the reliance on technology. If there is a power outage or a computer system failure, people will be unable to buy essential items like food or medicine.',
  60, 70,
  900, 1200
);

-- 問題3: AIと仕事（同形式で作成）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '準1級', 'summary', 'AIと仕事',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 60 and 70 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[Artificial Intelligence in the Workplace]

Artificial intelligence, or AI, is increasingly being used in workplaces around the world. From chatbots that answer customer questions to software that analyzes data, AI tools are changing how many people do their jobs. Some experts predict that AI will transform almost every industry within the next decade.

Supporters argue that AI brings significant benefits to businesses and workers. One advantage is increased efficiency. AI can complete repetitive tasks much faster than humans, allowing employees to focus on more creative or complex work. Another benefit is that AI can help companies make better decisions by processing large amounts of information quickly. In addition, AI may create new types of jobs that did not exist before.

However, critics raise serious concerns about the spread of AI. A major worry is job loss. As AI becomes more capable, it may replace workers in many fields, from drivers to office workers. There are also ethical concerns about how AI is used. For example, if AI systems are used to evaluate job applicants, they may unintentionally discriminate against certain groups. Furthermore, an over-reliance on AI could make humans less able to think independently.',
  60, 70,
  900, 1200
);
