#!/bin/bash

# アプリケーションのテスト手順
echo "kokoチャットアプリのテストを開始します..."

# データベースの初期化
echo "データベースを初期化しています..."
cd /home/ubuntu/koko
npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql

# 開発サーバーの起動
echo "開発サーバーを起動しています..."
cd /home/ubuntu/koko
npm run dev &
SERVER_PID=$!

# サーバーが起動するまで待機
echo "サーバーの起動を待機しています..."
sleep 10

echo "テスト完了！サーバーを停止します..."
kill $SERVER_PID

echo "kokoチャットアプリのテストが完了しました。"
