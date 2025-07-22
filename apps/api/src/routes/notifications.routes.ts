import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Notification CRUD operations
router.get('/', authMiddleware, notificationController.getNotifications)
router.get('/:id', authMiddleware, notificationController.getNotificationById)
router.post('/', authMiddleware, notificationController.createNotification)
router.put('/:id', authMiddleware, notificationController.updateNotification)
router.delete('/:id', authMiddleware, notificationController.deleteNotification)

// Notification preferences
router.get('/preferences', authMiddleware, notificationController.getUserPreferences)
router.put('/preferences', authMiddleware, notificationController.updateUserPreferences)

// Notification templates
router.get('/templates', authMiddleware, notificationController.getTemplates)
router.get('/templates/:id', authMiddleware, notificationController.getTemplateById)
router.post('/templates', authMiddleware, notificationController.createTemplate)
router.put('/templates/:id', authMiddleware, notificationController.updateTemplate)
router.delete('/templates/:id', authMiddleware, notificationController.deleteTemplate)

// Notification history and analytics
router.get('/history', authMiddleware, notificationController.getNotificationHistory)
router.get('/analytics', authMiddleware, notificationController.getNotificationAnalytics)

// Notification actions
router.post('/:id/read', authMiddleware, notificationController.markAsRead)
router.post('/:id/unread', authMiddleware, notificationController.markAsUnread)
router.post('/bulk/read', authMiddleware, notificationController.markMultipleAsRead)
router.post('/bulk/delete', authMiddleware, notificationController.deleteMultipleNotifications)

// Notification delivery
router.post('/:id/retry', authMiddleware, notificationController.retryDelivery)
router.post('/:id/acknowledge', authMiddleware, notificationController.acknowledgeNotification)

// Webhook for delivery status updates
router.post('/webhook/delivery-status', notificationController.handleDeliveryStatusWebhook)

// Notification settings
router.get('/settings', authMiddleware, notificationController.getNotificationSettings)
router.put('/settings', authMiddleware, notificationController.updateNotificationSettings)

export default router 