# realestate-app

Supabase認証付きの不動産管理Webアプリ（React + Vite）。

## 機能
- メールアドレス＋パスワードでの会員登録・ログイン
- 物件（物件名・家賃・エリア名・間取り）の一覧・登録・編集・削除
- RLSにより、自分が登録した物件だけを表示・編集・削除できる
- 未ログイン時はログイン画面へリダイレクト
- ログアウト

## セットアップ
1. Supabaseダッシュボードの **SQL Editor** で [supabase/schema.sql](supabase/schema.sql) を実行し、`properties` テーブルとRLSポリシーを作成する。
2. 以下を実行する。
   ```bash
   npm install
   cp .env.example .env   # SupabaseのProject URLとPublishable keyを設定
   npm run dev            # http://localhost:3000
   ```

## ディレクトリ構成
- `supabase/schema.sql` … テーブル・RLSポリシーを作成するSQL
- `src/lib/supabaseClient.js` … Supabaseクライアント
- `src/lib/propertiesApi.js` … 物件のCRUD操作
- `src/contexts/AuthContext.jsx` … 認証状態の管理
- `src/components/ProtectedRoute.jsx` … ログイン必須・ゲスト専用ルート
- `src/components/PropertyForm.jsx` … 物件の登録・編集フォーム
- `src/pages/` … ログイン・会員登録・物件一覧画面

## Vercelへのデプロイ
- [vercel.json](vercel.json) で、どのURLにアクセスされても `index.html` を返す（`/properties` などを直接開いたり再読み込みしたりしても404にならない）。
- 環境変数はVercelダッシュボードの Settings → Environment Variables で設定する（`vercel.json` には含めない）。
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Viteは環境変数をビルド時に埋め込むため、変数を追加・変更したら再デプロイする。
- Supabaseの Authentication → URL Configuration で、公開URLを Site URL / Redirect URLs に追加する。

## 補足
- Supabaseでメール確認が有効な場合、会員登録後に届くメールのリンクを開いてからログインする。
- 確認メールのリンク先を変える場合は、Supabaseの Authentication → URL Configuration で Site URL / Redirect URLs を設定する。
