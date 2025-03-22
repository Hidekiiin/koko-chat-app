import { NextRequest } from 'next/server';
import { getRecentChats } from '@/lib/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const chats = await getRecentChats(process.env.DB as any, userId);
    
    return new Response(JSON.stringify(chats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch recent chats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
