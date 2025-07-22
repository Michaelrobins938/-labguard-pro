'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  BarChart3,
  History,
  Plus,
  Eye
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
  description?: string
  installDate?: string
  warrantyExpiry?: string
  purchaseDate?: string
  purchasePrice?: number
  supplier?: string
  complianceStatus: string
  complianceScore: number
  lastCalibration?: string
  nextCalibration?: string
  calibrationRecords: CalibrationRecord[]
  maintenanceRecords: MaintenanceRecord[]
}

interface CalibrationRecord {
  id: string
  calibrationType: string
  scheduledDate: string
  performedDate?: string
  dueDate: string
  status: string
  complianceStatus: string
  complianceScore?: number
  performedBy?: {
    id: string
    name: string
    email: string
  }
}

interface MaintenanceRecord {
  id: string
  maintenanceType: string
  scheduledDate: string
  performedDate?: string
  description: string
  status: string
  cost?: number
}

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/equipment/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch equipment data')
        }

        const data = await response.json()
        setEquipment(data.data)
      } catch (err) {
        console.error('Error fetching equipment:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch equipment data')
        
        // Fallback to mock data for development
        const mockEquipment: Equipment = {
          id: params.id,
          name: 'Analytical Balance AB-001',
          model: 'Sartorius ME36S',
          serialNumber: 'AB-001',
          manufacturer: 'Sartorius',
          equipmentType: 'ANALYTICAL_BALANCE',
          location: 'Lab A - Room 101',
          status: 'ACTIVE',
          description: 'High-precision analytical balance used for accurate weight measurements in laboratory procedures.',
          installDate: '2023-06-15',
          warrantyExpiry: '2026-06-15',
          purchaseDate: '2023-05-20',
          purchasePrice: 8500.00,
          supplier: 'Sartorius North America',
          complianceStatus: 'COMPLIANT',
          complianceScore: 96.2,
          lastCalibration: '2024-01-15T10:30:00Z',
          nextCalibration: '2024-02-15T10:30:00Z',
          calibrationRecords: [
            {
              id: '1',
              calibrationType: 'PERIODIC',
              scheduledDate: '2024-01-15T09:00:00Z',
              performedDate: '2024-01-15T10:30:00Z',
              dueDate: '2024-02-15T10:30:00Z',
              status: 'COMPLETED',
              complianceStatus: 'COMPLIANT',
              complianceScore: 96.2,
              performedBy: {
                id: 'user1',
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@lab.com'
              }
            }
          ],
          maintenanceRecords: [
            {
              id: '1',
              maintenanceType: 'PREVENTIVE',
              scheduledDate: '2024-01-10T09:00:00Z',
              performedDate: '2024-01-10T11:00:00Z',
              description: 'Routine cleaning and inspection',
              status: 'COMPLETED',
              cost: 150.00
            }
          ]
        }
        setEquipment(mockEquipment)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [params.id])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Equipment Not Found</h3>
            <p className="text-gray-600 mb-6">
              {error || 'The equipment you are looking for could not be found.'}
            </p>
            <Link
              href="/dashboard/equipment"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Equipment
            </Link>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/equipment"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Equipment
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
                <p className="text-gray-600 mt-2">
                  {equipment.model} • {equipment.serialNumber}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/dashboard/equipment/${equipment.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <Link
                href={`/dashboard/calibrations/new?equipment=${equipment.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Calibration
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Equipment Overview</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Model</dt>
                        <dd className="text-sm font-medium text-gray-900">{equipment.model}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Serial Number</dt>
                        <dd className="text-sm font-medium text-gray-900">{equipment.serialNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Manufacturer</dt>
                        <dd className="text-sm font-medium text-gray-900">{equipment.manufacturer}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Equipment Type</dt>
                        <dd className="text-sm font-medium text-gray-900">{equipment.equipmentType.replace('_', ' ')}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location & Status</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Location</dt>
                        <dd className="text-sm font-medium text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {equipment.location}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Status</dt>
                        <dd>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(equipment.status)}`}>
                            {equipment.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Compliance Status</dt>
                        <dd>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getComplianceColor(equipment.complianceStatus)}`}>
                            {getComplianceIcon(equipment.complianceStatus)}
                            <span className="ml-1">{equipment.complianceStatus}</span>
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Compliance Score</dt>
                        <dd className="text-sm font-medium text-gray-900">{equipment.complianceScore}%</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {equipment.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-sm text-gray-900">{equipment.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calibration History */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Calibration History</h2>
                  <Link
                    href={`/dashboard/calibrations/new?equipment=${equipment.id}`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Schedule New
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {equipment.calibrationRecords.length > 0 ? (
                  <div className="space-y-4">
                    {equipment.calibrationRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {record.calibrationType} Calibration
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getComplianceColor(record.complianceStatus)}`}>
                            {record.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Scheduled:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(record.scheduledDate).toLocaleDateString()}
                            </span>
                          </div>
                          {record.performedDate && (
                            <div>
                              <span className="text-gray-600">Performed:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(record.performedDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Due:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(record.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {record.performedBy && (
                          <div className="mt-2 text-sm text-gray-600">
                            Performed by: {record.performedBy.name}
                          </div>
                        )}
                        {record.complianceScore && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Score:</span>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {record.complianceScore}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Calibration Records</h3>
                    <p className="text-gray-600 mb-4">
                      No calibration records found for this equipment.
                    </p>
                    <Link
                      href={`/dashboard/calibrations/new?equipment=${equipment.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule First Calibration
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href={`/dashboard/calibrations/new?equipment=${equipment.id}`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Schedule Calibration</span>
                </Link>
                <Link
                  href={`/dashboard/equipment/${equipment.id}/maintenance`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Schedule Maintenance</span>
                </Link>
                <Link
                  href={`/dashboard/equipment/${equipment.id}/analytics`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </Link>
                <Link
                  href={`/dashboard/equipment/${equipment.id}/documents`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">View Documents</span>
                </Link>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Equipment Details</h2>
              </div>
              <div className="p-6 space-y-4">
                {equipment.purchaseDate && (
                  <div>
                    <dt className="text-sm text-gray-600">Purchase Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{new Date(equipment.purchaseDate).toLocaleDateString()}</dd>
                  </div>
                )}
                {equipment.purchasePrice && (
                  <div>
                    <dt className="text-sm text-gray-600">Purchase Price</dt>
                    <dd className="text-sm font-medium text-gray-900 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {equipment.purchasePrice.toLocaleString()}
                    </dd>
                  </div>
                )}
                {equipment.supplier && (
                  <div>
                    <dt className="text-sm text-gray-600">Supplier</dt>
                    <dd className="text-sm font-medium text-gray-900">{equipment.supplier}</dd>
                  </div>
                )}
                {equipment.installDate && (
                  <div>
                    <dt className="text-sm text-gray-600">Installation Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{new Date(equipment.installDate).toLocaleDateString()}</dd>
                  </div>
                )}
                {equipment.warrantyExpiry && (
                  <div>
                    <dt className="text-sm text-gray-600">Warranty Expiry</dt>
                    <dd className="text-sm font-medium text-gray-900">{new Date(equipment.warrantyExpiry).toLocaleDateString()}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Next Calibration */}
            {equipment.nextCalibration && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Next Calibration</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Due Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(equipment.nextCalibration).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getComplianceColor(equipment.complianceStatus)}`}>
                      {getComplianceIcon(equipment.complianceStatus)}
                      <span className="ml-1">{equipment.complianceStatus}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 