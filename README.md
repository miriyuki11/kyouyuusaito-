# pick / kyouyuusaito-

最近買ってよかったものをシェアする Next.js アプリです。

## ローカルで起動

Node.js 24 LTS と npm を使用します（動作確認: Node.js 24.19.0 / npm 11.17.0）。

```powershell
npm ci
npm run dev
```

ブラウザーで http://localhost:3000 を開きます。終了はターミナルで `Ctrl+C`。
ポートが使用中の場合は、起動ログに表示された URL を開いてください。

Supabase の設定なしで、サイトの閲覧とブラウザー内に保存する機能を利用できます。
現在、画面からの投稿はブラウザーの localStorage に保存され、別の端末とは共有されません。
ログイン・新規登録および `/api/posts` の利用には、以下の接続設定が必要です。

## Supabase の接続設定（後から設定可能）

```powershell
Copy-Item .env.example .env.local
```

`.env.local` に Supabase プロジェクトの URL と Publishable key を記入し、開発サーバーを再起動します。
`service_role` などの秘密キーを `NEXT_PUBLIC_` 変数に設定しないでください。
認証を利用する場合は Supabase 側で Email 認証と、開発用の Site URL `http://localhost:3000` を設定します。
`/api/posts` は Supabase 側の `posts` テーブルと適切なアクセス制御も必要です。
このリポジトリにはテーブル作成用のマイグレーションは含まれていません。

## 確認用コマンド

```powershell
npm run lint
npm run build
npm run start
```

`npm run start` はビルド後に実行します。Google Fonts を取得するため、初回の開発起動・ビルド時はインターネット接続が必要です。
