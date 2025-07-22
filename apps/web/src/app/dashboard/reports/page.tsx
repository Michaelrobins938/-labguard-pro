'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  Eye,
  Settings
} from 'lucide-react'

interface ReportStats {
  totalReports: number
  complianceRate: number
  overdueCalibrations: number
  upcomingCalibrations: number
  aiChecksThisMonth: number
  totalEquipment: number
}

interface RecentReport {
  id: string
  title: string
  type: string
  generatedAt: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
  generatedBy: string
  equipmentCount: number
  complianceScore: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats>({
    totalReports: 0,
    complianceRate: 0,
    overdueCalibrations: 0,
    upcomingCalibrations: 0,
    aiChecksThisMonth: 0,
    totalEquipment: 0
  })
  const [recentReports, setRecentReports] = useState<RecentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data - replace with API call
  useEffect(() => {
    const mockStats: ReportStats = {
      totalReports: 156,
      complianceRate: 94.2,
      overdueCalibrations: 3,
      upcomingCalibrations: 12,
      aiChecksThisMonth: 89,
      totalEquipment: 24
    }

    const mockRecentReports: RecentReport[] = [
      {
        id: '1',
        title: 'Monthly Compliance Report - January 2024',
        type: 'COMPLIANCE_SUMMARY',
        generatedAt: '2024-01-31T10:30:00Z',
        status: 'COMPLETED',
        generatedBy: 'Dr. Sarah Johnson',
        equipmentCount: 24,
        complianceScore: 96.5
      },
      {
        id: '2',
        title: 'Equipment Performance Analysis',
        type: 'EQUIPMENT_ANALYSIS',
        generatedAt: '2024-01-30T14:15:00Z',
        status: 'COMPLETED',
        generatedBy: 'Mike Chen',
        equipmentCount: 18,
        complianceScore: 92.1
      },
      {
        id: '3',
        title: 'CAP Audit Preparation Report',
        type: 'AUDIT_PREPARATION',
        generatedAt: '2024-01-29T09:45:00Z',
        status: 'IN_PROGRESS',
        generatedBy: 'Dr. Sarah Johnson',
        equipmentCount: 24,
        complianceScore: 0
      },
      {
        id: '4',
        title: 'AI Validation Summary - Q4 2023',
        type: 'AI_VALIDATION',
        generatedAt: '2024-01-28T16:20:00Z',
        status: 'COMPLETED',
        generatedBy: 'System',
        equipmentCount: 24,
        complianceScore: 94.8
      }
    ]

    setStats(mockStats)
    setRecentReports(mockRecentReports)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />
      case 'FAILED':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COMPLIANCE_SUMMARY':
        return <CheckCircle className="w-4 h-4" />
      case 'EQUIPMENT_ANALYSIS':
        return <BarChart3 className="w-4 h-4" />
      case 'AUDIT_PREPARATION':
        return <FileText className="w-4 h-4" />
      case 'AI_VALIDATION':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredReports = recentReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">
                Generate compliance reports, analyze performance, and track laboratory metrics
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/reports/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Link>
              <Link
                href="/dashboard/reports/templates"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Settings className="w-4 h-4 mr-2" />
                Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Calibrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingCalibrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Calibrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueCalibrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/dashboard/reports/compliance"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Compliance Report</h3>
                  <p className="text-sm text-gray-600">Generate compliance summary</p>
                </div>
              </Link>

              <Link
                href="/dashboard/reports/equipment"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Equipment Analysis</h3>
                  <p className="text-sm text-gray-600">Performance and maintenance</p>
                </div>
              </Link>

              <Link
                href="/dashboard/reports/audit"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Audit Preparation</h3>
                  <p className="text-sm text-gray-600">CAP/CLIA audit readiness</p>
                </div>
              </Link>

              <Link
                href="/dashboard/reports/ai-validation"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="w-8 h-8 text-orange-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">AI Validation</h3>
                  <p className="text-sm text-gray-600">AI check performance</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <Link
                href="/dashboard/reports/history"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Reports
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="COMPLIANCE_SUMMARY">Compliance Summary</option>
                  <option value="EQUIPMENT_ANALYSIS">Equipment Analysis</option>
                  <option value="AUDIT_PREPARATION">Audit Preparation</option>
                  <option value="AI_VALIDATION">AI Validation</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setTypeFilter('all')
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(report.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {report.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Generated by {report.generatedBy}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {report.equipmentCount} equipment items
                        </span>
                        {report.complianceScore > 0 && (
                          <span className="text-sm text-gray-500">
                            {report.complianceScore}% compliance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status.replace('_', ' ')}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/reports/${report.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || typeFilter !== 'all'
                  ? 'No reports match your filters'
                  : 'No reports generated yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || typeFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Generate your first report to get started.'
                }
              </p>
              <Link
                href="/dashboard/reports/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 