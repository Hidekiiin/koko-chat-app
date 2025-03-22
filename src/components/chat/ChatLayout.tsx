import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  sidebar,
  main,
  isMobileSidebarOpen = false,
  onToggleMobileSidebar = () => {},
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* サイドバー - モバイルでは条件付き表示 */}
      <div 
        className={`
          ${isMobile ? 'fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out' : 'w-80 flex-shrink-0'}
          ${isMobile && !isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        `}
      >
        {sidebar}
      </div>

      {/* オーバーレイ - モバイルでサイドバー表示時のみ */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={onToggleMobileSidebar}
        />
      )}

      {/* メインコンテンツ */}
      <div className="flex-grow flex flex-col">
        {/* モバイル用ヘッダー */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center">
            <button 
              onClick={onToggleMobileSidebar}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">koko</h1>
          </div>
        )}

        {/* メインコンテンツエリア */}
        <div className="flex-grow overflow-hidden">
          {main}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
