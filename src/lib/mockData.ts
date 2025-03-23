export const MOCK_USERS = [
    {
      id: '1',
      username: 'ユーザー1',
      email: 'user1@example.com',
      avatar_url: '/default-avatar.png',
      status: 'online',
      last_seen: new Date().toISOString()
    },
    {
      id: '2',
      username: 'ユーザー2',
      email: 'user2@example.com',
      avatar_url: '/default-avatar.png',
      status: 'offline',
      last_seen: new Date().toISOString()
    },
    {
      id: '3',
      username: 'ユーザー3',
      email: 'user3@example.com',
      avatar_url: '/default-avatar.png',
      status: 'away',
      last_seen: new Date().toISOString()
    }
  ];
  
  export const MOCK_MESSAGES = [
    {
      id: '1',
      content: 'こんにちは！',
      sender_id: '1',
      receiver_id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: '2',
      content: 'お元気ですか？',
      sender_id: '2',
      receiver_id: '1',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      read: true
    },
    {
      id: '3',
      content: '元気です！あなたは？',
      sender_id: '1',
      receiver_id: '2',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      read: true
    },
    {
      id: '4',
      content: '私も元気です。今日は天気がいいですね。',
      sender_id: '2',
      receiver_id: '1',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false
    },
    {
      id: '5',
      content: 'こんにちは、初めまして！',
      sender_id: '3',
      receiver_id: '1',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      read: false
    }
  ];
  
  export const MOCK_CHATS = [
    {
      user: MOCK_USERS[1],
      lastMessage: MOCK_MESSAGES[3]
    },
    {
      user: MOCK_USERS[2],
      lastMessage: MOCK_MESSAGES[4]
    }
  ];
  