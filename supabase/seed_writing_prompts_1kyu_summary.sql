-- seed_writing_prompts_1kyu_summary.sql
-- 英検1級 ライティング 要約問題（010 マイグレーション実行後に実行）
-- 形式: 英文を読んで、自分の言葉で90～110語の英語で要約する
-- 2024年度から導入。約300語の英文、背景→問題→対策→課題の論理構成

-- 問題1: 地球軌道の清掃（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'summary', '地球軌道の清掃',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 90 and 110 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[Cleaning Up Earth''s Orbit]

Since the dawn of the space age, humanity has launched thousands of rockets and satellites into orbit. These technologies have revolutionized communication, weather forecasting, and navigation, becoming indispensable to modern life. However, this progress has come at a cost. The space around our planet is becoming increasingly crowded with "space debris"—defunct satellites, spent rocket stages, and millions of smaller fragments resulting from past collisions.

This accumulation of debris poses a significant threat to future space activities. Objects in orbit travel at incredibly high speeds, meaning even a small screw can carry the force of a hand grenade upon impact. Experts fear a phenomenon known as the "Kessler Syndrome," where a single collision creates a cloud of debris that triggers further collisions, eventually making certain orbits unusable. Such a scenario would jeopardize not only astronauts aboard the International Space Station but also the critical satellite infrastructure that global economies rely on.

In response to this growing danger, space agencies and private companies are developing technologies to remove debris, such as giant nets, harpoons, and magnets to capture and burn up junk in the atmosphere. Despite the technological promise, significant hurdles remain. One major challenge is legal and geopolitical: because debris often consists of military or state-owned technology, removing another nation''s satellite could be interpreted as an act of aggression or theft. Furthermore, the cost of these cleanup missions is astronomical, and there is currently no international framework to decide who should pay for cleaning up the mess in the global commons.',
  90, 110,
  1200, 1500
);

-- 問題2: ギグエコノミーの台頭（ユーザー提供）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'summary', 'ギグエコノミーの台頭',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 90 and 110 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[The Rise of the Gig Economy]

In the modern labor market, a significant shift is occurring as traditional nine-to-five employment is increasingly replaced by the "gig economy." In this system, temporary positions are common and organizations contract with independent workers for short-term engagements. Facilitated by digital platforms, this model allows individuals to work as drivers, delivery couriers, or freelance designers. For many workers, this arrangement offers unprecedented flexibility, allowing them to choose their own hours and balance work with personal commitments or other pursuits.

Proponents of the gig economy argue that it benefits the broader economy by lowering barriers to entry for the workforce. It provides income opportunities for those who might be excluded from traditional employment due to location or schedule constraints. For businesses, hiring independent contractors reduces overhead costs related to office space and employee training. This efficiency often leads to cheaper services for consumers, driving demand and creating a dynamic market ecosystem where labor supply can quickly adjust to meet fluctuations in demand.

However, this transformation has sparked intense debate regarding workers'' rights. Critics point out that gig workers are classified as independent contractors rather than employees, meaning they are often denied basic protections such as health insurance, paid sick leave, and unemployment benefits. This lack of a safety net leaves workers vulnerable to financial instability. Consequently, lawmakers in various countries are struggling to update labor laws. They aim to secure protections for these workers without destroying the flexibility and economic model that make the gig economy popular, yet finding a balance that satisfies both corporations and labor unions remains a complex challenge.',
  90, 110,
  1200, 1500
);

-- 問題3: 気候難民（同形式で作成：背景→問題→対策→課題）
INSERT INTO public.writing_prompts (
  level, prompt_type, title, prompt,
  word_count_min, word_count_max,
  time_limit_min_seconds, time_limit_max_seconds
) VALUES (
  '1級', 'summary', '気候難民',
  '● Read the article below and summarize it in your own words as far as possible in English.
● Summarize it between 90 and 110 words.
● Write your summary in the space provided on Side A of your answer sheet. Any writing outside the space will not be graded.

[Climate Migration]

As global temperatures rise and extreme weather events become more frequent, millions of people are being forced to leave their homes. These "climate migrants" include farmers whose land has been rendered infertile by drought, coastal dwellers displaced by rising sea levels, and communities destroyed by floods or hurricanes. Unlike traditional refugees fleeing persecution, climate migrants often fall into a legal gray area. Existing international frameworks do not formally recognize them, leaving many without protection or support as they cross borders in search of safety.

The scale of the challenge is enormous. The World Bank estimates that by 2050, climate change could force more than 200 million people to migrate within their own countries. In regions such as sub-Saharan Africa, South Asia, and Latin America, the combination of water scarcity, crop failure, and extreme heat threatens to make vast areas uninhabitable. This displacement exacerbates existing tensions over resources, housing, and jobs, potentially fueling conflict and political instability in already vulnerable nations.

Governments and international organizations are gradually beginning to address this issue. Some countries have introduced humanitarian visas for those displaced by environmental disasters. The United Nations has launched initiatives to support adaptation and resilience in at-risk communities. Nevertheless, progress remains slow. There is no binding global agreement on how to protect climate migrants or how to distribute the costs of resettlement. Wealthier nations, which bear the greatest responsibility for historical emissions, have been reluctant to open their borders or provide adequate funding. Without a coordinated international response, the plight of climate migrants is likely to worsen in the decades ahead.',
  90, 110,
  1200, 1500
);
