-- 初期データベーススキーマ設定
-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  last_seen TEXT NOT NULL,
  status TEXT CHECK(status IN ('online', 'offline', 'away')) NOT NULL
);

-- メッセージテーブル
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- サンプルデータ挿入
INSERT INTO users (id, username, email, avatar_url, last_seen, status)
VALUES 
  ('user-1', 'Tanaka', 'tanaka@example.com', '/avatars/tanaka.png', '2025-03-22T12:00:00.000Z', 'online'),
  ('user-2', 'Suzuki', 'suzuki@example.com', '/avatars/suzuki.png', '2025-03-22T11:30:00.000Z', 'offline'),
  ('user-3', 'Yamada', 'yamada@example.com', '/avatars/yamada.png', '2025-03-22T10:45:00.000Z', 'away');

-- サンプルメッセージ
INSERT INTO messages (id, content, sender_id, receiver_id, timestamp, read)
VALUES
  ('msg-1', 'こんにちは、元気ですか？', 'user-1', 'user-2', '2025-03-22T09:00:00.000Z', 1),
  ('msg-2', 'はい、元気です！あなたは？', 'user-2', 'user-1', '2025-03-22T09:05:00.000Z', 1),
  ('msg-3', '私も元気です。今日は天気がいいですね。', 'user-1', 'user-2', '2025-03-22T09:10:00.000Z', 1),
  ('msg-4', 'やあ、久しぶり！', 'user-3', 'user-1', '2025-03-22T10:30:00.000Z', 0),
  ('msg-5', '週末に予定ある？', 'user-3', 'user-1', '2025-03-22T10:35:00.000Z', 0);
