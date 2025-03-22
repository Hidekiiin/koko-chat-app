import React from 'react';
import Image from 'next/image';

interface UserProfileProps {
  username: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  isCurrentUser?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  username,
  avatar = '/default-avatar.png',
  status = 'offline',
  lastSeen,
  isCurrentUser = false,
}) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={username}
            width={48}
            height={48}
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
        </div>
        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColors[status]} border-2 border-white dark:border-gray-900`}></div>
      </div>
      
      <div className="ml-3">
        <div className="font-medium text-gray-900 dark:text-white flex items-center">
          {username}
          {isCurrentUser && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {status === 'online' ? 'オンライン' : lastSeen ? `最終アクセス: ${lastSeen}` : 'オフライン'}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
