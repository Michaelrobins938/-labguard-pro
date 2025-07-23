'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Microscope, 
  TrendingUp,
  Calendar,
  FileText,
  Users,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiService, apiUtils } from '@/lib/api'

interface DashboardStats {
  totalEquipment: number
  compliantEquipment: number
  overdueCalibrations: number
  dueSoonCalibrations: number
  completedThisMonth: number
  savingsThisMonth: number
  complianceRate: number
  avgCalibrationTime: number
  totalUsers: number
  activeUsers: number
  totalReports: number
  aiUsageCount: number
}

interface RecentActivity {
  id: string
  type: 'calibration_completed' | 'calibration_due' | 'equipment_added' | 'alert' | 'report_generated' | 'user_joined'
  title: string
  description: string
  timestamp: string
  equipmentName?: string
  status: 'success' | 'warning' | 'error' | 'info'
  userId?: string
  userName?: string
}

interface EquipmentStatus {
  id: string
  name: string
  status: 'active' | 'maintenance' | 'inactive' | 'retired'
  complianceStatus: 'compliant' | 'due_soon' | 'overdue'
  lastCalibration: string
  nextCalibration: string
  location: string
}

interface ComplianceOverview {
  overallRate: number
  byCategory: {
    analytical_balances: number
    centrifuges: number
    spectrophotometers: number
    incubators: number
    autoclaves: number
  }
  trends: {
    date: string
    rate: number
  }[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiService.dashboard.getStats()
      return apiUtils.formatResponse(response) as DashboardStats
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const response = await apiService.dashboard.getRecentActivity(10)
      return apiUtils.formatResponse(response) as RecentActivity[]
    },
    refetchInterval: 60000, // Refetch every minute
  })

  // Fetch compliance overview
  const { data: complianceOverview, isLoading: complianceLoading, refetch: refetchCompliance } = useQuery({
    queryKey: ['dashboard-compliance'],
    queryFn: async () => {
      const response = await apiService.dashboard.getComplianceOverview()
      return apiUtils.formatResponse(response) as ComplianceOverview
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  // Fetch equipment status
  const { data: equipmentStatus, isLoading: equipmentLoading, refetch: refetchEquipment } = useQuery({
    queryKey: ['dashboard-equipment'],
    queryFn: async () => {
      const response = await apiService.dashboard.getEquipmentStatus()
      return apiUtils.formatResponse(response) as EquipmentStatus[]
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  const handleRefresh = async () => {
    setLastRefresh(new Date())
    await Promise.all([
      refetchStats(),
      refetchActivity(),
      refetchCompliance(),
      refetchEquipment()
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'calibration_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'calibration_due':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'equipment_added':
        return <Microscope className="h-4 w-4 text-blue-600" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'report_generated':
        return <FileText className="h-4 w-4 text-purple-600" />
      case 'user_joined':
        return <Users className="h-4 w-4 text-indigo-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getComplianceStatus = (rate: number) => {
    if (rate >= 90) return 'Excellent'
    if (rate >= 75) return 'Good'
    if (rate >= 60) return 'Fair'
    return 'Poor'
  }

  if (statsLoading || activityLoading || complianceLoading || equipmentLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button variant="outline" disabled>
            <RefreshCw className="h-4 w-4 animate-spin" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}. Here's what's happening in your laboratory.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEquipment || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.compliantEquipment || 0} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(stats?.complianceRate || 0)}`}>
              {stats?.complianceRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getComplianceStatus(stats?.complianceRate || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calibrations Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.dueSoonCalibrations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.overdueCalibrations || 0} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.savingsThisMonth?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedThisMonth || 0} calibrations completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Overview */}
      {complianceOverview && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>
                Overall compliance rate: {complianceOverview.overallRate}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {complianceOverview.overallRate}%
                    </span>
                  </div>
                  <Progress value={complianceOverview.overallRate} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(complianceOverview.byCategory).map(([category, rate]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground">{rate}%</span>
                      </div>
                      <Progress value={rate} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/calibrations/new">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Calibration
                </Button>
              </Link>
              
              <Link href="/dashboard/equipment/new">
                <Button className="w-full justify-start" variant="outline">
                  <Microscope className="mr-2 h-4 w-4" />
                  Add Equipment
                </Button>
              </Link>
              
              <Link href="/dashboard/reports/generate">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
              
              <Link href="/dashboard/team/invite">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Team Member
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Equipment Status */}
      {equipmentStatus && equipmentStatus.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>
                Recent equipment updates and status changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipmentStatus.slice(0, 5).map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Microscope className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{equipment.name}</p>
                        <p className="text-sm text-muted-foreground">{equipment.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={equipment.complianceStatus === 'compliant' ? 'default' : 'destructive'}>
                        {equipment.complianceStatus.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {equipment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeUsers || 0} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Validations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.aiUsageCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Calibration Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgCalibrationTime || 0}m</div>
            <p className="text-xs text-muted-foreground">
              Per calibration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  )
} 