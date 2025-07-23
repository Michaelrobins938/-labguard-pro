'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FlaskConical, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  FileText,
  Settings,
  Plus,
  Search,
  Bell
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const quickActions = [
    {
      title: 'New Calibration',
      description: 'Schedule equipment calibration',
      icon: Settings,
      href: '/dashboard/calibrations/new',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Add Equipment',
      description: 'Register new equipment',
      icon: FlaskConical,
      href: '/dashboard/equipment/new',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'View Reports',
      description: 'Compliance reports',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'AI Assistant',
      description: 'Get AI insights',
      icon: TrendingUp,
      href: '/dashboard/ai',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Biomni AI',
      description: 'Advanced laboratory intelligence',
      icon: TrendingUp,
      href: '/dashboard/biomni',
      color: 'from-indigo-500 to-blue-600'
    }
  ]

  const stats = [
    {
      title: 'Total Equipment',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: FlaskConical
    },
    {
      title: 'Pending Calibrations',
      value: '3',
      change: '-1',
      changeType: 'negative',
      icon: Calendar
    },
    {
      title: 'Compliance Score',
      value: '98%',
      change: '+2%',
      changeType: 'positive',
      icon: CheckCircle
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: Users
    }
  ]

  const recentActivities = [
    {
      title: 'Calibration Completed',
      description: 'pH Meter calibration completed successfully',
      time: '2 hours ago',
      type: 'success'
    },
    {
      title: 'Equipment Added',
      description: 'New spectrophotometer registered',
      time: '4 hours ago',
      type: 'info'
    },
    {
      title: 'Calibration Due',
      description: 'Microscope calibration due in 3 days',
      time: '1 day ago',
      type: 'warning'
    }
  ]

  return (
    <div className="space-y-6 mobile-spacing">
      {/* Mobile Header */}
      <div className="md:hidden">
        <h1 className="mobile-heading text-white mb-2">Dashboard</h1>
        <p className="mobile-text text-gray-400">Welcome back! Here's your laboratory overview.</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back! Here's your laboratory overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden lg:flex">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">3</Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile Grid */}
      <div className="mobile-grid-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="mobile-card hover:bg-slate-700/50 transition-all duration-200 cursor-pointer" onClick={() => router.push(action.href)}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mobile-subheading text-white font-medium">{action.title}</h3>
                  <p className="mobile-text text-gray-400">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mobile-grid md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="mobile-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mobile-text text-gray-400">{stat.title}</p>
                  <p className="mobile-heading text-white font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-xs ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                    <span className="mobile-text text-gray-400">from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mobile-grid lg:grid-cols-3 gap-6">
        {/* Compliance Overview */}
        <Card className="mobile-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="mobile-heading text-white">Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="mobile-text text-gray-400">Overall Compliance</span>
                <span className="mobile-text text-white font-semibold">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="mobile-text text-green-400 font-medium">Compliant</p>
                <p className="mobile-text text-gray-400">22 items</p>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="mobile-text text-yellow-400 font-medium">Due Soon</p>
                <p className="mobile-text text-gray-400">3 items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="mobile-heading text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className="mobile-text text-white font-medium">{activity.title}</p>
                    <p className="mobile-text text-gray-400">{activity.description}</p>
                    <p className="mobile-text text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Calibrations */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="mobile-heading text-white">Upcoming Calibrations</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/dashboard/calibrations')}
              className="mobile-button-secondary"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="mobile-text text-white font-medium">Microscope</p>
                  <p className="mobile-text text-gray-400">Due in 3 days</p>
                </div>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Due Soon
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="mobile-text text-white font-medium">Centrifuge</p>
                  <p className="mobile-text text-gray-400">Due in 1 week</p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Scheduled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Quick Actions */}
      <div className="md:hidden">
        <div className="flex space-x-2">
          <Button 
            className="flex-1 mobile-button-primary"
            onClick={() => router.push('/dashboard/calibrations/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Calibration
          </Button>
          <Button 
            variant="outline"
            className="flex-1 mobile-button-secondary"
            onClick={() => router.push('/dashboard/equipment/new')}
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>
    </div>
  )
} 