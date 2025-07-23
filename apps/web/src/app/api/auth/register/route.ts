import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthService } from '@/lib/auth-service'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  laboratoryName: z.string().min(1, 'Laboratory name is required').max(100),
  laboratoryType: z.enum(['clinical', 'research', 'industrial', 'academic']).optional(),
  role: z.enum(['lab_manager', 'technician', 'supervisor', 'viewer']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Validate password confirmation
    if (validatedData.password !== validatedData.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await AuthService.findUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create laboratory and user in transaction
    const result = await AuthService.createLaboratoryAndUser({
      userData: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: validatedData.password,
        role: validatedData.role || 'lab_manager'
      },
      laboratoryData: {
        name: validatedData.laboratoryName,
        email: validatedData.email,
        type: validatedData.laboratoryType || 'clinical'
      }
    })

    // Create email verification token
    const verificationToken = await AuthService.createEmailVerificationToken(result.user.id)
    
    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken.token}`
    await AuthService.sendEmailVerification(validatedData.email, verificationUrl)

    return NextResponse.json({
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        laboratoryId: result.laboratory.id,
        laboratoryName: result.laboratory.name
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 