# QUICKSTART - eiken-app

## 1. 依存関係のインストール

```bash
npm install
```

## 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` に以下を設定します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 3. Supabase セットアップ

1. Supabase プロジェクトを作成
2. `supabase/migrations/*.sql` を SQL Editor で順に流す

## 4. 開発サーバー起動

```bash
npm run dev
```

