import { Router } from 'express'
import { billingController } from '../controllers/billing.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Subscription Management
router.get('/subscriptions/:laboratoryId', authMiddleware, billingController.getSubscription)
router.post('/subscriptions', authMiddleware, billingController.createSubscription)
router.put('/subscriptions/:id', authMiddleware, billingController.updateSubscription)
router.post('/subscriptions/:id/cancel', authMiddleware, billingController.cancelSubscription)

// Plan Management
router.get('/plans', billingController.getPlans)
router.get('/plans/:id', billingController.getPlan)

// Invoice Management
router.get('/invoices/:laboratoryId', authMiddleware, billingController.getInvoices)
router.get('/invoices/:id', authMiddleware, billingController.getInvoice)
router.get('/invoices/:id/download', authMiddleware, billingController.downloadInvoice)

// Payment Method Management
router.get('/payment-methods/:laboratoryId', authMiddleware, billingController.getPaymentMethods)
router.post('/payment-methods/:laboratoryId', authMiddleware, billingController.addPaymentMethod)
router.delete('/payment-methods/:id', authMiddleware, billingController.removePaymentMethod)

// Usage Management
router.get('/usage/:laboratoryId', authMiddleware, billingController.getUsage)
router.post('/usage/:laboratoryId', authMiddleware, billingController.recordUsage)

// Billing Settings
router.get('/settings/:laboratoryId', authMiddleware, billingController.getBillingSettings)
router.put('/settings/:laboratoryId', authMiddleware, billingController.updateBillingSettings)

// Webhook Handling (no auth required for Stripe webhooks)
router.post('/webhooks', billingController.handleWebhook)

export default router 