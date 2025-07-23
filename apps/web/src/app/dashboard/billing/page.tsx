'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  RefreshCw,
  Users,
  Zap,
  Database,
  Activity
} from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: {
    complianceChecks: number
    equipmentItems: number
    aiFeatures: boolean
    advancedReporting: boolean
    customIntegrations: boolean
    prioritySupport: boolean
  }
}

interface UsageMetrics {
  complianceChecks: number
  equipmentItems: number
  aiQueries: number
  storageUsed: number
  apiCalls: number
}

interface Subscription {
  plan: SubscriptionPlan | null
  status: string
  subscriptionId: string | null
  endsAt: Date | null
  trialEndsAt: Date | null
  lastPaymentAt: Date | null
}

interface Invoice {
  id: string
  amount: number
  currency: string
  status: string
  hostedInvoiceUrl: string | null
  createdAt: string
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageMetrics | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      loadBillingData()
    }
  }, [session])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      const laboratoryId = session?.user?.laboratoryId || 'demo-lab'

      // Load subscription data
      const subResponse = await fetch(`/api/billing/subscription/${laboratoryId}`)
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData.data)
      }

      // Load usage data
      const usageResponse = await fetch(`/api/billing/usage/${laboratoryId}`)
      if (usageResponse.ok) {
        const usageData = await usageResponse.json()
        setUsage(usageData.data)
      }

      // Load invoices (mock data for now)
      setInvoices([
        {
          id: 'inv_001',
          amount: 299.00,
          currency: 'usd',
          status: 'paid',
          hostedInvoiceUrl: 'https://invoice.stripe.com/i/acct_123/test',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'inv_002',
          amount: 299.00,
          currency: 'usd',
          status: 'paid',
          hostedInvoiceUrl: 'https://invoice.stripe.com/i/acct_123/test',
          createdAt: '2024-02-15T00:00:00Z'
        }
      ])

    } catch (err) {
      setError('Failed to load billing data')
      console.error('Billing data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'past_due': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'trialing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading billing information...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, view usage, and download invoices
          </p>
        </div>
        <Button onClick={loadBillingData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription?.plan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{subscription.plan.name}</h3>
                  <p className="text-muted-foreground">
                    {formatCurrency(subscription.plan.price)}/{subscription.plan.interval}
                  </p>
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI Features</span>
                </div>
                {subscription.plan.features.advancedReporting && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Advanced Reports</span>
                  </div>
                )}
                {subscription.plan.features.customIntegrations && (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Custom Integrations</span>
                  </div>
                )}
                {subscription.plan.features.prioritySupport && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                )}
              </div>

              {subscription.trialEndsAt && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-4">
                Choose a plan to get started with LabGuard Pro
              </p>
              <Button>View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Usage This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Checks</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.complianceChecks} / {subscription?.plan?.features.complianceChecks === -1 ? '∞' : subscription?.plan?.features.complianceChecks}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.complianceChecks, subscription?.plan?.features.complianceChecks || 100)} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Equipment Items</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.equipmentItems} / {subscription?.plan?.features.equipmentItems === -1 ? '∞' : subscription?.plan?.features.equipmentItems}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.equipmentItems, subscription?.plan?.features.equipmentItems || 50)} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Queries</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.aiQueries} / {subscription?.plan?.features.aiFeatures ? '∞' : '0'}
                  </span>
                </div>
                <Progress 
                  value={subscription?.plan?.features.aiFeatures ? 0 : 100} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.storageUsed} MB
                  </span>
                </div>
                <Progress value={Math.min((usage.storageUsed / 1000) * 100, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
          <CardDescription>
            Download invoices and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">Invoice #{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                  {invoice.hostedInvoiceUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Update Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Upgrade Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Plans
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Billing Support</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 