'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ChatContainer from '../../../components/chat/ChatContainer';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  last_seen: string;
  status: 'online' | 'offline' | 'away';
}

export default function ChatDetailPage({ params }: { params: { userId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const recipientId = params.userId;
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        fetchRecipient(recipientId);
        fetchMessages(data.user.id, recipientId);
        
        // ポーリングを開始
        startPolling(data.user.id, recipientId);
      } catch (err) {
        console.error('セッションチェックエラー:', err);
        router.push('/login');
      }
    };

    checkSession();

    return () => {
      // クリーンアップ: ポーリングを停止
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [router, recipientId]);

  const startPolling = (userId: string, recipientId: string) => {
    // 10秒ごとにメッセージを更新
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(userId, recipientId, false);
    }, 10000);
  };

  const fetchRecipient = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }
      
      const data = await response.json();
      setRecipient(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMessages = async (userId: string, recipientId: string, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`/api/messages/${recipientId}?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('メッセージの取得に失敗しました');
      }
      
      const data = await response.json();
      
      // 日付順に並べ替え
      const sortedMessages = data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setMessages(sortedMessages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !content.trim()) return;
    
    setIsSending(true);
    
    try {
      const response = await fetch(`/api/messages/${recipientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          senderId: currentUser.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('メッセージの送信に失敗しました');
      }
      
      // 送信成功後にメッセージを再取得
      fetchMessages(currentUser.id, recipientId, false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !currentUser || !recipient) {
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

  // メッセージをUIコンポーネント用に変換
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    timestamp: new Date(msg.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    type: msg.sender_id === currentUser.id ? 'sent' : 'received' as 'sent' | 'received',
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 text-center rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="flex-grow flex flex-col">
          <ChatContainer
            messages={formattedMessages}
            currentUser={{
              username: currentUser.username,
              avatar: currentUser.avatar_url,
              status: currentUser.status,
              lastSeen: new Date(currentUser.last_seen).toLocaleString('ja-JP')
            }}
            recipient={{
              username: recipient.username,
              avatar: recipient.avatar_url,
              status: recipient.status,
              lastSeen: new Date(recipient.last_seen).toLocaleString('ja-JP')
            }}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
          />
        </div>
      </div>
    </div>
  );
}
