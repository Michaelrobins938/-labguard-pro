import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For beta testing, accept any valid email/password combination
    // In production, this would validate against a database
    if (email && password.length >= 6) {
      // Mock successful login
      return NextResponse.json(
        { 
          message: 'Login successful',
          user: {
            id: '1',
            email,
            name: 'Beta User',
            role: 'ADMIN'
          }
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 