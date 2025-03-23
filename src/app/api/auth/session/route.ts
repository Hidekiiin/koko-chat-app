import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/database';


export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // セッション確認のロジックをシンプルにする
    return NextResponse.json({ 
      authenticated: false,
      user: null
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'セッションの確認に失敗しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('koko_session');
    
    if (!sessionCookie?.value) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    try {
      const session = JSON.parse(sessionCookie.value);
      
      if (!session.userId) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Verify user exists
      const user = await getUser(process.env.DB as any, session.userId);
      
      if (!user) {
        // Invalid session, clear it
        const response = NextResponse.json({ authenticated: false }, { status: 401 });
        response.cookies.set('koko_session', '', {
          httpOnly: true,
          maxAge: 0,
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
        
        return response;
      }
      
      return new Response(JSON.stringify({ 
        authenticated: true,
        user
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      // Invalid session format, clear it
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.set('koko_session', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      return response;
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return new Response(JSON.stringify({ error: 'Failed to check authentication status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
