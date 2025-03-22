'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ChatPreview {
  user: {
    id: string;
    username: string;
    avatar_url: string;
    status: 'online' | 'offline' | 'away';
    last_seen: string;
  };
  lastMessage: {
    id: string;
    content: string;
    timestamp: string;
    read: boolean;
  };
}

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // セッションチェック
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!data.authenticated) {
          router.push('/login');
          return;
        }

        setCurrentUser(data.user);
        fetchChats(data.user.id);
      } catch (err) {
        console.error('セッションチェックエラー:', err);
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  const fetchChats = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chats?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('チャット一覧の取得に失敗しました');
      }
      
      const data = await response.json();
      setChats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('ログアウトエラー:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨日';
    } else if (diffDays < 7) {
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      return days[date.getDay()] + '曜日';
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">koko</h1>
          {currentUser && (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">{currentUser.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>

        {/* チャット一覧 */}
        {error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : chats.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>チャットがありません</p>
            <p className="mt-2 text-sm">新しい会話を始めましょう</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {chats.map((chat) => (
              <li key={chat.user.id}>
                <Link href={`/chat/${chat.user.id}`}>
                  <div className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={chat.user.avatar_url || '/default-avatar.png'}
                          alt={chat.user.username}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        chat.user.status === 'online' 
                          ? 'bg-green-500' 
                          : chat.user.status === 'away' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {chat.user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(chat.lastMessage.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                          {chat.lastMessage.content}
                        </p>
                        {!chat.lastMessage.read && chat.lastMessage.sender_id !== currentUser?.id && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-xs">
                            新
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
