import { NextRequest } from 'next/server';
import { getMessages, sendMessage, markMessagesAsRead } from '@/lib/database';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { recipientId: string } }
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const messages = await getMessages(process.env.DB as any, userId, params.recipientId, limit);
    
    // Mark messages as read
    await markMessagesAsRead(process.env.DB as any, userId, params.recipientId);
    
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { recipientId: string } }
) {
  try {
    const body = await request.json();
    const { content, senderId } = body;
    
    if (!content || !senderId) {
      return new Response(JSON.stringify({ error: 'Content and sender ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const message = await sendMessage(process.env.DB as any, {
      content,
      sender_id: senderId,
      receiver_id: params.recipientId
    });
    
    return new Response(JSON.stringify(message), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
