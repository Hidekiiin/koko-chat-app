# kokoチャットアプリのデプロイ手順

このドキュメントでは、kokoチャットアプリをVercelとGitHubを使用してデプロイする方法を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料プランで可）

## 手順

### 1. GitHubリポジトリの作成

1. GitHubにログインします
2. 新しいリポジトリを作成します（例: `koko-chat-app`）
3. リポジトリを公開または非公開に設定します
4. リポジトリを作成します

### 2. ローカルプロジェクトをGitHubにプッシュ

```bash
# プロジェクトディレクトリに移動
cd /path/to/koko

# Gitリポジトリを初期化（すでに初期化されている場合はスキップ）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加
git remote add origin https://github.com/yourusername/koko-chat-app.git

# プッシュ
git push -u origin main
```

### 3. Vercelでのデプロイ

1. [Vercel](https://vercel.com/)にログインします
2. 「New Project」をクリックします
3. GitHubからインポートするリポジトリとして `koko-chat-app` を選択します
4. プロジェクト設定を確認します：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: デフォルト（`next build`）
   - Output Directory: デフォルト（`.next`）
5. 環境変数を設定します（必要に応じて）
6. 「Deploy」ボタンをクリックします

### 4. データベースの設定

Vercelでデプロイした後、本番環境用のデータベースを設定する必要があります：

1. Vercelダッシュボードでプロジェクトを選択します
2. 「Settings」→「Environment Variables」に移動します
3. 以下の環境変数を追加します：
   - `DATABASE_URL`: 本番環境のデータベースURL

### 5. 初期データの投入

本番環境のデータベースに初期データを投入します：

```bash
# ローカルから本番環境のデータベースに接続
npx wrangler d1 execute PRODUCTION_DB --remote --file=migrations/0001_initial.sql
```

### 6. デプロイの確認

1. Vercelが提供するURLにアクセスします（例: `https://koko-chat-app.vercel.app`）
2. アプリケーションが正常に動作することを確認します
3. ログイン、登録、チャット機能をテストします

## トラブルシューティング

- デプロイに失敗した場合は、Vercelのビルドログを確認してください
- データベース接続の問題がある場合は、環境変数が正しく設定されているか確認してください
- APIエンドポイントが機能しない場合は、サーバレス関数が正しくデプロイされているか確認してください

## 更新のデプロイ

アプリケーションを更新する場合は、変更をGitHubリポジトリにプッシュするだけです：

```bash
git add .
git commit -m "Update description"
git push
```

Vercelは自動的に新しいデプロイを開始します。
