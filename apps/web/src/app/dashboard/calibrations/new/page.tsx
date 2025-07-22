'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  equipmentType: string
  location: string
}

interface CalibrationFormData {
  equipmentId: string
  calibrationType: string
  scheduledDate: string
  scheduledTime: string
  dueDate: string
  dueTime: string
  description: string
  notes: string
}

export default function NewCalibrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedEquipment = searchParams.get('equipment')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [equipmentLoading, setEquipmentLoading] = useState(true)
  
  const [formData, setFormData] = useState<CalibrationFormData>({
    equipmentId: preSelectedEquipment || '',
    calibrationType: 'PERIODIC',
    scheduledDate: '',
    scheduledTime: '',
    dueDate: '',
    dueTime: '',
    description: '',
    notes: ''
  })

  // Fetch equipment list
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setEquipmentLoading(true)
        
        const response = await fetch('/api/equipment', {
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
        // Fallback to mock data
        const mockEquipment: Equipment[] = [
          {
            id: '1',
            name: 'Analytical Balance AB-001',
            model: 'Sartorius ME36S',
            serialNumber: 'AB-001',
            equipmentType: 'ANALYTICAL_BALANCE',
            location: 'Lab A - Room 101'
          },
          {
            id: '2',
            name: 'Centrifuge CF-003',
            model: 'Eppendorf 5810R',
            serialNumber: 'CF-003',
            equipmentType: 'CENTRIFUGE',
            location: 'Lab B - Room 102'
          },
          {
            id: '3',
            name: 'pH Meter PH-002',
            model: 'Thermo Scientific Orion',
            serialNumber: 'PH-002',
            equipmentType: 'OTHER',
            location: 'Lab A - Room 101'
          }
        ]
        setEquipment(mockEquipment)
      } finally {
        setEquipmentLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.equipmentId) return 'Equipment selection is required'
    if (!formData.scheduledDate) return 'Scheduled date is required'
    if (!formData.scheduledTime) return 'Scheduled time is required'
    if (!formData.dueDate) return 'Due date is required'
    if (!formData.dueTime) return 'Due time is required'
    
    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`)
    
    if (scheduledDateTime >= dueDateTime) {
      return 'Due date/time must be after scheduled date/time'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`)

      const response = await fetch('/api/calibrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          equipmentId: formData.equipmentId,
          calibrationType: formData.calibrationType,
          scheduledDate: scheduledDateTime.toISOString(),
          dueDate: dueDateTime.toISOString(),
          description: formData.description.trim() || undefined,
          notes: formData.notes.trim() || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create calibration')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/calibrations')
      }, 1500)
    } catch (err) {
      console.error('Error creating calibration:', err)
      setError(err instanceof Error ? err.message : 'Failed to create calibration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/calibrations"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calibrations
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule Calibration</h1>
                <p className="text-gray-600 mt-2">
                  Schedule a new calibration for laboratory equipment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Calibration Scheduled Successfully</h3>
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to calibrations list...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Equipment Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Selection</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Equipment *
                </label>
                {equipmentLoading ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded border border-gray-300"></div>
                  </div>
                ) : (
                  <select
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select equipment...</option>
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.model} ({item.serialNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Calibration Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Calibration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calibration Type *
                  </label>
                  <select
                    name="calibrationType"
                    value={formData.calibrationType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="INITIAL">Initial</option>
                    <option value="PERIODIC">Periodic</option>
                    <option value="AFTER_REPAIR">After Repair</option>
                    <option value="VERIFICATION">Verification</option>
                    <option value="INTERIM_CHECK">Interim Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the calibration"
                  />
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time *
                  </label>
                  <input
                    type="time"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes or special instructions..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/calibrations"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || equipmentLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Calibration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 