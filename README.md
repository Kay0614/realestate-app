# realestate-app

Supabase認証付きの不動産管理Webアプリ（React + Vite）。

## 機能
- メールアドレス＋パスワードでの会員登録・ログイン
- ログイン後に物件一覧（ダミーデータ）を表示
- 未ログイン時はログイン画面へリダイレクト
- ログアウト

## セットアップ
```bash
npm install
cp .env.example .env   # SupabaseのProject URLとPublishable keyを設定
npm run dev            # http://localhost:3000
```

## ディレクトリ構成
- `src/lib/supabaseClient.js` … Supabaseクライアント
- `src/contexts/AuthContext.jsx` … 認証状態の管理
- `src/components/ProtectedRoute.jsx` … ログイン必須・ゲスト専用ルート
- `src/pages/` … ログイン・会員登録・物件一覧画面
- `src/data/properties.js` … 物件のダミーデータ

## 補足
- Supabaseでメール確認が有効な場合、会員登録後に届くメールのリンクを開いてからログインする。
- 確認メールのリンク先を変える場合は、Supabaseの Authentication → URL Configuration で Site URL / Redirect URLs を設定する。
