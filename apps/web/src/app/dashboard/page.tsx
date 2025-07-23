'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { ComplianceChart } from '@/components/dashboard/ComplianceChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { EquipmentStatus } from '@/components/dashboard/EquipmentStatus'
import { AIInsights } from '@/components/dashboard/AIInsights'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { PageHeader } from '@/components/ui/page-header'
import { MetricsGrid, Metric } from '@/components/ui/metrics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Settings, Zap, TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const metrics = [
    {
      title: 'Compliance Rate',
      value: '98.5%',
      change: { value: 2.1, type: 'positive' as const, period: 'last month' },
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      description: 'Current month compliance',
      variant: 'with-icon' as const
    },
    {
      title: 'Equipment Online',
      value: '142',
      change: { value: 2.8, type: 'positive' as const, period: 'last month' },
      icon: <Activity className="h-5 w-5 text-white" />,
      description: 'Out of 145 total devices',
      variant: 'with-chart' as const
    },
    {
      title: 'Pending Calibrations',
      value: '12',
      change: { value: -3.2, type: 'positive' as const, period: 'yesterday' },
      icon: <Clock className="h-5 w-5 text-white" />,
      description: 'Due within 7 days',
      variant: 'with-icon' as const
    },
    {
      title: 'Critical Alerts',
      value: '3',
      change: { value: -1.5, type: 'positive' as const, period: 'yesterday' },
      icon: <AlertTriangle className="h-5 w-5 text-white" />,
      description: 'High priority issues',
      variant: 'with-icon' as const
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Enhanced Page Header */}
      <PageHeader
        title="Dashboard"
        description="Monitor your laboratory's compliance and equipment status in real-time"
        variant="with-actions"
        actions={
          <>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-teal-500/25">
              <Zap className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
          </>
        }
      />
      
      {/* Enhanced Metrics Grid */}
      <MetricsGrid cols={4}>
        {metrics.map((metric, index) => (
          <Metric
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            description={metric.description}
            variant={metric.variant}
          />
        ))}
      </MetricsGrid>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compliance Chart - Takes up 8 columns */}
        <div className="lg:col-span-8">
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>
                Real-time compliance tracking across all laboratory equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceChart />
            </CardContent>
          </Card>
        </div>
        
        {/* AI Insights - Takes up 4 columns */}
        <div className="lg:col-span-4">
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Intelligent recommendations from Biomni AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIInsights />
            </CardContent>
          </Card>
        </div>
        
        {/* Equipment Status - Takes up 8 columns */}
        <div className="lg:col-span-8">
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>
                Current status of all laboratory equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentStatus />
            </CardContent>
          </Card>
        </div>
        
        {/* Activity Feed - Takes up 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your laboratory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 