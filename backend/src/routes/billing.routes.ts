import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Get subscription details
router.get('/subscription', async (req, res) => {
  try {
    const { laboratoryId } = req.query
    
    const subscription = await prisma.subscription.findFirst({
      where: { laboratoryId: laboratoryId as string },
      include: {
        laboratory: true
      }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    res.json(subscription)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' })
  }
})

// Get available plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })

    res.json(plans)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
})

// Create subscription
router.post('/subscriptions', async (req, res) => {
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
})

// Update subscription
router.put('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { planId } = req.body

    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' })
    }

    // Update Stripe subscription
    await stripe.subscriptions.update(subscription.stripeId!, {
      items: [{ id: subscription.stripeId!, price: plan.stripeId! }],
      proration_behavior: 'create_prorations'
    })

    // Update database subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: { planId },
      include: { plan: true }
    })

    res.json(updatedSubscription)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' })
  }
})

// Cancel subscription
router.post('/subscriptions/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.update(subscription.stripeId!, {
      cancel_at_period_end: true
    })

    // Update database subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: { cancelAtPeriodEnd: true },
      include: { plan: true }
    })

    res.json(updatedSubscription)
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

// Get invoices
router.get('/invoices', async (req, res) => {
  try {
    const { laboratoryId } = req.query

    const subscription = await prisma.subscription.findFirst({
      where: { laboratoryId: laboratoryId as string }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId!,
      limit: 20
    })

    res.json(invoices.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

// Get payment methods
router.get('/payment-methods', async (req, res) => {
  try {
    const { laboratoryId } = req.query

    const subscription = await prisma.subscription.findFirst({
      where: { laboratoryId: laboratoryId as string }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripeCustomerId!,
      type: 'card'
    })

    res.json(paymentMethods.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment methods' })
  }
})

// Add payment method
router.post('/payment-methods', async (req, res) => {
  try {
    const { laboratoryId, paymentMethodId } = req.body

    const subscription = await prisma.subscription.findFirst({
      where: { laboratoryId }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: subscription.stripeCustomerId!
    })

    // Set as default payment method
    await stripe.customers.update(subscription.stripeCustomerId!, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add payment method' })
  }
})

// Get usage analytics
router.get('/usage', async (req, res) => {
  try {
    const { laboratoryId } = req.query

    const subscription = await prisma.subscription.findFirst({
      where: { laboratoryId: laboratoryId as string },
      include: { plan: true }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    // Get current usage
    const equipmentCount = await prisma.equipment.count({
      where: { laboratoryId: laboratoryId as string }
    })

    const aiChecksCount = await prisma.calibrationRecord.count({
      where: { 
        laboratoryId: laboratoryId as string,
        createdAt: {
          gte: subscription.currentPeriodStart
        }
      }
    })

    const teamMembersCount = await prisma.user.count({
      where: { laboratoryId: laboratoryId as string }
    })

    const usage = {
      currentPeriod: {
        equipment: equipmentCount,
        aiChecks: aiChecksCount,
        teamMembers: teamMembersCount,
        storage: 0 // TODO: Implement storage tracking
      },
      limits: {
        equipment: subscription.plan.equipmentLimit,
        aiChecks: subscription.plan.aiChecksLimit,
        teamMembers: subscription.plan.teamMembersLimit,
        storage: subscription.plan.storageLimit
      }
    }

    res.json(usage)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage' })
  }
})

// Stripe webhook handler
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret!)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionEvent(event)
        break
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        await handleInvoiceEvent(event)
        break
      case 'payment_method.attached':
        await handlePaymentMethodEvent(event)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  
  await prisma.subscription.updateMany({
    where: { stripeId: subscription.id },
    data: {
      status: subscription.status.toUpperCase() as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  })
}

async function handleInvoiceEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  
  if (invoice.subscription) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeId: invoice.subscription as string }
    })

    if (subscription) {
      await prisma.invoice.create({
        data: {
          stripeId: invoice.id,
          subscriptionId: subscription.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          dueDate: new Date(invoice.due_date! * 1000),
          paidAt: invoice.status === 'paid' ? new Date() : null
        }
      })
    }
  }
}

async function handlePaymentMethodEvent(event: Stripe.Event) {
  const paymentMethod = event.data.object as Stripe.PaymentMethod
  
  // Update customer's default payment method if needed
  if (paymentMethod.customer) {
    await stripe.customers.update(paymentMethod.customer as string, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    })
  }
}

export default router 