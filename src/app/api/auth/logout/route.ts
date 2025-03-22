import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set('koko_session', '', {
      httpOnly: true,
      maxAge: 0, // Expire immediately
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return new Response(JSON.stringify({ error: 'Failed to log out' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
