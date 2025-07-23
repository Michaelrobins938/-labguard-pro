import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { ApiError } from '../utils/errors'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Validation schemas
const createSubscriptionSchema = z.object({
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  paymentMethodId: z.string(),
  trialDays: z.number().optional()
})

const updateSubscriptionSchema = z.object({
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  cancelAtPeriodEnd: z.boolean().optional()
})

export class BillingController {
  /**
   * Create a new subscription
   */
  async createSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const validatedData = createSubscriptionSchema.parse(req.body)

      // Get laboratory
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        include: { subscriptions: { where: { status: 'ACTIVE' } } }
      })

      if (!laboratory) {
        throw new ApiError(404, 'Laboratory not found')
      }

      // Check if already has active subscription
      if (laboratory.subscriptions.length > 0) {
        throw new ApiError(400, 'Laboratory already has an active subscription')
      }

      // Get plan details
      const planDetails = this.getPlanDetails(validatedData.plan)
      
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: laboratory.email,
        name: laboratory.name,
        metadata: {
          laboratoryId: laboratory.id
        }
      })

      // Create Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: planDetails.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: validatedData.trialDays || 14,
        metadata: {
          laboratoryId: laboratory.id,
          plan: validatedData.plan
        }
      })

      // Create subscription record
      const subscriptionRecord = await prisma.subscription.create({
        data: {
          laboratoryId: laboratory.id,
          plan: validatedData.plan,
          status: 'TRIAL',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: planDetails.stripePriceId,
          complianceChecksLimit: planDetails.complianceChecksLimit,
          equipmentItemsLimit: planDetails.equipmentItemsLimit
        }
      })

      // Update laboratory
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: { subscriptionPlan: validatedData.plan }
      })

      logger.info('Subscription created', {
        laboratoryId,
        subscriptionId: subscriptionRecord.id,
        plan: validatedData.plan
      })

      res.status(201).json({
        message: 'Subscription created successfully',
        subscription: subscriptionRecord,
        stripeSubscription: subscription
      })

    } catch (error) {
      logger.error('Failed to create subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to create subscription')
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { subscriptionId } = req.params
      const validatedData = updateSubscriptionSchema.parse(req.body)

      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          laboratoryId: laboratoryId,
          status: { in: ['ACTIVE', 'TRIAL'] }
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Update Stripe subscription
      if (validatedData.plan && validatedData.plan !== subscription.plan) {
        const planDetails = this.getPlanDetails(validatedData.plan)
        
        await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
          items: [{ price: planDetails.stripePriceId }],
          proration_behavior: 'create_prorations'
        })

        // Update local record
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            plan: validatedData.plan,
            complianceChecksLimit: planDetails.complianceChecksLimit,
            equipmentItemsLimit: planDetails.equipmentItemsLimit
          }
        })
      }

      if (validatedData.cancelAtPeriodEnd !== undefined) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
          cancel_at_period_end: validatedData.cancelAtPeriodEnd
        })

        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd }
        })
      }

      res.json({
        message: 'Subscription updated successfully',
        subscription: await prisma.subscription.findUnique({
          where: { id: subscriptionId }
        })
      })

    } catch (error) {
      logger.error('Failed to update subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to update subscription')
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { subscriptionId } = req.params

      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          laboratoryId: laboratoryId
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Cancel Stripe subscription
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId!)

      // Update local record
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'CANCELED',
          canceledAt: new Date()
        }
      })

      logger.info('Subscription canceled', { subscriptionId, laboratoryId })

      res.json({ message: 'Subscription canceled successfully' })

    } catch (error) {
      logger.error('Failed to cancel subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to cancel subscription')
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { subscriptionId } = req.params

      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          laboratoryId: laboratoryId
        },
        include: {
          laboratory: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (!subscription) {
        throw new ApiError(404, 'Subscription not found')
      }

      // Get Stripe subscription details
      let stripeSubscription = null
      if (subscription.stripeSubscriptionId) {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
      }

      res.json({
        subscription,
        stripeSubscription
      })

    } catch (error) {
      logger.error('Failed to get subscription:', error)
      if (error instanceof ApiError) throw error
      throw new ApiError(500, 'Failed to get subscription')
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.user as any
      const { period = 'month' } = req.query

      const startDate = this.getStartDate(period as string)
      
      const [usageLogs, equipmentCount] = await Promise.all([
        prisma.usageLog.findMany({
          where: {
            user: { laboratoryId: laboratoryId },
            createdAt: { gte: startDate }
          },
          select: {
            action: true,
            tokensUsed: true,
            cost: true,
            createdAt: true
          }
        }),
        prisma.equipment.count({
          where: { laboratoryId: laboratoryId }
        })
      ])

      const stats = {
        totalComplianceChecks: usageLogs.filter(log => log.action === 'compliance_check').length,
        totalTokensUsed: usageLogs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
        totalCost: usageLogs.reduce((sum, log) => sum + (log.cost || 0), 0),
        equipmentCount,
        period
      }

      res.json(stats)

    } catch (error) {
      logger.error('Failed to get usage stats:', error)
      throw new ApiError(500, 'Failed to get usage statistics')
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      } catch (err) {
        logger.error('Webhook signature verification failed:', err)
        return res.status(400).send(`Webhook Error: ${err.message}`)
      }

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
        default:
          logger.info(`Unhandled event type: ${event.type}`)
      }

      res.json({ received: true })

    } catch (error) {
      logger.error('Webhook error:', error)
      res.status(500).json({ error: 'Webhook processing failed' })
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status === 'trialing' ? 'TRIAL' : 'ACTIVE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date()
      }
    })
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Handle successful payment
    logger.info('Payment succeeded', { invoiceId: invoice.id })
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Handle failed payment
    logger.warn('Payment failed', { invoiceId: invoice.id })
  }

  private getPlanDetails(plan: string) {
    const plans = {
      STARTER: {
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!,
        complianceChecksLimit: 100,
        equipmentItemsLimit: 10
      },
      PROFESSIONAL: {
        stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
        complianceChecksLimit: 500,
        equipmentItemsLimit: 50
      },
      ENTERPRISE: {
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
        complianceChecksLimit: -1, // Unlimited
        equipmentItemsLimit: -1 // Unlimited
      }
    }
    return plans[plan as keyof typeof plans]
  }

  private getStartDate(period: string): Date {
    const now = new Date()
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }
}

export const billingController = new BillingController() 