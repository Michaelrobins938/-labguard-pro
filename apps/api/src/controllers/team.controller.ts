import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'
import { notificationService } from '../utils/notification.service'

const prisma = new PrismaClient()

export const teamController = {
  // Get team dashboard
  async getTeamDashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20 } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const [
        teamMembers,
        activeAssignments,
        recentActivities,
        pendingInvitations,
        teamStats
      ] = await Promise.all([
        prisma.user.count({
          where: { 
            laboratoryId: user?.laboratoryId,
            isActive: true,
            deletedAt: null
          }
        }),
        prisma.assignment.count({
          where: {
            laboratoryId: user?.laboratoryId,
            status: { in: ['PENDING', 'IN_PROGRESS'] }
          }
        }),
        prisma.teamActivity.findMany({
          where: { laboratoryId: user?.laboratoryId },
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }),
        prisma.userInvitation.count({
          where: {
            laboratoryId: user?.laboratoryId,
            status: 'PENDING'
          }
        }),
        prisma.assignment.groupBy({
          by: ['status'],
          where: { laboratoryId: user?.laboratoryId },
          _count: { id: true }
        })
      ])

      res.json({
        teamMembers,
        activeAssignments,
        recentActivities,
        pendingInvitations,
        teamStats,
        pagination: {
          page: Number(page),
          limit: Number(limit)
        }
      })
    } catch (error) {
      logger.error('Error fetching team dashboard:', error)
      res.status(500).json({ error: 'Failed to fetch team dashboard' })
    }
  },

  // Get team overview
  async getTeamOverview(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const [
        users,
        assignments,
        activities,
        invitations
      ] = await Promise.all([
        prisma.user.findMany({
          where: { 
            laboratoryId: user?.laboratoryId,
            deletedAt: null
          },
          include: {
            userProfile: true,
            assignments: {
              where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.assignment.findMany({
          where: { laboratoryId: user?.laboratoryId },
          include: {
            assignedTo: { select: { name: true, email: true } },
            assignedBy: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }),
        prisma.teamActivity.findMany({
          where: { laboratoryId: user?.laboratoryId },
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20
        }),
        prisma.userInvitation.findMany({
          where: { 
            laboratoryId: user?.laboratoryId,
            status: 'PENDING'
          },
          include: { invitedBy: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' }
        })
      ])

      res.json({
        users,
        assignments,
        activities,
        invitations
      })
    } catch (error) {
      logger.error('Error fetching team overview:', error)
      res.status(500).json({ error: 'Failed to fetch team overview' })
    }
  },

  // Get team users
  async getTeamUsers(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, role, status, search } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { 
        laboratoryId: user?.laboratoryId,
        deletedAt: null
      }
      
      if (role) where.role = role
      if (status) where.isActive = status === 'active'
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const users = await prisma.user.findMany({
        where,
        include: {
          userProfile: true,
          assignments: {
            where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
          },
          teamActivities: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { name: 'asc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.user.count({ where })

      res.json({
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching team users:', error)
      res.status(500).json({ error: 'Failed to fetch team users' })
    }
  },

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const teamUser = await prisma.user.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId,
          deletedAt: null
        },
        include: {
          userProfile: true,
          assignments: {
            include: {
              assignedBy: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
          },
          teamActivities: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          calibrationRecords: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!teamUser) {
        throw new ApiError('User not found', 404)
      }

      res.json(teamUser)
    } catch (error) {
      logger.error('Error fetching user:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch user' })
    }
  },

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const teamUser = await prisma.user.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId,
          deletedAt: null
        }
      })

      if (!teamUser) {
        throw new ApiError('User not found', 404)
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      })

      res.json(updatedUser)
    } catch (error) {
      logger.error('Error updating user:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update user' })
    }
  },

  // Deactivate user
  async deactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const teamUser = await prisma.user.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId,
          deletedAt: null
        }
      })

      if (!teamUser) {
        throw new ApiError('User not found', 404)
      }

      await prisma.user.update({
        where: { id },
        data: { isActive: false }
      })

      res.json({ message: 'User deactivated successfully' })
    } catch (error) {
      logger.error('Error deactivating user:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to deactivate user' })
    }
  },

  // Reactivate user
  async reactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const teamUser = await prisma.user.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!teamUser) {
        throw new ApiError('User not found', 404)
      }

      await prisma.user.update({
        where: { id },
        data: { isActive: true }
      })

      res.json({ message: 'User reactivated successfully' })
    } catch (error) {
      logger.error('Error reactivating user:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to reactivate user' })
    }
  },

  // Get invitations
  async getInvitations(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, status } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { laboratoryId: user?.laboratoryId }
      if (status) where.status = status

      const invitations = await prisma.userInvitation.findMany({
        where,
        include: {
          invitedBy: { select: { name: true, email: true } },
          invitedUser: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.userInvitation.count({ where })

      res.json({
        invitations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching invitations:', error)
      res.status(500).json({ error: 'Failed to fetch invitations' })
    }
  },

  // Create invitation
  async createInvitation(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { email, role, message } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        throw new ApiError('User with this email already exists', 400)
      }

      // Check if invitation already exists
      const existingInvitation = await prisma.userInvitation.findFirst({
        where: {
          email,
          laboratoryId: user?.laboratoryId,
          status: 'PENDING'
        }
      })

      if (existingInvitation) {
        throw new ApiError('Invitation already sent to this email', 400)
      }

      const invitation = await prisma.userInvitation.create({
        data: {
          email,
          role,
          message,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          laboratoryId: user?.laboratoryId!,
          invitedById: userId
        }
      })

      // Send invitation email
      await notificationService.createNotificationFromTemplate(
        'invitation-template-id', // You'll need to create this template
        userId,
        {
          invitationId: invitation.id,
          email,
          role,
          message,
          laboratoryName: user?.laboratory?.name
        }
      )

      res.status(201).json(invitation)
    } catch (error) {
      logger.error('Error creating invitation:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to create invitation' })
    }
  },

  // Update invitation
  async updateInvitation(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const invitation = await prisma.userInvitation.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!invitation) {
        throw new ApiError('Invitation not found', 404)
      }

      const updatedInvitation = await prisma.userInvitation.update({
        where: { id },
        data: updateData
      })

      res.json(updatedInvitation)
    } catch (error) {
      logger.error('Error updating invitation:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update invitation' })
    }
  },

  // Cancel invitation
  async cancelInvitation(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const invitation = await prisma.userInvitation.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!invitation) {
        throw new ApiError('Invitation not found', 404)
      }

      await prisma.userInvitation.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })

      res.json({ message: 'Invitation cancelled successfully' })
    } catch (error) {
      logger.error('Error cancelling invitation:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to cancel invitation' })
    }
  },

  // Resend invitation
  async resendInvitation(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const invitation = await prisma.userInvitation.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!invitation) {
        throw new ApiError('Invitation not found', 404)
      }

      // Update expiration date
      await prisma.userInvitation.update({
        where: { id },
        data: { 
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })

      // Resend invitation email
      await notificationService.createNotificationFromTemplate(
        'invitation-template-id',
        userId,
        {
          invitationId: invitation.id,
          email: invitation.email,
          role: invitation.role,
          message: invitation.message,
          laboratoryName: user?.laboratory?.name
        }
      )

      res.json({ message: 'Invitation resent successfully' })
    } catch (error) {
      logger.error('Error resending invitation:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to resend invitation' })
    }
  },

  // Get team activities
  async getTeamActivities(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, type, userId: activityUserId } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { laboratoryId: user?.laboratoryId }
      if (type) where.type = type
      if (activityUserId) where.userId = activityUserId

      const activities = await prisma.teamActivity.findMany({
        where,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.teamActivity.count({ where })

      res.json({
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching team activities:', error)
      res.status(500).json({ error: 'Failed to fetch team activities' })
    }
  },

  // Get activity by ID
  async getActivityById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const activity = await prisma.teamActivity.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        },
        include: { user: { select: { name: true, email: true } } }
      })

      if (!activity) {
        throw new ApiError('Activity not found', 404)
      }

      res.json(activity)
    } catch (error) {
      logger.error('Error fetching activity:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch activity' })
    }
  },

  // Create activity
  async createActivity(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { type, title, description, metadata } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const activity = await prisma.teamActivity.create({
        data: {
          type,
          title,
          description,
          metadata: metadata || {},
          userId,
          laboratoryId: user?.laboratoryId!
        }
      })

      res.status(201).json(activity)
    } catch (error) {
      logger.error('Error creating activity:', error)
      res.status(500).json({ error: 'Failed to create activity' })
    }
  },

  // Get assignments
  async getAssignments(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, status, type, assignedTo } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { laboratoryId: user?.laboratoryId }
      if (status) where.status = status
      if (type) where.type = type
      if (assignedTo) where.assignedToId = assignedTo

      const assignments = await prisma.assignment.findMany({
        where,
        include: {
          assignedTo: { select: { name: true, email: true } },
          assignedBy: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.assignment.count({ where })

      res.json({
        assignments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching assignments:', error)
      res.status(500).json({ error: 'Failed to fetch assignments' })
    }
  },

  // Get assignment by ID
  async getAssignmentById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        },
        include: {
          assignedTo: { select: { name: true, email: true } },
          assignedBy: { select: { name: true, email: true } }
        }
      })

      if (!assignment) {
        throw new ApiError('Assignment not found', 404)
      }

      res.json(assignment)
    } catch (error) {
      logger.error('Error fetching assignment:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch assignment' })
    }
  },

  // Create assignment
  async createAssignment(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { title, description, type, priority, dueDate, estimatedHours, assignedToId } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.create({
        data: {
          title,
          description,
          type,
          priority: priority || 'NORMAL',
          dueDate: dueDate ? new Date(dueDate) : null,
          estimatedHours,
          assignedToId,
          assignedById: userId,
          laboratoryId: user?.laboratoryId!
        }
      })

      // Create team activity
      await prisma.teamActivity.create({
        data: {
          type: 'ASSIGNMENT_CREATED',
          title: `New assignment: ${title}`,
          description: `Assignment "${title}" was created and assigned`,
          userId: assignedToId,
          laboratoryId: user?.laboratoryId!
        }
      })

      // Send notification to assigned user
      await notificationService.createNotificationFromTemplate(
        'assignment-template-id',
        assignedToId,
        {
          assignmentTitle: title,
          assignmentType: type,
          dueDate: dueDate,
          assignedBy: user?.name
        }
      )

      res.status(201).json(assignment)
    } catch (error) {
      logger.error('Error creating assignment:', error)
      res.status(500).json({ error: 'Failed to create assignment' })
    }
  },

  // Update assignment
  async updateAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!assignment) {
        throw new ApiError('Assignment not found', 404)
      }

      const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data: updateData
      })

      res.json(updatedAssignment)
    } catch (error) {
      logger.error('Error updating assignment:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update assignment' })
    }
  },

  // Delete assignment
  async deleteAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!assignment) {
        throw new ApiError('Assignment not found', 404)
      }

      await prisma.assignment.delete({
        where: { id }
      })

      res.json({ message: 'Assignment deleted successfully' })
    } catch (error) {
      logger.error('Error deleting assignment:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete assignment' })
    }
  },

  // Complete assignment
  async completeAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const { actualHours, notes } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!assignment) {
        throw new ApiError('Assignment not found', 404)
      }

      const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          actualHours,
          notes
        }
      })

      // Create team activity
      await prisma.teamActivity.create({
        data: {
          type: 'ASSIGNMENT_COMPLETED',
          title: `Assignment completed: ${assignment.title}`,
          description: `Assignment "${assignment.title}" was completed`,
          userId: assignment.assignedToId,
          laboratoryId: user?.laboratoryId!
        }
      })

      res.json(updatedAssignment)
    } catch (error) {
      logger.error('Error completing assignment:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to complete assignment' })
    }
  },

  // Start assignment
  async startAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const assignment = await prisma.assignment.findFirst({
        where: { 
          id,
          laboratoryId: user?.laboratoryId
        }
      })

      if (!assignment) {
        throw new ApiError('Assignment not found', 404)
      }

      const updatedAssignment = await prisma.assignment.update({
        where: { id },
        data: { status: 'IN_PROGRESS' }
      })

      res.json(updatedAssignment)
    } catch (error) {
      logger.error('Error starting assignment:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to start assignment' })
    }
  },

  // Get user profile
  async getUserProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const currentUserId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { laboratory: true }
      })

      const profile = await prisma.userProfile.findFirst({
        where: { 
          userId,
          user: { laboratoryId: user?.laboratoryId }
        },
        include: { user: { select: { name: true, email: true, role: true } } }
      })

      if (!profile) {
        throw new ApiError('User profile not found', 404)
      }

      res.json(profile)
    } catch (error) {
      logger.error('Error fetching user profile:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch user profile' })
    }
  },

  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const currentUserId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { laboratory: true }
      })

      const profile = await prisma.userProfile.findFirst({
        where: { 
          userId,
          user: { laboratoryId: user?.laboratoryId }
        }
      })

      if (!profile) {
        throw new ApiError('User profile not found', 404)
      }

      const updatedProfile = await prisma.userProfile.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          ...updateData
        }
      })

      res.json(updatedProfile)
    } catch (error) {
      logger.error('Error updating user profile:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update user profile' })
    }
  },

  // Get team settings
  async getTeamSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const settings = {
        laboratory: user?.laboratory,
        defaultRoles: {
          ADMIN: ['Full access to all features'],
          SUPERVISOR: ['Manage team members', 'Create assignments', 'View reports'],
          TECHNICIAN: ['Perform calibrations', 'Update equipment', 'View own assignments'],
          VIEWER: ['View equipment and reports', 'No editing permissions']
        },
        invitationSettings: {
          defaultExpirationDays: 7,
          allowBulkInvitations: true,
          requireApproval: false
        }
      }

      res.json(settings)
    } catch (error) {
      logger.error('Error fetching team settings:', error)
      res.status(500).json({ error: 'Failed to fetch team settings' })
    }
  },

  // Update team settings
  async updateTeamSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      // Update laboratory settings
      await prisma.laboratory.update({
        where: { id: user?.laboratoryId },
        data: { settings: updateData }
      })

      res.json({ message: 'Team settings updated successfully' })
    } catch (error) {
      logger.error('Error updating team settings:', error)
      res.status(500).json({ error: 'Failed to update team settings' })
    }
  },

  // Get team analytics
  async getTeamAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { startDate, endDate } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { laboratoryId: user?.laboratoryId }
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate as string)
        if (endDate) where.createdAt.lte = new Date(endDate as string)
      }

      const [
        totalUsers,
        activeUsers,
        completedAssignments,
        pendingAssignments,
        userActivity,
        assignmentStats
      ] = await Promise.all([
        prisma.user.count({ where: { ...where, deletedAt: null } }),
        prisma.user.count({ where: { ...where, isActive: true, deletedAt: null } }),
        prisma.assignment.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.assignment.count({ where: { ...where, status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
        prisma.teamActivity.groupBy({
          by: ['type'],
          where,
          _count: { id: true }
        }),
        prisma.assignment.groupBy({
          by: ['status'],
          where,
          _count: { id: true }
        })
      ])

      res.json({
        totalUsers,
        activeUsers,
        completedAssignments,
        pendingAssignments,
        userActivity,
        assignmentStats,
        completionRate: completedAssignments > 0 ? (completedAssignments / (completedAssignments + pendingAssignments)) * 100 : 0
      })
    } catch (error) {
      logger.error('Error fetching team analytics:', error)
      res.status(500).json({ error: 'Failed to fetch team analytics' })
    }
  },

  // Get user analytics
  async getUserAnalytics(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const currentUserId = req.user?.id
      const { startDate, endDate } = req.query

      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { laboratory: true }
      })

      const where: any = { 
        userId,
        user: { laboratoryId: user?.laboratoryId }
      }
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate as string)
        if (endDate) where.createdAt.lte = new Date(endDate as string)
      }

      const [
        assignments,
        activities,
        calibrations,
        performance
      ] = await Promise.all([
        prisma.assignment.findMany({
          where: { assignedToId: userId, laboratoryId: user?.laboratoryId },
          include: { assignedBy: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.teamActivity.findMany({
          where: { userId, laboratoryId: user?.laboratoryId },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.calibrationRecord.findMany({
          where: { performedById: userId },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.assignment.groupBy({
          by: ['status'],
          where: { assignedToId: userId, laboratoryId: user?.laboratoryId },
          _count: { id: true }
        })
      ])

      res.json({
        assignments,
        activities,
        calibrations,
        performance
      })
    } catch (error) {
      logger.error('Error fetching user analytics:', error)
      res.status(500).json({ error: 'Failed to fetch user analytics' })
    }
  },

  // Bulk update users
  async bulkUpdateUsers(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { userIds, updates } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const result = await prisma.user.updateMany({
        where: {
          id: { in: userIds },
          laboratoryId: user?.laboratoryId
        },
        data: updates
      })

      res.json({ 
        message: `${result.count} users updated successfully`,
        count: result.count
      })
    } catch (error) {
      logger.error('Error bulk updating users:', error)
      res.status(500).json({ error: 'Failed to bulk update users' })
    }
  },

  // Bulk create assignments
  async bulkCreateAssignments(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { assignments } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const createdAssignments = await prisma.assignment.createMany({
        data: assignments.map((assignment: any) => ({
          ...assignment,
          assignedById: userId,
          laboratoryId: user?.laboratoryId!
        }))
      })

      res.json({ 
        message: `${createdAssignments.count} assignments created successfully`,
        count: createdAssignments.count
      })
    } catch (error) {
      logger.error('Error bulk creating assignments:', error)
      res.status(500).json({ error: 'Failed to bulk create assignments' })
    }
  }
} 