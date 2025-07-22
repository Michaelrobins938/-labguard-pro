import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export const billingController = {
  // Subscription Management
  async getSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const subscription = await prisma.subscription.findFirst({
        where: { laboratoryId },
        include: {
          plan: true,
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          usageRecords: {
            orderBy: { timestamp: 'desc' },
            take: 10
          }
        }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'No subscription found' })
      }

      res.json(subscription)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subscription' })
    }
  },

  async createSubscription(req: Request, res: Response) {
    try {
      const { laboratoryId, planId, paymentMethodId } = req.body

      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      })

      if (!laboratory) {
        return res.status(404).json({ error: 'Laboratory not found' })
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
      })

      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' })
      }

      // Create or get Stripe customer
      let stripeCustomer
      const existingCustomer = await stripe.customers.list({
        email: laboratory.email,
        limit: 1
      })

      if (existingCustomer.data.length > 0) {
        stripeCustomer = existingCustomer.data[0]
      } else {
        stripeCustomer = await stripe.customers.create({
          email: laboratory.email,
          name: laboratory.name,
          metadata: { laboratoryId }
        })
      }

      // Create Stripe subscription
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: plan.stripeId! }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      })

      // Create subscription in database
      const subscription = await prisma.subscription.create({
        data: {
          stripeId: stripeSubscription.id,
          planId,
          laboratoryId,
          status: stripeSubscription.status.toUpperCase() as any,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
          trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null
        },
        include: { plan: true }
      })

      res.json(subscription)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subscription' })
    }
  },

  async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { planId, cancelAtPeriodEnd } = req.body

      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: { plan: true }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' })
      }

      if (planId && planId !== subscription.planId) {
        // Update plan in Stripe
        await stripe.subscriptions.update(subscription.stripeId!, {
          items: [{ id: subscription.stripeId!, price: planId }],
          proration_behavior: 'create_prorations'
        })
      }

      const updatedSubscription = await prisma.subscription.update({
        where: { id },
        data: {
          planId: planId || subscription.planId,
          cancelAtPeriodEnd: cancelAtPeriodEnd ?? subscription.cancelAtPeriodEnd
        },
        include: { plan: true }
      })

      res.json(updatedSubscription)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update subscription' })
    }
  },

  async cancelSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { cancelAtPeriodEnd = true } = req.body

      const subscription = await prisma.subscription.findUnique({
        where: { id }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' })
      }

      if (subscription.stripeId) {
        await stripe.subscriptions.update(subscription.stripeId, {
          cancel_at_period_end: cancelAtPeriodEnd
        })
      }

      const updatedSubscription = await prisma.subscription.update({
        where: { id },
        data: {
          cancelAtPeriodEnd,
          canceledAt: cancelAtPeriodEnd ? new Date() : null
        }
      })

      res.json(updatedSubscription)
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel subscription' })
    }
  },

  // Plan Management
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      })

      res.json(plans)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plans' })
    }
  },

  async getPlan(req: Request, res: Response) {
    try {
      const { id } = req.params
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id }
      })

      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' })
      }

      res.json(plan)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plan' })
    }
  },

  // Invoice Management
  async getInvoices(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const { page = 1, limit = 10, status } = req.query

      const where: any = { laboratoryId }
      if (status) where.status = status

      const invoices = await prisma.invoice.findMany({
        where,
        include: {
          subscription: { include: { plan: true } },
          paymentMethod: true,
          invoiceItems: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      })

      const total = await prisma.invoice.count({ where })

      res.json({
        invoices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' })
    }
  },

  async getInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          subscription: { include: { plan: true } },
          paymentMethod: true,
          invoiceItems: true
        }
      })

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      res.json(invoice)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoice' })
    }
  },

  async downloadInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          laboratory: true,
          subscription: { include: { plan: true } },
          invoiceItems: true
        }
      })

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      // Generate PDF invoice (implementation would use a PDF library)
      const pdfBuffer = await generateInvoicePDF(invoice)
      
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.number}.pdf"`)
      res.send(pdfBuffer)
    } catch (error) {
      res.status(500).json({ error: 'Failed to download invoice' })
    }
  },

  // Payment Method Management
  async getPaymentMethods(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: { laboratoryId },
        orderBy: { isDefault: 'desc' }
      })

      res.json(paymentMethods)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payment methods' })
    }
  },

  async addPaymentMethod(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const { paymentMethodId, isDefault = false } = req.body

      // Attach payment method to Stripe customer
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId },
        include: { subscriptions: true }
      })

      if (!laboratory) {
        return res.status(404).json({ error: 'Laboratory not found' })
      }

      const stripeCustomer = await stripe.customers.list({
        email: laboratory.email,
        limit: 1
      })

      if (stripeCustomer.data.length > 0) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomer.data[0].id
        })
      }

      // Create payment method in database
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          stripeId: paymentMethodId,
          laboratoryId,
          isDefault,
          type: 'CARD' // This would be determined from Stripe
        }
      })

      res.json(paymentMethod)
    } catch (error) {
      res.status(500).json({ error: 'Failed to add payment method' })
    }
  },

  async removePaymentMethod(req: Request, res: Response) {
    try {
      const { id } = req.params
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id }
      })

      if (!paymentMethod) {
        return res.status(404).json({ error: 'Payment method not found' })
      }

      if (paymentMethod.stripeId) {
        await stripe.paymentMethods.detach(paymentMethod.stripeId)
      }

      await prisma.paymentMethod.delete({
        where: { id }
      })

      res.json({ message: 'Payment method removed' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove payment method' })
    }
  },

  // Usage Management
  async getUsage(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const { startDate, endDate } = req.query

      const subscription = await prisma.subscription.findFirst({
        where: { laboratoryId }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'No subscription found' })
      }

      const where: any = { subscriptionId: subscription.id }
      if (startDate && endDate) {
        where.timestamp = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      }

      const usageRecords = await prisma.usageRecord.findMany({
        where,
        orderBy: { timestamp: 'desc' }
      })

      // Calculate usage metrics
      const totalUsage = usageRecords.reduce((sum, record) => sum + record.quantity, 0)
      const usageByFeature = usageRecords.reduce((acc, record) => {
        const feature = record.metadata.feature || 'unknown'
        acc[feature] = (acc[feature] || 0) + record.quantity
        return acc
      }, {} as Record<string, number>)

      res.json({
        subscription,
        usageRecords,
        metrics: {
          totalUsage,
          usageByFeature,
          period: { startDate, endDate }
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch usage' })
    }
  },

  async recordUsage(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const { feature, quantity = 1, metadata = {} } = req.body

      const subscription = await prisma.subscription.findFirst({
        where: { laboratoryId }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'No subscription found' })
      }

      // Record usage in database
      const usageRecord = await prisma.usageRecord.create({
        data: {
          subscriptionId: subscription.id,
          quantity,
          timestamp: new Date(),
          metadata: { feature, ...metadata }
        }
      })

      // Record usage in Stripe if subscription has Stripe ID
      if (subscription.stripeId) {
        await stripe.subscriptionItems.createUsageRecord(
          subscription.stripeId,
          {
            quantity,
            timestamp: Math.floor(Date.now() / 1000),
            action: 'increment'
          }
        )
      }

      res.json(usageRecord)
    } catch (error) {
      res.status(500).json({ error: 'Failed to record usage' })
    }
  },

  // Billing Settings
  async getBillingSettings(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const settings = await prisma.billingSettings.findUnique({
        where: { laboratoryId }
      })

      res.json(settings)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch billing settings' })
    }
  },

  async updateBillingSettings(req: Request, res: Response) {
    try {
      const { laboratoryId } = req.params
      const updateData = req.body

      const settings = await prisma.billingSettings.upsert({
        where: { laboratoryId },
        update: updateData,
        create: {
          laboratoryId,
          ...updateData
        }
      })

      res.json(settings)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update billing settings' })
    }
  },

  // Webhook Handling
  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      } catch (err) {
        return res.status(400).json({ error: 'Webhook signature verification failed' })
      }

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await handleSubscriptionEvent(event)
          break

        case 'invoice.payment_succeeded':
        case 'invoice.payment_failed':
          await handleInvoiceEvent(event)
          break

        case 'payment_method.attached':
        case 'payment_method.detached':
          await handlePaymentMethodEvent(event)
          break
      }

      res.json({ received: true })
    } catch (error) {
      res.status(500).json({ error: 'Webhook handling failed' })
    }
  }
}

