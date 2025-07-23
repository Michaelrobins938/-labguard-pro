import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { prisma } from './db'

export class AuthService {
  private static SALT_ROUNDS = 12
  private static TOKEN_EXPIRY_HOURS = 24

  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // Token generation
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static generateExpiryDate(): Date {
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + this.TOKEN_EXPIRY_HOURS)
    return expiry
  }

  // User management
  static async createUser(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    laboratoryId: string
    role?: string
  }) {
    const hashedPassword = await this.hashPassword(userData.password)
    
    return prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role as any || 'TECHNICIAN',
        laboratoryId: userData.laboratoryId,
        emailVerified: false
      }
    })
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        laboratory: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        laboratory: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })
  }

  // Laboratory management
  static async createLaboratory(laboratoryData: {
    name: string
    email: string
    phone?: string
    address?: string
    website?: string
    licenseNumber?: string
  }) {
    return prisma.laboratory.create({
      data: {
        name: laboratoryData.name,
        email: laboratoryData.email.toLowerCase(),
        phone: laboratoryData.phone,
        address: laboratoryData.address,
        website: laboratoryData.website,
        licenseNumber: laboratoryData.licenseNumber,
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          language: 'en'
        }
      }
    })
  }

  // Combined laboratory and user creation
  static async createLaboratoryAndUser(data: {
    userData: {
      email: string
      password: string
      firstName: string
      lastName: string
      role?: string
    }
    laboratoryData: {
      name: string
      email: string
      type?: string
    }
  }) {
    return prisma.$transaction(async (tx) => {
      // Create laboratory
      const laboratory = await tx.laboratory.create({
        data: {
          name: data.laboratoryData.name,
          email: data.laboratoryData.email.toLowerCase(),
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            language: 'en',
            type: data.laboratoryData.type || 'clinical'
          }
        }
      })

      // Create user
      const hashedPassword = await this.hashPassword(data.userData.password)
      const user = await tx.user.create({
        data: {
          email: data.userData.email.toLowerCase(),
          hashedPassword,
          firstName: data.userData.firstName,
          lastName: data.userData.lastName,
          name: `${data.userData.firstName} ${data.userData.lastName}`,
          role: (data.userData.role || 'lab_manager').toUpperCase() as any,
          laboratoryId: laboratory.id,
          emailVerified: false
        }
      })

      return { user, laboratory }
    })
  }

  // Password reset functionality
  static async createPasswordResetToken(userId: string) {
    const token = this.generateToken()
    const expiresAt = this.generateExpiryDate()

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId }
    })

    return prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    })
  }

  static async validatePasswordResetToken(token: string) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken) {
      throw new Error('Invalid reset token')
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
      throw new Error('Reset token has expired')
    }

    if (resetToken.usedAt) {
      throw new Error('Reset token has already been used')
    }

    return resetToken
  }

  static async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.validatePasswordResetToken(token)
    const hashedPassword = await this.hashPassword(newPassword)

    await prisma.$transaction([
      // Update user password
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          hashedPassword,
          passwordChangedAt: new Date()
        }
      }),
      // Mark token as used
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      })
    ])

    return true
  }

  // Email verification functionality
  static async createEmailVerificationToken(userId: string) {
    const token = this.generateToken()
    const expiresAt = this.generateExpiryDate()

    // Delete any existing tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId }
    })

    return prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    })
  }

  static async verifyEmail(token: string) {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verificationToken) {
      throw new Error('Invalid verification token')
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      })
      throw new Error('Verification token has expired')
    }

    if (verificationToken.usedAt) {
      throw new Error('Verification token has already been used')
    }

    await prisma.$transaction([
      // Mark user as verified
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      }),
      // Mark token as used
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() }
      })
    ])

    return true
  }

  // Login tracking
  static async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    })
  }

  static async incrementFailedLoginAttempts(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return

    const newAttempts = user.failedLoginAttempts + 1
    const lockedUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes

    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil
      }
    })
  }

  static async resetFailedLoginAttempts(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    })
  }

  // Email functionality
  static async sendEmail(to: string, subject: string, html: string) {
    // For development, we'll use a mock email service
    // In production, configure with real SMTP settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@labguard.com',
        to,
        subject,
        html
      })
    } catch (error) {
      console.error('Email sending failed:', error)
      // For development, just log the email content
      console.log('Email would be sent:', { to, subject, html })
    }
  }

  static async sendPasswordResetEmail(email: string, resetUrl: string) {
    const subject = 'Reset Your LabGuard Pro Password'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset for your LabGuard Pro account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendEmailVerification(email: string, verificationUrl: string) {
    const subject = 'Verify Your LabGuard Pro Email'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email</h2>
        <p>Welcome to LabGuard Pro! Please verify your email address to complete your registration.</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `

    await this.sendEmail(email, subject, html)
  }
} 