# 管理画面 設計書

## 1. 概要

管理者専用の画面を `/admin` 以下に構築する。
一般ユーザーはアクセス不可。管理者ログイン時のみ表示される。

---

## 2. 管理者の識別

### 方式: `user_profiles.role` カラム追加

- `role`: `'user'` | `'admin'`（デフォルト `'user'`）
- 既存ユーザーは `'user'`
- 管理者にするには DB で `role = 'admin'` に更新

```sql
-- 012_admin_role.sql
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
```

### 運用

- 初回: 特定メール（例: s_moriyama@writeup.co.jp）のユーザーを手動で `role = 'admin'` に更新
- 管理画面から他ユーザーを管理者に昇格することも可能（要実装）

---

## 3. 機能一覧

| 機能 | 説明 | データソース |
|------|------|--------------|
| **ユーザー一覧** | 登録ユーザーの検索・一覧 | `user_profiles` + `auth.users` |
| **ユーザー詳細・編集** | 表示名・目標級・ロールの編集 | `user_profiles` |
| **ユーザー新規登録** | メール・パスワードでアカウント作成 | Supabase Auth Admin API |
| **学習ログ** | 各ユーザーの学習履歴 | `user_activity_log`, `vocabulary_quiz_results`, `writing_submissions` |
| **単語登録** | 単語の追加・編集・削除 | `vocabulary` |
| **ライティング問題登録** | 問題の追加・編集・削除 | `writing_prompts` |

---

## 4. データベース・RLS

### 4.1 管理者用 RLS ポリシー

管理者は以下を実行可能にする必要がある:

| テーブル | 管理者に許可する操作 |
|----------|----------------------|
| `user_profiles` | SELECT 全件, UPDATE 全件 |
| `user_activity_log` | SELECT 全件 |
| `daily_streaks` | SELECT 全件 |
| `vocabulary` | SELECT, INSERT, UPDATE, DELETE |
| `writing_prompts` | SELECT, INSERT, UPDATE, DELETE |
| `vocabulary_quiz_results` | SELECT 全件 |
| `writing_submissions` | SELECT 全件 |

`is_admin()` のような関数を作成し、ポリシーで参照する。

```sql
-- 管理者判定関数
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### 4.2 ユーザー新規作成

Supabase Auth の `admin.createUser()` を使用する。**Service Role Key** が必要。
アプリ側では API Route で Service Role クライアントを使い、呼び出し元が管理者であることを確認してから実行する。

---

## 5. ルーティング構成

```
/admin                    → ダッシュボード（概要）
/admin/users              → ユーザー一覧
/admin/users/[id]         → ユーザー詳細・編集
/admin/users/new          → ユーザー新規登録
/admin/users/[id]/logs    → ユーザー学習ログ
/admin/vocabulary         → 単語一覧・登録
/admin/vocabulary/[id]    → 単語編集
/admin/writing            → ライティング問題一覧・登録
/admin/writing/[id]       → ライティング問題編集
```

---

## 6. 技術的な実装方針

1. **管理者チェック**: Server Component または API Route で `user_profiles.role = 'admin'` を確認
2. **レイアウト**: `/admin/layout.tsx` で管理者判定、未承認時は `/dashboard` へリダイレクト
3. **ナビ**: 管理者の場合のみ AppShell に「管理画面」リンクを表示
4. **Service Role**: `.env.local` に `SUPABASE_SERVICE_ROLE_KEY` を追加（ユーザー新規作成用 API のみで使用）
5. **既存の anon key**: 管理者ポリシーがあれば、一覧・編集・単語・問題の CRUD は anon クライアントで可能

---

## 7. 実装フェーズ

| フェーズ | 内容 | 工数目安 |
|----------|------|----------|
| **Phase 1** | DB マイグレーション（role, is_admin, RLS ポリシー）、管理画面レイアウト・認可、ユーザー一覧・詳細・編集 | 中 |
| **Phase 2** | 学習ログ閲覧、単語 CRUD、ライティング問題 CRUD | 中 |
| **Phase 3** | ユーザー新規登録（Service Role API）、管理者昇格 UI | 小 |

---

## 8. 参考: 既存テーブル構造

- `user_profiles`: id, auth_user_id, display_name, target_level, avatar_url, avatar_style, created_at
- `vocabulary`: id, level, word, meaning_ja, part_of_speech, category, pronunciation, example_en, example_ja
- `writing_prompts`: id, level, prompt_type, title, prompt, word_count_min, word_count_max, time_limit_min_seconds, time_limit_max_seconds
- `user_activity_log`: user_id, activity_type, payload, created_at
- `vocabulary_quiz_results`: user_id, vocabulary_id, is_correct, created_at
- `writing_submissions`: user_id, prompt_id, content, scores..., ai_feedback, created_at
