import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database;

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get user by email
    const user = await getUserByEmail(process.env.DB as any, email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // In a real app, you would verify the password hash here
    // For demo purposes, we're skipping that step
    
    // Create a session
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email
    };
    
    // Set a cookie with the session
    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set('koko_session', JSON.stringify(session), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ error: 'Failed to log in' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