// Helper functions
async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  
  await prisma.subscription.updateMany({
    where: { stripeId: subscription.id },
    data: {
      status: subscription.status.toUpperCase() as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null
    }
  })
}

async function handleInvoiceEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  
  await prisma.invoice.upsert({
    where: { stripeId: invoice.id },
    update: {
      status: invoice.status.toUpperCase() as any,
      amount: invoice.amount_paid,
      paidAt: invoice.status === 'paid' ? new Date() : null
    },
    create: {
      stripeId: invoice.id,
      number: invoice.number!,
      status: invoice.status.toUpperCase() as any,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      totalAmount: invoice.total,
      subtotal: invoice.subtotal,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      laboratoryId: invoice.customer as string // This would need proper mapping
    }
  })
}

async function handlePaymentMethodEvent(event: Stripe.Event) {
  const paymentMethod = event.data.object as Stripe.PaymentMethod
  
  if (event.type === 'payment_method.attached') {
    await prisma.paymentMethod.create({
      data: {
        stripeId: paymentMethod.id,
        type: paymentMethod.type.toUpperCase() as any,
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        fingerprint: paymentMethod.card?.fingerprint,
        country: paymentMethod.card?.country,
        laboratoryId: paymentMethod.customer as string // This would need proper mapping
      }
    })
  } else if (event.type === 'payment_method.detached') {
    await prisma.paymentMethod.deleteMany({
      where: { stripeId: paymentMethod.id }
    })
  }
}

async function generateInvoicePDF(invoice: any): Promise<Buffer> {
  // This would use a PDF library like PDFKit or Puppeteer
  // For now, return a mock PDF buffer
  return Buffer.from('Mock PDF content')
} 