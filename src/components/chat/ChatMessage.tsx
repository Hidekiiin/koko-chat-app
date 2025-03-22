import React from 'react';
import Image from 'next/image';

type MessageType = 'sent' | 'received';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  type: MessageType;
  username?: string;
  avatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  type,
  username = 'User',
  avatar = '/default-avatar.png',
}) => {
  const isSent = type === 'sent';

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            {avatar && (
              <Image
                src={avatar}
                alt={username}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.png';
                }}
              />
            )}
          </div>
        </div>
        
        <div className={`flex flex-col mx-2 ${isSent ? 'items-end' : 'items-start'}`}>
          <div className="text-xs text-gray-500 mb-1">
            {isSent ? 'You' : username} • {timestamp}
          </div>
          <div 
            className={`rounded-2xl px-4 py-2 break-words ${
              isSent 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
