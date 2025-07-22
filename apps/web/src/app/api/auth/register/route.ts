import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword,
      laboratoryName,
      laboratoryType,
      role 
    } = body

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !laboratoryName) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // For beta testing, accept any valid registration
    // In production, this would save to a database
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: '1',
          email,
          firstName,
          lastName,
          laboratoryName,
          laboratoryType,
          role
        }
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 