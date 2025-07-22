'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Users,
  Zap,
  Shield,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  features: string[]
  limits: {
    equipment: number
    aiChecks: number
    teamMembers: number
    storage: number
  }
  popular?: boolean
}

interface Subscription {
  id: string
  status: string
  plan: Plan
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  quantity: number
}

const AVAILABLE_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 299,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 10 equipment items',
      '100 AI compliance checks',
      'Basic reporting',
      'Email support',
      '2 team members'
    ],
    limits: {
      equipment: 10,
      aiChecks: 100,
      teamMembers: 2,
      storage: 5
    }
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 599,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 50 equipment items',
      '500 AI compliance checks',
      'Advanced analytics',
      'Priority support',
      '10 team members',
      'Custom branding'
    ],
    limits: {
      equipment: 50,
      aiChecks: 500,
      teamMembers: 10,
      storage: 10
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 1299,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited equipment',
      '2,000 AI compliance checks',
      'White-label options',
      'Dedicated support',
      'Unlimited team members',
      'API access',
      'Custom integrations'
    ],
    limits: {
      equipment: -1, // Unlimited
      aiChecks: 2000,
      teamMembers: -1, // Unlimited
      storage: 50
    }
  }
]

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/billing/subscription', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setSubscription(data.data)
        }
      } catch (err) {
        console.error('Error fetching subscription:', err)
        setError('Failed to load subscription information')
        
        // Fallback to mock data for development
        setSubscription({
          id: 'sub_123',
          status: 'ACTIVE',
          plan: AVAILABLE_PLANS[1], // Professional plan
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          quantity: 1
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const handleUpgrade = async (planId: string) => {
    setUpgrading(true)
    try {
      const response = await fetch('/api/billing/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ planId })
      })

      if (response.ok) {
        // Redirect to Stripe checkout or update subscription
        const data = await response.json()
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      } else {
        throw new Error('Failed to upgrade subscription')
      }
    } catch (err) {
      console.error('Error upgrading subscription:', err)
      setError('Failed to upgrade subscription')
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancel = async () => {
    setCanceling(true)
    try {
      const response = await fetch('/api/billing/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        // Update local state
        if (subscription) {
          setSubscription({
            ...subscription,
            cancelAtPeriodEnd: true
          })
        }
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (err) {
      console.error('Error canceling subscription:', err)
      setError('Failed to cancel subscription')
    } finally {
      setCanceling(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PAST_DUE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'CANCELED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-gray-600">Manage your subscription and plan</p>
            {error && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  {error} - Using demo data for preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Subscription</h2>
                <p className="text-sm text-gray-600">Your active subscription details</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subscription.status)}`}>
                {subscription.status === 'ACTIVE' && <CheckCircle className="w-4 h-4 mr-1" />}
                {subscription.status === 'PAST_DUE' && <AlertTriangle className="w-4 h-4 mr-1" />}
                {subscription.status === 'CANCELED' && <Clock className="w-4 h-4 mr-1" />}
                {subscription.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Plan</h3>
                <p className="text-lg font-semibold text-gray-900">{subscription.plan.name}</p>
                <p className="text-sm text-gray-600">
                  ${subscription.plan.price}/{subscription.plan.interval}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Period</h3>
                <p className="text-sm text-gray-900">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {subscription.cancelAtPeriodEnd ? 'Cancels at period end' : 'Auto-renews'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Next Payment</h3>
                <p className="text-sm text-gray-900">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  ${subscription.plan.price} {subscription.plan.currency}
                </p>
              </div>
            </div>

            {/* Current Plan Features */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Current Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <Link
                  href="/dashboard/billing/payment-methods"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Method
                </Link>
                {!subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancel}
                    disabled={canceling}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {canceling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Canceling...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel Subscription
                      </>
                    )}
                  </button>
                )}
                {subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={() => {/* Reactivate subscription */}}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reactivate Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Plans</h2>
          <p className="text-sm text-gray-600">Choose the plan that best fits your needs</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVAILABLE_PLANS.map((plan) => {
              const isCurrentPlan = subscription?.plan.id === plan.id
              const isUpgrade = subscription && plan.price > subscription.plan.price
              const isDowngrade = subscription && plan.price < subscription.plan.price

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border-2 p-6 ${
                    plan.popular
                      ? 'border-blue-500 bg-blue-50'
                      : isCurrentPlan
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.interval}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Equipment Items</span>
                      <span className="font-medium">
                        {plan.limits.equipment === -1 ? 'Unlimited' : plan.limits.equipment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">AI Checks</span>
                      <span className="font-medium">
                        {plan.limits.aiChecks === -1 ? 'Unlimited' : plan.limits.aiChecks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Team Members</span>
                      <span className="font-medium">
                        {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium">{plan.limits.storage}GB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || upgrading}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isUpgrade
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isDowngrade
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {isCurrentPlan ? (
                      'Current Plan'
                    ) : upgrading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                        Processing...
                      </>
                    ) : isUpgrade ? (
                      'Upgrade Plan'
                    ) : isDowngrade ? (
                      'Downgrade Plan'
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Enterprise Plan */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Enterprise Plan</h2>
          <p className="text-sm text-gray-600">Custom solutions for large organizations</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enterprise Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Volume discounts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Custom AI check limits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">On-premise deployment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">SLA guarantees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Custom development</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Sales</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get in touch with our sales team to discuss custom pricing and features for your organization.
              </p>
              <Link
                href="/contact-sales"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 