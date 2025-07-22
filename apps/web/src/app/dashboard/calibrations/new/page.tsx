'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Settings,
  User,
  FileText,
  CheckCircle
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  equipmentType: string
  location: string
  lastCalibratedAt?: string
  nextCalibrationAt?: string
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  version: string
}

export default function NewCalibrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [calibrationType, setCalibrationType] = useState<string>('PERIODIC')
  const [scheduledDate, setScheduledDate] = useState<string>('')
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [dueTime, setDueTime] = useState<string>('')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  // Mock data - replace with API calls
  useEffect(() => {
    const mockEquipment: Equipment[] = [
      {
        id: 'eq1',
        name: 'Analytical Balance AB-001',
        model: 'Sartorius ME36S',
        serialNumber: 'AB-001',
        equipmentType: 'ANALYTICAL_BALANCE',
        location: 'Lab A - Room 101',
        lastCalibratedAt: '2024-01-01T10:00:00Z',
        nextCalibrationAt: '2024-02-01T10:00:00Z'
      },
      {
        id: 'eq2',
        name: 'Centrifuge CF-003',
        model: 'Eppendorf 5810R',
        serialNumber: 'CF-003',
        equipmentType: 'CENTRIFUGE',
        location: 'Lab B - Room 102',
        lastCalibratedAt: '2024-01-05T14:00:00Z',
        nextCalibrationAt: '2024-02-05T14:00:00Z'
      },
      {
        id: 'eq3',
        name: 'pH Meter PH-002',
        model: 'Thermo Scientific Orion',
        serialNumber: 'PH-002',
        equipmentType: 'OTHER',
        location: 'Lab A - Room 101',
        lastCalibratedAt: '2024-01-10T09:00:00Z',
        nextCalibrationAt: '2024-02-10T09:00:00Z'
      }
    ]

    const mockTemplates: Template[] = [
      {
        id: 'tpl1',
        name: 'Analytical Balance Calibration',
        description: 'Standard calibration procedure for analytical balances',
        category: 'Equipment Calibration',
        version: '1.0'
      },
      {
        id: 'tpl2',
        name: 'Centrifuge Calibration',
        description: 'Calibration procedure for laboratory centrifuges',
        category: 'Equipment Calibration',
        version: '1.0'
      },
      {
        id: 'tpl3',
        name: 'pH Meter Calibration',
        description: 'Calibration procedure for pH meters and electrodes',
        category: 'Equipment Calibration',
        version: '1.0'
      }
    ]

    setEquipment(mockEquipment)
    setTemplates(mockTemplates)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Combine date and time
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00Z`
      const dueDateTime = `${dueDate}T${dueTime}:00Z`

      const calibrationData = {
        equipmentId: selectedEquipment,
        templateId: selectedTemplate,
        calibrationType,
        scheduledDate: scheduledDateTime,
        dueDate: dueDateTime,
        assignedToId: assignedTo,
        notes
      }

      // Mock API call - replace with actual API
      console.log('Creating calibration:', calibrationData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/dashboard/calibrations')
    } catch (error) {
      console.error('Failed to create calibration:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedEquipmentData = equipment.find(eq => eq.id === selectedEquipment)
  const selectedTemplateData = templates.find(tpl => tpl.id === selectedTemplate)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Calibration</h1>
          <p className="text-gray-600">Create a new calibration schedule</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>
              Equipment & Template
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
              Schedule & Assignment
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-600'}`}>
              Review & Create
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Equipment & Template Selection */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Select Equipment & Template</h2>
          
          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select equipment</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.serialNumber})
                </option>
              ))}
            </select>
            
            {selectedEquipmentData && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Model:</span>
                    <span className="ml-2 text-gray-600">{selectedEquipmentData.model}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{selectedEquipmentData.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Calibrated:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedEquipmentData.lastCalibratedAt 
                        ? new Date(selectedEquipmentData.lastCalibratedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Next Due:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedEquipmentData.nextCalibrationAt 
                        ? new Date(selectedEquipmentData.nextCalibrationAt).toLocaleDateString()
                        : 'Not scheduled'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calibration Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calibration Type
            </label>
            <select
              value={calibrationType}
              onChange={(e) => setCalibrationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INITIAL">Initial Calibration</option>
              <option value="PERIODIC">Periodic Calibration</option>
              <option value="AFTER_REPAIR">After Repair</option>
              <option value="VERIFICATION">Verification</option>
              <option value="INTERIM_CHECK">Interim Check</option>
            </select>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compliance Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select template</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
            
            {selectedTemplateData && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-blue-900">{selectedTemplateData.name}</div>
                  <div className="text-blue-700">{selectedTemplateData.description}</div>
                  <div className="text-blue-600 text-xs mt-1">Version {selectedTemplateData.version}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedEquipment || !selectedTemplate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Schedule & Assignment */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Schedule & Assignment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scheduled Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Due Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select technician</option>
              <option value="user1">Dr. Sarah Johnson</option>
              <option value="user2">Mike Chen</option>
              <option value="user3">Lisa Rodriguez</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes or special instructions..."
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!scheduledDate || !scheduledTime || !dueDate || !dueTime}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Create */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Review & Create</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Equipment</h3>
                <p className="text-sm text-gray-600">{selectedEquipmentData?.name}</p>
                <p className="text-xs text-gray-500">{selectedEquipmentData?.model} • {selectedEquipmentData?.serialNumber}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Template</h3>
                <p className="text-sm text-gray-600">{selectedTemplateData?.name}</p>
                <p className="text-xs text-gray-500">{selectedTemplateData?.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Schedule</h3>
                <p className="text-sm text-gray-600">
                  {scheduledDate} at {scheduledTime}
                </p>
                <p className="text-xs text-gray-500">Due: {dueDate} at {dueTime}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Type</h3>
                <p className="text-sm text-gray-600">{calibrationType}</p>
              </div>
            </div>
            
            {notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Calibration</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 