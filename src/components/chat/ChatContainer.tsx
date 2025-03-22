import React from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import UserProfile from './UserProfile';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
  username?: string;
  avatar?: string;
}

interface ChatContainerProps {
  messages: Message[];
  currentUser: {
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: string;
  };
  recipient: {
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: string;
  };
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  currentUser,
  recipient,
  onSendMessage,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* ヘッダー - 相手のプロフィール */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <UserProfile
          username={recipient.username}
          avatar={recipient.avatar}
          status={recipient.status}
          lastSeen={recipient.lastSeen}
        />
      </div>
      
      {/* メッセージエリア */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">メッセージはまだありません。会話を始めましょう！</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              type={message.type}
              username={message.username || (message.type === 'received' ? recipient.username : currentUser.username)}
              avatar={message.avatar || (message.type === 'received' ? recipient.avatar : currentUser.avatar)}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* 入力エリア */}
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
