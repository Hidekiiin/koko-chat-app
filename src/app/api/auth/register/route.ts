import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;
    
    if (!email || !username || !password) {
      return new Response(JSON.stringify({ error: 'Email, username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(process.env.DB as any, email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // In a real app, you would hash the password here
    // For demo purposes, we're skipping that step
    
    // Create new user
    const user = await createUser(process.env.DB as any, {
      username,
      email,
      avatar_url: `/avatars/default-${Math.floor(Math.random() * 5) + 1}.png`
    });
    
    // Create a session (in a real app, this would be more secure)
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email
    };
    
    // Set a cookie with the session
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('koko_session', JSON.stringify(session), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
