'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Play,
  Edit
} from 'lucide-react'

interface Calibration {
  id: string
  equipment: {
    id: string
    name: string
    model: string
    serialNumber: string
    equipmentType: string
    location: string
  }
  calibrationType: string
  scheduledDate: string
  dueDate: string
  performedDate?: string
  status: string
  complianceStatus: string
  complianceScore?: number
  performedBy?: {
    id: string
    name: string
    email: string
  }
}

export default function CalibrationsPage() {
  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [error, setError] = useState<string | null>(null)

  // Fetch calibration data from API
  useEffect(() => {
    const fetchCalibrations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/calibrations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch calibration data')
        }

        const data = await response.json()
        
        // Transform API data to match our interface
        const transformedCalibrations = data.data.map((item: any) => ({
          id: item.id,
          equipment: {
            id: item.equipment.id,
            name: item.equipment.name,
            model: item.equipment.model,
            serialNumber: item.equipment.serialNumber,
            equipmentType: item.equipment.equipmentType,
            location: item.equipment.location || 'Not specified'
          },
          calibrationType: item.calibrationType,
          scheduledDate: item.scheduledDate,
          dueDate: item.dueDate,
          performedDate: item.performedDate,
          status: item.status,
          complianceStatus: item.complianceStatus,
          complianceScore: item.complianceScore,
          performedBy: item.performedBy
        }))

        setCalibrations(transformedCalibrations)
      } catch (err) {
        console.error('Error fetching calibrations:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch calibration data')
        
        // Fallback to mock data for development
        const mockCalibrations: Calibration[] = [
          {
            id: '1',
            equipment: {
              id: 'eq1',
              name: 'Analytical Balance AB-001',
              model: 'Sartorius ME36S',
              serialNumber: 'AB-001',
              equipmentType: 'ANALYTICAL_BALANCE',
              location: 'Lab A - Room 101'
            },
            calibrationType: 'PERIODIC',
            scheduledDate: '2024-01-15T09:00:00Z',
            dueDate: '2024-01-15T17:00:00Z',
            performedDate: '2024-01-15T10:30:00Z',
            status: 'COMPLETED',
            complianceStatus: 'COMPLIANT',
            complianceScore: 95,
            performedBy: {
              id: 'user1',
              name: 'Dr. Sarah Johnson',
              email: 'sarah.johnson@lab.com'
            }
          },
          {
            id: '2',
            equipment: {
              id: 'eq2',
              name: 'Centrifuge CF-003',
              model: 'Eppendorf 5810R',
              serialNumber: 'CF-003',
              equipmentType: 'CENTRIFUGE',
              location: 'Lab B - Room 102'
            },
            calibrationType: 'PERIODIC',
            scheduledDate: '2024-01-20T09:00:00Z',
            dueDate: '2024-01-20T17:00:00Z',
            status: 'SCHEDULED',
            complianceStatus: 'PENDING'
          },
          {
            id: '3',
            equipment: {
              id: 'eq3',
              name: 'pH Meter PH-002',
              model: 'Thermo Scientific Orion',
              serialNumber: 'PH-002',
              equipmentType: 'OTHER',
              location: 'Lab A - Room 101'
            },
            calibrationType: 'PERIODIC',
            scheduledDate: '2024-01-10T09:00:00Z',
            dueDate: '2024-01-10T17:00:00Z',
            status: 'OVERDUE',
            complianceStatus: 'NON_COMPLIANT'
          }
        ]
        setCalibrations(mockCalibrations)
      } finally {
        setLoading(false)
      }
    }

    fetchCalibrations()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'SCHEDULED':
        return 'bg-gray-100 text-gray-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800'
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800'
      case 'CONDITIONAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCalibrations = calibrations.filter(calibration => {
    const matchesSearch = calibration.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calibration.equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || calibration.status === statusFilter
    const matchesType = typeFilter === 'all' || calibration.calibrationType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Calibrations</h1>
          <p className="text-gray-600">Manage equipment calibrations and compliance</p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {error} - Using demo data for preview
              </p>
            </div>
          )}
        </div>
        <Link
          href="/dashboard/calibrations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Calibration</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{calibrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {calibrations.filter(c => c.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {calibrations.filter(c => c.status === 'SCHEDULED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {calibrations.filter(c => c.status === 'OVERDUE').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="INITIAL">Initial</option>
              <option value="PERIODIC">Periodic</option>
              <option value="AFTER_REPAIR">After Repair</option>
              <option value="VERIFICATION">Verification</option>
              <option value="INTERIM_CHECK">Interim Check</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calibrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalibrations.map((calibration) => (
                <tr key={calibration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {calibration.equipment.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {calibration.equipment.model} • {calibration.equipment.serialNumber}
                      </div>
                      <div className="text-xs text-gray-400">
                        {calibration.equipment.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{calibration.calibrationType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(calibration.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(calibration.scheduledDate).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(calibration.status)}`}>
                      {calibration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceColor(calibration.complianceStatus)}`}>
                        {calibration.complianceStatus}
                      </span>
                      {calibration.complianceScore && (
                        <span className="text-xs text-gray-500">
                          {calibration.complianceScore}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {calibration.performedBy ? (
                      <div>
                        <div className="text-sm text-gray-900">{calibration.performedBy.name}</div>
                        <div className="text-xs text-gray-500">{calibration.performedBy.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/dashboard/calibrations/${calibration.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {calibration.status === 'SCHEDULED' && (
                        <Link
                          href={`/dashboard/calibrations/${calibration.id}/perform`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                      )}
                      {calibration.status === 'IN_PROGRESS' && (
                        <Link
                          href={`/dashboard/calibrations/${calibration.id}/perform`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCalibrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No calibrations found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by scheduling your first calibration'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Link
              href="/dashboard/calibrations/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Schedule Calibration
            </Link>
          )}
        </div>
      )}
    </div>
  )
} 