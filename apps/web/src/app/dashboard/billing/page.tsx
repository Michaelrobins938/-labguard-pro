'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react'

interface Subscription {
  id: string
  status: string
  plan: {
    id: string
    name: string
    price: number
    currency: string
    interval: string
  }
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  quantity: number
}

interface Usage {
  equipment: {
    used: number
    limit: number
    percentage: number
  }
  aiChecks: {
    used: number
    limit: number
    percentage: number
  }
  teamMembers: {
    used: number
    limit: number
    percentage: number
  }
  storage: {
    used: number
    limit: number
    percentage: number
  }
}

interface Invoice {
  id: string
  number: string
  status: string
  amount: number
  currency: string
  dueDate: string
  paidAt?: string
}

export default function BillingDashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch subscription data
        const subscriptionResponse = await fetch('/api/billing/subscription', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          setSubscription(subscriptionData.data)
        }

        // Fetch usage data
        const usageResponse = await fetch('/api/billing/usage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (usageResponse.ok) {
          const usageData = await usageResponse.json()
          setUsage(usageData.data)
        }

        // Fetch recent invoices
        const invoicesResponse = await fetch('/api/billing/invoices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json()
          setInvoices(invoicesData.data)
        }
      } catch (err) {
        console.error('Error fetching billing data:', err)
        setError('Failed to load billing information')
        
        // Fallback to mock data for development
        setSubscription({
          id: 'sub_123',
          status: 'ACTIVE',
          plan: {
            id: 'plan_pro',
            name: 'Professional Plan',
            price: 599,
            currency: 'USD',
            interval: 'monthly'
          },
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false,
          quantity: 1
        })

        setUsage({
          equipment: {
            used: 24,
            limit: 50,
            percentage: 48
          },
          aiChecks: {
            used: 156,
            limit: 500,
            percentage: 31
          },
          teamMembers: {
            used: 6,
            limit: 10,
            percentage: 60
          },
          storage: {
            used: 2.4,
            limit: 10,
            percentage: 24
          }
        })

        setInvoices([
          {
            id: 'inv_1',
            number: 'INV-2024-001',
            status: 'PAID',
            amount: 599,
            currency: 'USD',
            dueDate: '2024-01-01T00:00:00Z',
            paidAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'inv_2',
            number: 'INV-2023-012',
            status: 'PAID',
            amount: 599,
            currency: 'USD',
            dueDate: '2023-12-01T00:00:00Z',
            paidAt: '2023-12-01T00:00:00Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBillingData()
  }, [])

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

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, usage, and billing</p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {error} - Using demo data for preview
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/billing/subscription"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Subscription
          </Link>
          <Link
            href="/dashboard/billing/payment-methods"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </Link>
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
                <h3 className="text-sm font-medium text-gray-500 mb-2">Plan</h3>
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
                <h3 className="text-sm font-medium text-gray-500 mb-2">Quantity</h3>
                <p className="text-lg font-semibold text-gray-900">{subscription.quantity}</p>
                <p className="text-sm text-gray-600">Active licenses</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Overview */}
      {usage && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Usage This Month</h2>
                <p className="text-sm text-gray-600">Your current usage across all features</p>
              </div>
              <Link
                href="/dashboard/billing/usage"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View detailed usage →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Equipment</h3>
                  <span className={`text-sm font-medium ${getUsageColor(usage.equipment.percentage)}`}>
                    {usage.equipment.used}/{usage.equipment.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageBarColor(usage.equipment.percentage)}`}
                    style={{ width: `${usage.equipment.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{usage.equipment.percentage}% used</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">AI Checks</h3>
                  <span className={`text-sm font-medium ${getUsageColor(usage.aiChecks.percentage)}`}>
                    {usage.aiChecks.used}/{usage.aiChecks.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageBarColor(usage.aiChecks.percentage)}`}
                    style={{ width: `${usage.aiChecks.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{usage.aiChecks.percentage}% used</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
                  <span className={`text-sm font-medium ${getUsageColor(usage.teamMembers.percentage)}`}>
                    {usage.teamMembers.used}/{usage.teamMembers.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageBarColor(usage.teamMembers.percentage)}`}
                    style={{ width: `${usage.teamMembers.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{usage.teamMembers.percentage}% used</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Storage</h3>
                  <span className={`text-sm font-medium ${getUsageColor(usage.storage.percentage)}`}>
                    {usage.storage.used}GB/{usage.storage.limit}GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageBarColor(usage.storage.percentage)}`}
                    style={{ width: `${usage.storage.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{usage.storage.percentage}% used</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/dashboard/billing/subscription"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Manage Subscription</h3>
              <p className="text-sm text-gray-600">Change plans, cancel, or upgrade</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/billing/payment-methods"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Payment Methods</h3>
              <p className="text-sm text-gray-600">Update cards and billing info</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/billing/invoices"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Invoices</h3>
              <p className="text-sm text-gray-600">View and download invoices</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/billing/usage"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Usage Analytics</h3>
              <p className="text-sm text-gray-600">Detailed usage reports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <p className="text-sm text-gray-600">Your latest billing statements</p>
            </div>
            <Link
              href="/dashboard/billing/invoices"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all invoices →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.number}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${invoice.amount} {invoice.currency}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-600">Your invoices will appear here once billing begins.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 