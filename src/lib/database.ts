import { D1Database } from '@cloudflare/workers-types';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  last_seen: string;
  status: 'online' | 'offline' | 'away';
}

export async function getMessages(db: D1Database, userId: string, recipientId: string, limit = 50): Promise<Message[]> {
  const { results } = await db.prepare(`
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp DESC
    LIMIT ?
  `)
  .bind(userId, recipientId, recipientId, userId, limit)
  .all();
  
  return results as Message[];
}

export async function sendMessage(db: D1Database, message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  await db.prepare(`
    INSERT INTO messages (id, content, sender_id, receiver_id, timestamp, read)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  .bind(id, message.content, message.sender_id, message.receiver_id, timestamp, false)
  .run();
  
  return {
    id,
    content: message.content,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    timestamp,
    read: false
  };
}

export async function markMessagesAsRead(db: D1Database, userId: string, senderId: string): Promise<void> {
  await db.prepare(`
    UPDATE messages
    SET read = true
    WHERE receiver_id = ? AND sender_id = ? AND read = false
  `)
  .bind(userId, senderId)
  .run();
}

export async function getUser(db: D1Database, userId: string): Promise<User | null> {
  const { results } = await db.prepare(`
    SELECT * FROM users WHERE id = ?
  `)
  .bind(userId)
  .all();
  
  if (results.length === 0) {
    return null;
  }
  
  return results[0] as User;
}

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const { results } = await db.prepare(`
    SELECT * FROM users WHERE email = ?
  `)
  .bind(email)
  .all();
  
  if (results.length === 0) {
    return null;
  }
  
  return results[0] as User;
}

export async function createUser(db: D1Database, user: Omit<User, 'id' | 'last_seen' | 'status'>): Promise<User> {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  await db.prepare(`
    INSERT INTO users (id, username, email, avatar_url, last_seen, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  .bind(id, user.username, user.email, user.avatar_url, timestamp, 'offline')
  .run();
  
  return {
    id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    last_seen: timestamp,
    status: 'offline'
  };
}

export async function updateUserStatus(db: D1Database, userId: string, status: User['status']): Promise<void> {
  const timestamp = new Date().toISOString();
  
  await db.prepare(`
    UPDATE users
    SET status = ?, last_seen = ?
    WHERE id = ?
  `)
  .bind(status, timestamp, userId)
  .run();
}

export async function getRecentChats(db: D1Database, userId: string): Promise<{user: User, lastMessage: Message}[]> {
  const { results } = await db.prepare(`
    WITH recent_messages AS (
      SELECT 
        m.*,
        ROW_NUMBER() OVER (
          PARTITION BY 
            CASE 
              WHEN m.sender_id = ? THEN m.receiver_id 
              ELSE m.sender_id 
            END
          ORDER BY m.timestamp DESC
        ) as rn,
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id
      FROM messages m
      WHERE m.sender_id = ? OR m.receiver_id = ?
    )
    SELECT 
      u.id, u.username, u.email, u.avatar_url, u.last_seen, u.status,
      rm.id as message_id, rm.content, rm.sender_id, rm.receiver_id, rm.timestamp, rm.read
    FROM recent_messages rm
    JOIN users u ON u.id = rm.other_user_id
    WHERE rm.rn = 1
    ORDER BY rm.timestamp DESC
  `)
  .bind(userId, userId, userId, userId)
  .all();
  
  return results.map((row: any) => ({
    user: {
      id: row.id,
      username: row.username,
      email: row.email,
      avatar_url: row.avatar_url,
      last_seen: row.last_seen,
      status: row.status
    },
    lastMessage: {
      id: row.message_id,
      content: row.content,
      sender_id: row.sender_id,
      receiver_id: row.receiver_id,
      timestamp: row.timestamp,
      read: Boolean(row.read)
    }
  }));
}
// src/lib/database.ts
const isVercelProduction = process.env.VERCEL_ENV === 'production';

// Vercel環境用のモックデータ
const mockUsers = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    password: 'hashed_password',
    avatar_url: '/default-avatar.png',
    status: 'online',
    last_seen: new Date().toISOString()
  },
  // 他のモックユーザー
];

const mockMessages = [
  // モックメッセージデータ
];

// データベース関数
export async function getUserByEmail(email: string) {
  if (isVercelProduction) {
    // Vercel環境ではモックデータを使用
    return mockUsers.find(user => user.email === email) || null;
  }
  
  // 通常の実装（ローカル環境用）
  // 元のデータベース接続コード
}

// 他のデータベース関数も同様に修正
