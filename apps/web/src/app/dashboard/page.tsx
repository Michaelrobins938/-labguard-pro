'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Bell,
  Upload,
  Database,
  Key,
  Zap,
  Search,
  Shield
} from 'lucide-react'

interface DashboardStats {
  totalEquipment: number
  overdueCalibrations: number
  completedCalibrations: number
  upcomingCalibrations: number
  complianceScore: number
  teamMembers: number
  activeAssignments: number
  pendingInvitations: number
  unreadNotifications: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    overdueCalibrations: 0,
    completedCalibrations: 0,
    upcomingCalibrations: 0,
    complianceScore: 0,
    teamMembers: 0,
    activeAssignments: 0,
    pendingInvitations: 0,
    unreadNotifications: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for beta testing
    setTimeout(() => {
      setStats({
        totalEquipment: 24,
        overdueCalibrations: 3,
        completedCalibrations: 156,
        upcomingCalibrations: 8,
        complianceScore: 94,
        teamMembers: 6,
        activeAssignments: 12,
        pendingInvitations: 2,
        unreadNotifications: 5
      })
      setLoading(false)
    }, 1000)
  }, [])

  const recentActivities = [
    {
      id: 1,
      type: 'calibration',
      title: 'Centrifuge calibration completed',
      description: 'Equipment ID: CF-001 passed all tests',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Overdue calibration detected',
      description: 'Microscope MS-003 is 5 days overdue',
      time: '4 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'report',
      title: 'Monthly compliance report generated',
      description: 'Compliance score: 94%',
      time: '1 day ago',
      status: 'info'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, Beta User!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your laboratory compliance today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueCalibrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCalibrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Score</h2>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Score</span>
              <span className="text-sm font-medium text-gray-900">{stats.complianceScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.complianceScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                activity.status === 'success' ? 'bg-green-100' :
                activity.status === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                {activity.type === 'calibration' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                {activity.type === 'report' && <BarChart3 className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/equipment/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Add Equipment</span>
          </Link>
          <Link href="/dashboard/calibrations/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Schedule Calibration</span>
          </Link>
          <Link href="/dashboard/team/invite" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Invite Team Member</span>
          </Link>
          <Link href="/dashboard/notifications" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-indigo-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Notifications</span>
          </Link>
          <Link href="/dashboard/bulk-operations" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-5 h-5 text-orange-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Bulk Operations</span>
          </Link>
          <Link href="/dashboard/data-management" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Database className="w-5 h-5 text-teal-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Data Management</span>
          </Link>
          <Link href="/dashboard/api" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Key className="w-5 h-5 text-yellow-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">API Management</span>
          </Link>
          <Link href="/dashboard/automation" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Zap className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Automation</span>
          </Link>
          <Link href="/dashboard/search" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Search className="w-5 h-5 text-gray-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Global Search</span>
          </Link>
          <Link href="/dashboard/analytics/enterprise" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Enterprise Analytics</span>
          </Link>
          <Link href="/admin/system" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Shield className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">System Admin</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 