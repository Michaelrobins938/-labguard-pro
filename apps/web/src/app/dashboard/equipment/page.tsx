'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  manufacturer: string
  equipmentType: string
  location: string
  status: string
  lastCalibration: string
  nextCalibration: string
  complianceStatus: string
  complianceScore: number
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - replace with API call
  useEffect(() => {
    const mockEquipment: Equipment[] = [
      {
        id: '1',
        name: 'Analytical Balance AB-001',
        model: 'Sartorius ME36S',
        serialNumber: 'AB-001',
        manufacturer: 'Sartorius',
        equipmentType: 'ANALYTICAL_BALANCE',
        location: 'Lab A - Room 101',
        status: 'ACTIVE',
        lastCalibration: '2024-01-15T10:30:00Z',
        nextCalibration: '2024-02-15T10:30:00Z',
        complianceStatus: 'COMPLIANT',
        complianceScore: 96.2
      },
      {
        id: '2',
        name: 'Centrifuge CF-003',
        model: 'Eppendorf 5810R',
        serialNumber: 'CF-003',
        manufacturer: 'Eppendorf',
        equipmentType: 'CENTRIFUGE',
        location: 'Lab B - Room 102',
        status: 'ACTIVE',
        lastCalibration: '2024-01-20T14:15:00Z',
        nextCalibration: '2024-02-20T14:15:00Z',
        complianceStatus: 'COMPLIANT',
        complianceScore: 92.1
      },
      {
        id: '3',
        name: 'pH Meter PH-002',
        model: 'Thermo Scientific Orion',
        serialNumber: 'PH-002',
        manufacturer: 'Thermo Scientific',
        equipmentType: 'OTHER',
        location: 'Lab A - Room 101',
        status: 'ACTIVE',
        lastCalibration: '2024-01-10T09:00:00Z',
        nextCalibration: '2024-02-10T09:00:00Z',
        complianceStatus: 'WARNING',
        complianceScore: 88.5
      },
      {
        id: '4',
        name: 'Microscope MS-005',
        model: 'Olympus BX53',
        serialNumber: 'MS-005',
        manufacturer: 'Olympus',
        equipmentType: 'MICROSCOPE',
        location: 'Lab C - Room 103',
        status: 'MAINTENANCE',
        lastCalibration: '2024-01-05T11:00:00Z',
        nextCalibration: '2024-02-05T11:00:00Z',
        complianceStatus: 'OVERDUE',
        complianceScore: 75.2
      }
    ]

    setEquipment(mockEquipment)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="w-4 h-4" />
      case 'WARNING':
        return <Clock className="w-4 h-4" />
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.equipmentType === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
              <p className="text-gray-600 mt-2">
                Manage laboratory equipment, track calibrations, and monitor compliance
              </p>
            </div>
            <Link
              href="/dashboard/equipment/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Equipment
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, serial, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="ANALYTICAL_BALANCE">Analytical Balance</option>
                <option value="CENTRIFUGE">Centrifuge</option>
                <option value="MICROSCOPE">Microscope</option>
                <option value="INCUBATOR">Incubator</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getComplianceColor(item.complianceStatus)}`}>
                    {getComplianceIcon(item.complianceStatus)}
                    <span className="ml-1">{item.complianceStatus}</span>
                  </div>
                </div>
              </div>

              {/* Equipment Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">{item.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Serial:</span>
                    <span className="font-medium">{item.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manufacturer:</span>
                    <span className="font-medium">{item.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{item.equipmentType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance Score</span>
                    <span className="text-lg font-semibold text-gray-900">{item.complianceScore}%</span>
                  </div>
                </div>

                {/* Calibration Info */}
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center text-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Next calibration: {new Date(item.nextCalibration).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/equipment/${item.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                  <Link
                    href={`/dashboard/equipment/${item.id}/edit`}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'No equipment matches your filters'
                : 'No equipment added yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Add your first piece of equipment to get started.'
              }
            </p>
            <Link
              href="/dashboard/equipment/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 