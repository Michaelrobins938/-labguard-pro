import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()

export interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
    role: string
    laboratoryId: string
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided')
    }

    const token = authHeader.substring(7)
    
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'JWT secret not configured')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string
      email: string
      role: string
      laboratoryId: string
    }

    // Verify user still exists and is active
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        isActive: true,
        deletedAt: null
      },
      select: {
        id: true,
        email: true,
        role: true,
        laboratoryId: true
      }
    })

    if (!user) {
      throw new ApiError(401, 'User not found or inactive')
    }

    ;(req as AuthenticatedRequest).user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    next(error)
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: user?.role
      })
    }
    
    next()
  }
} 