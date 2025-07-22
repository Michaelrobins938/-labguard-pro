import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()

export const notificationController = {
  // Get user notifications with filtering and pagination
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, type, priority, isRead, search } = req.query

      const where: any = { userId }
      
      if (type) where.type = type
      if (priority) where.priority = priority
      if (isRead !== undefined) where.isRead = isRead === 'true'
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { message: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })

      const total = await prisma.notification.count({ where })

      res.json({
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching notifications:', error)
      res.status(500).json({ error: 'Failed to fetch notifications' })
    }
  },

  // Get single notification by ID
  async getNotificationById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId },
        include: {
          user: {
            select: { name: true, email: true }
          },
          history: {
            orderBy: { performedAt: 'desc' }
          }
        }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      res.json(notification)
    } catch (error) {
      logger.error('Error fetching notification:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch notification' })
    }
  },

  // Create new notification
  async createNotification(req: Request, res: Response) {
    try {
      const { type, title, message, priority, scheduledFor, deliveryChannels, templateId, metadata } = req.body
      const userId = req.user?.id

      const notification = await prisma.notification.create({
        data: {
          type,
          title,
          message,
          priority: priority || 'NORMAL',
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
          deliveryChannels: deliveryChannels || ['in_app'],
          templateId,
          metadata: metadata || {},
          userId
        }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          action: 'SENT',
          performedBy: userId
        }
      })

      res.status(201).json(notification)
    } catch (error) {
      logger.error('Error creating notification:', error)
      res.status(500).json({ error: 'Failed to create notification' })
    }
  },

  // Update notification
  async updateNotification(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const updateData = req.body

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: updateData
      })

      res.json(updatedNotification)
    } catch (error) {
      logger.error('Error updating notification:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update notification' })
    }
  },

  // Delete notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      await prisma.notification.delete({
        where: { id }
      })

      res.json({ message: 'Notification deleted successfully' })
    } catch (error) {
      logger.error('Error deleting notification:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete notification' })
    }
  },

  // Get user notification preferences
  async getUserPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      let preferences = await prisma.notificationPreference.findUnique({
        where: { userId }
      })

      if (!preferences) {
        // Create default preferences
        preferences = await prisma.notificationPreference.create({
          data: {
            userId,
            emailEnabled: true,
            smsEnabled: false,
            inAppEnabled: true,
            browserEnabled: true,
            frequency: 'IMMEDIATE',
            emergencyOverride: true
          }
        })
      }

      res.json(preferences)
    } catch (error) {
      logger.error('Error fetching notification preferences:', error)
      res.status(500).json({ error: 'Failed to fetch notification preferences' })
    }
  },

  // Update user notification preferences
  async updateUserPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const updateData = req.body

      const preferences = await prisma.notificationPreference.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          ...updateData
        }
      })

      res.json(preferences)
    } catch (error) {
      logger.error('Error updating notification preferences:', error)
      res.status(500).json({ error: 'Failed to update notification preferences' })
    }
  },

  // Get notification templates
  async getTemplates(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { type, isActive } = req.query

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const where: any = { laboratoryId: user?.laboratoryId }
      
      if (type) where.type = type
      if (isActive !== undefined) where.isActive = isActive === 'true'

      const templates = await prisma.notificationTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      res.json(templates)
    } catch (error) {
      logger.error('Error fetching notification templates:', error)
      res.status(500).json({ error: 'Failed to fetch notification templates' })
    }
  },

  // Get single template by ID
  async getTemplateById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const template = await prisma.notificationTemplate.findFirst({
        where: { 
          id, 
          laboratoryId: user?.laboratoryId 
        }
      })

      if (!template) {
        throw new ApiError('Template not found', 404)
      }

      res.json(template)
    } catch (error) {
      logger.error('Error fetching template:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch template' })
    }
  },

  // Create notification template
  async createTemplate(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { name, type, subject, body, htmlBody, smsBody, variables } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const template = await prisma.notificationTemplate.create({
        data: {
          name,
          type,
          subject,
          body,
          htmlBody,
          smsBody,
          variables: variables || {},
          createdBy: userId,
          laboratoryId: user?.laboratoryId!
        }
      })

      res.status(201).json(template)
    } catch (error) {
      logger.error('Error creating template:', error)
      res.status(500).json({ error: 'Failed to create template' })
    }
  },

  // Update notification template
  async updateTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const updateData = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const template = await prisma.notificationTemplate.findFirst({
        where: { 
          id, 
          laboratoryId: user?.laboratoryId 
        }
      })

      if (!template) {
        throw new ApiError('Template not found', 404)
      }

      const updatedTemplate = await prisma.notificationTemplate.update({
        where: { id },
        data: {
          ...updateData,
          version: template.version + 1
        }
      })

      res.json(updatedTemplate)
    } catch (error) {
      logger.error('Error updating template:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update template' })
    }
  },

  // Delete notification template
  async deleteTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const template = await prisma.notificationTemplate.findFirst({
        where: { 
          id, 
          laboratoryId: user?.laboratoryId 
        }
      })

      if (!template) {
        throw new ApiError('Template not found', 404)
      }

      await prisma.notificationTemplate.delete({
        where: { id }
      })

      res.json({ message: 'Template deleted successfully' })
    } catch (error) {
      logger.error('Error deleting template:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete template' })
    }
  },

  // Get notification history
  async getNotificationHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, action, startDate, endDate } = req.query

      const where: any = {
        notification: { userId }
      }
      
      if (action) where.action = action
      if (startDate || endDate) {
        where.performedAt = {}
        if (startDate) where.performedAt.gte = new Date(startDate as string)
        if (endDate) where.performedAt.lte = new Date(endDate as string)
      }

      const history = await prisma.notificationHistory.findMany({
        where,
        include: {
          notification: {
            select: { title: true, type: true, priority: true }
          }
        },
        orderBy: { performedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.notificationHistory.count({ where })

      res.json({
        history,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Error fetching notification history:', error)
      res.status(500).json({ error: 'Failed to fetch notification history' })
    }
  },

  // Get notification analytics
  async getNotificationAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { startDate, endDate } = req.query

      const where: any = { userId }
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate as string)
        if (endDate) where.createdAt.lte = new Date(endDate as string)
      }

      const [
        totalNotifications,
        readNotifications,
        unreadNotifications,
        deliveryStats,
        typeStats
      ] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { ...where, isRead: true } }),
        prisma.notification.count({ where: { ...where, isRead: false } }),
        prisma.notification.groupBy({
          by: ['deliveryStatus'],
          where,
          _count: { id: true }
        }),
        prisma.notification.groupBy({
          by: ['type'],
          where,
          _count: { id: true }
        })
      ])

      res.json({
        totalNotifications,
        readNotifications,
        unreadNotifications,
        deliveryStats,
        typeStats,
        readRate: totalNotifications > 0 ? (readNotifications / totalNotifications) * 100 : 0
      })
    } catch (error) {
      logger.error('Error fetching notification analytics:', error)
      res.status(500).json({ error: 'Failed to fetch notification analytics' })
    }
  },

  // Mark notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: id,
          action: 'MARKED_READ',
          performedBy: userId
        }
      })

      res.json(updatedNotification)
    } catch (error) {
      logger.error('Error marking notification as read:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to mark notification as read' })
    }
  },

  // Mark notification as unread
  async markAsUnread(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: { isRead: false }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: id,
          action: 'MARKED_UNREAD',
          performedBy: userId
        }
      })

      res.json(updatedNotification)
    } catch (error) {
      logger.error('Error marking notification as unread:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to mark notification as unread' })
    }
  },

  // Mark multiple notifications as read
  async markMultipleAsRead(req: Request, res: Response) {
    try {
      const { ids } = req.body
      const userId = req.user?.id

      if (!Array.isArray(ids)) {
        throw new ApiError('Invalid notification IDs', 400)
      }

      const result = await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId
        },
        data: { isRead: true }
      })

      // Create history records
      const historyRecords = ids.map(id => ({
        notificationId: id,
        action: 'MARKED_READ' as const,
        performedBy: userId
      }))

      await prisma.notificationHistory.createMany({
        data: historyRecords
      })

      res.json({ 
        message: `${result.count} notifications marked as read`,
        count: result.count
      })
    } catch (error) {
      logger.error('Error marking multiple notifications as read:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to mark notifications as read' })
    }
  },

  // Delete multiple notifications
  async deleteMultipleNotifications(req: Request, res: Response) {
    try {
      const { ids } = req.body
      const userId = req.user?.id

      if (!Array.isArray(ids)) {
        throw new ApiError('Invalid notification IDs', 400)
      }

      const result = await prisma.notification.deleteMany({
        where: {
          id: { in: ids },
          userId
        }
      })

      res.json({ 
        message: `${result.count} notifications deleted`,
        count: result.count
      })
    } catch (error) {
      logger.error('Error deleting multiple notifications:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete notifications' })
    }
  },

  // Retry notification delivery
  async retryDelivery(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      if (notification.retryCount >= notification.maxRetries) {
        throw new ApiError('Maximum retry attempts reached', 400)
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          retryCount: notification.retryCount + 1,
          deliveryStatus: 'PENDING',
          sentAt: null,
          deliveredAt: null,
          failedAt: null
        }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: id,
          action: 'SENT',
          performedBy: userId,
          metadata: { retryAttempt: notification.retryCount + 1 }
        }
      })

      res.json(updatedNotification)
    } catch (error) {
      logger.error('Error retrying notification delivery:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to retry delivery' })
    }
  },

  // Acknowledge notification
  async acknowledgeNotification(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          acknowledgedAt: new Date(),
          acknowledgedBy: userId
        }
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId: id,
          action: 'DELIVERED',
          performedBy: userId
        }
      })

      res.json(updatedNotification)
    } catch (error) {
      logger.error('Error acknowledging notification:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to acknowledge notification' })
    }
  },

  // Handle delivery status webhook
  async handleDeliveryStatusWebhook(req: Request, res: Response) {
    try {
      const { notificationId, status, metadata } = req.body

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
      })

      if (!notification) {
        throw new ApiError('Notification not found', 404)
      }

      const updateData: any = {}
      
      switch (status) {
        case 'delivered':
          updateData.deliveryStatus = 'DELIVERED'
          updateData.deliveredAt = new Date()
          break
        case 'failed':
          updateData.deliveryStatus = 'FAILED'
          updateData.failedAt = new Date()
          break
        case 'bounced':
          updateData.deliveryStatus = 'BOUNCED'
          break
        case 'unsubscribed':
          updateData.deliveryStatus = 'UNSUBSCRIBED'
          break
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: updateData
      })

      // Create history record
      await prisma.notificationHistory.create({
        data: {
          notificationId,
          action: status.toUpperCase() as any,
          metadata: metadata || {}
        }
      })

      res.json({ message: 'Delivery status updated successfully' })
    } catch (error) {
      logger.error('Error handling delivery status webhook:', error)
      res.status(error.status || 500).json({ error: error.message || 'Failed to update delivery status' })
    }
  },

  // Get notification settings
  async getNotificationSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { laboratory: true }
      })

      const settings = {
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role
        },
        laboratory: {
          id: user?.laboratory?.id,
          name: user?.laboratory?.name
        },
        preferences: await prisma.notificationPreference.findUnique({
          where: { userId }
        })
      }

      res.json(settings)
    } catch (error) {
      logger.error('Error fetching notification settings:', error)
      res.status(500).json({ error: 'Failed to fetch notification settings' })
    }
  },

  // Update notification settings
  async updateNotificationSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { preferences, laboratorySettings } = req.body

      const updates = []

      if (preferences) {
        updates.push(
          prisma.notificationPreference.upsert({
            where: { userId },
            update: preferences,
            create: { userId, ...preferences }
          })
        )
      }

      if (laboratorySettings) {
        updates.push(
          prisma.laboratory.update({
            where: { id: req.user?.laboratoryId },
            data: { settings: laboratorySettings }
          })
        )
      }

      await Promise.all(updates)

      res.json({ message: 'Notification settings updated successfully' })
    } catch (error) {
      logger.error('Error updating notification settings:', error)
      res.status(500).json({ error: 'Failed to update notification settings' })
    }
  }
} 