'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Droplets,
  Gauge,
  Scale,
  Target,
  FileText,
  Brain,
  Download,
  Send
} from 'lucide-react'

interface CalibrationData {
  id: string
  equipment: {
    id: string
    name: string
    model: string
    serialNumber: string
    equipmentType: string
    location: string
    specifications: any
  }
  calibrationType: string
  scheduledDate: string
  dueDate: string
  status: string
  template: {
    id: string
    name: string
    description: string
  }
  performedBy?: {
    id: string
    name: string
    email: string
  }
}

interface MeasurementData {
  linearity: {
    weights: number[]
    readings: number[]
    deviations: number[]
  }
  repeatability: {
    measurements: number[]
    standardDeviation: number
  }
  accuracy: {
    referenceValue: number
    measuredValue: number
    deviation: number
  }
}

interface EnvironmentalConditions {
  temperature: number
  humidity: number
  pressure?: number
  vibration?: string
}

interface StandardsUsed {
  referenceWeights: string[]
  certificates: string[]
  expiryDates: string[]
}

export default function PerformCalibrationPage() {
  const router = useRouter()
  const params = useParams()
  const calibrationId = params.id as string
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [aiValidating, setAiValidating] = useState(false)
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null)
  const [measurements, setMeasurements] = useState<MeasurementData>({
    linearity: { weights: [], readings: [], deviations: [] },
    repeatability: { measurements: [], standardDeviation: 0 },
    accuracy: { referenceValue: 0, measuredValue: 0, deviation: 0 }
  })
  const [environmentalConditions, setEnvironmentalConditions] = useState<EnvironmentalConditions>({
    temperature: 0,
    humidity: 0
  })
  const [standardsUsed, setStandardsUsed] = useState<StandardsUsed>({
    referenceWeights: [],
    certificates: [],
    expiryDates: []
  })
  const [aiResults, setAiResults] = useState<any>(null)

  // Mock data - replace with API call
  useEffect(() => {
    const mockCalibrationData: CalibrationData = {
      id: calibrationId,
      equipment: {
        id: 'eq1',
        name: 'Analytical Balance AB-001',
        model: 'Sartorius ME36S',
        serialNumber: 'AB-001',
        equipmentType: 'ANALYTICAL_BALANCE',
        location: 'Lab A - Room 101',
        specifications: {
          capacity: '220g',
          readability: '0.01mg',
          accuracy: '±0.1mg'
        }
      },
      calibrationType: 'PERIODIC',
      scheduledDate: '2024-01-15T09:00:00Z',
      dueDate: '2024-01-15T17:00:00Z',
      status: 'IN_PROGRESS',
      template: {
        id: 'tpl1',
        name: 'Analytical Balance Calibration',
        description: 'Standard calibration procedure for analytical balances'
      },
      performedBy: {
        id: 'user1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@lab.com'
      }
    }

    setCalibrationData(mockCalibrationData)
  }, [calibrationId])

  const handleStartCalibration = async () => {
    setLoading(true)
    try {
      // Mock API call to start calibration
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep(2)
    } catch (error) {
      console.error('Failed to start calibration:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnvironmentalConditions = () => {
    setStep(3)
  }

  const handleMeasurements = () => {
    setStep(4)
  }

  const handleAIValidation = async () => {
    setAiValidating(true)
    try {
      // Mock AI validation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAiResults = {
        status: 'PASS',
        complianceScore: 95,
        performanceSummary: 'All measurements within acceptable limits. Equipment meets calibration requirements.',
        correctiveActions: [],
        deviations: [],
        recommendations: ['Continue with normal operation', 'Schedule next calibration in 12 months'],
        confidence: 0.95
      }
      
      setAiResults(mockAiResults)
      setStep(5)
    } catch (error) {
      console.error('AI validation failed:', error)
    } finally {
      setAiValidating(false)
    }
  }

  const handleCompleteCalibration = async () => {
    setLoading(true)
    try {
      // Mock API call to complete calibration
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/dashboard/calibrations/${calibrationId}/results`)
    } catch (error) {
      console.error('Failed to complete calibration:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!calibrationData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Perform Calibration</h1>
          <p className="text-gray-600">{calibrationData.equipment.name}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Pre-Calibration', icon: Play },
            { step: 2, label: 'Environmental', icon: Thermometer },
            { step: 3, label: 'Measurements', icon: Scale },
            { step: 4, label: 'AI Validation', icon: Brain },
            { step: 5, label: 'Complete', icon: CheckCircle }
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= item.step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium ${step >= item.step ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
              {index < 4 && <div className="flex-1 h-px bg-gray-200 mx-4"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Pre-Calibration Check */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Pre-Calibration Check</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Equipment Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {calibrationData.equipment.name}</div>
                <div><span className="font-medium">Model:</span> {calibrationData.equipment.model}</div>
                <div><span className="font-medium">Serial:</span> {calibrationData.equipment.serialNumber}</div>
                <div><span className="font-medium">Location:</span> {calibrationData.equipment.location}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Calibration Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Type:</span> {calibrationData.calibrationType}</div>
                <div><span className="font-medium">Template:</span> {calibrationData.template.name}</div>
                <div><span className="font-medium">Scheduled:</span> {new Date(calibrationData.scheduledDate).toLocaleString()}</div>
                <div><span className="font-medium">Performed By:</span> {calibrationData.performedBy?.name}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Pre-Calibration Checklist</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Equipment is clean and free of debris</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Reference standards are available and within calibration period</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Environmental conditions are stable</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>All required documentation is available</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartCalibration}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Calibration</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Environmental Conditions */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Environmental Conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C)
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.1"
                  value={environmentalConditions.temperature}
                  onChange={(e) => setEnvironmentalConditions(prev => ({
                    ...prev,
                    temperature: parseFloat(e.target.value) || 0
                  }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="22.5"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidity (%)
              </label>
              <div className="relative">
                <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.1"
                  value={environmentalConditions.humidity}
                  onChange={(e) => setEnvironmentalConditions(prev => ({
                    ...prev,
                    humidity: parseFloat(e.target.value) || 0
                  }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="45.0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pressure (hPa) - Optional
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.1"
                  value={environmentalConditions.pressure || ''}
                  onChange={(e) => setEnvironmentalConditions(prev => ({
                    ...prev,
                    pressure: parseFloat(e.target.value) || undefined
                  }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1013.25"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vibration Level - Optional
              </label>
              <select
                value={environmentalConditions.vibration || ''}
                onChange={(e) => setEnvironmentalConditions(prev => ({
                  ...prev,
                  vibration: e.target.value || undefined
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select vibration level</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="NONE">None detected</option>
              </select>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Acceptable Ranges</h3>
            <div className="text-sm text-green-800 space-y-1">
              <div>• Temperature: 20°C ± 2°C</div>
              <div>• Humidity: 45% - 75%</div>
              <div>• Vibration: Minimal to none</div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleEnvironmentalConditions}
              disabled={!environmentalConditions.temperature || !environmentalConditions.humidity}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Measurements */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Measurement Data Entry</h2>
          
          <div className="space-y-6">
            {/* Linearity Check */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Linearity Check</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Weights (g)</label>
                  <input
                    type="text"
                    placeholder="0, 1, 5, 10, 20, 50, 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const weights = e.target.value.split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w))
                      setMeasurements(prev => ({
                        ...prev,
                        linearity: { ...prev.linearity, weights }
                      }))
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measured Values (g)</label>
                  <input
                    type="text"
                    placeholder="0.001, 1.002, 5.001, 10.003, 20.002, 50.001, 100.002"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const readings = e.target.value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
                      setMeasurements(prev => ({
                        ...prev,
                        linearity: { ...prev.linearity, readings }
                      }))
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deviations (mg)</label>
                  <input
                    type="text"
                    placeholder="0.001, 0.002, 0.001, 0.003, 0.002, 0.001, 0.002"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const deviations = e.target.value.split(',').map(d => parseFloat(d.trim())).filter(d => !isNaN(d))
                      setMeasurements(prev => ({
                        ...prev,
                        linearity: { ...prev.linearity, deviations }
                      }))
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Repeatability Check */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Repeatability Check (10 measurements)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurements (g)</label>
                  <input
                    type="text"
                    placeholder="10.001, 10.002, 10.001, 10.003, 10.002, 10.001, 10.002, 10.001, 10.003, 10.002"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const measurements = e.target.value.split(',').map(m => parseFloat(m.trim())).filter(m => !isNaN(m))
                      const standardDeviation = measurements.length > 0 
                        ? Math.sqrt(measurements.reduce((sum, m) => sum + Math.pow(m - measurements.reduce((a, b) => a + b) / measurements.length, 2), 0) / measurements.length)
                        : 0
                      setMeasurements(prev => ({
                        ...prev,
                        repeatability: { measurements, standardDeviation }
                      }))
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard Deviation (mg)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={measurements.repeatability.standardDeviation}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Accuracy Check */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Accuracy Check</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Value (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={measurements.accuracy.referenceValue}
                    onChange={(e) => setMeasurements(prev => ({
                      ...prev,
                      accuracy: { ...prev.accuracy, referenceValue: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measured Value (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={measurements.accuracy.measuredValue}
                    onChange={(e) => {
                      const measuredValue = parseFloat(e.target.value) || 0
                      const referenceValue = measurements.accuracy.referenceValue
                      const deviation = measuredValue - referenceValue
                      setMeasurements(prev => ({
                        ...prev,
                        accuracy: { ...prev.accuracy, measuredValue, deviation }
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deviation (mg)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={measurements.accuracy.deviation}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleMeasurements}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: AI Validation */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Compliance Validation</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">AI Analysis</h3>
            </div>
            <p className="text-sm text-blue-800">
              Our AI will analyze your calibration data against CAP/CLIA compliance standards and provide detailed recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Data Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Temperature:</span> {environmentalConditions.temperature}°C</div>
                <div><span className="font-medium">Humidity:</span> {environmentalConditions.humidity}%</div>
                <div><span className="font-medium">Max Deviation:</span> {Math.max(...measurements.linearity.deviations)} mg</div>
                <div><span className="font-medium">Repeatability SD:</span> {measurements.repeatability.standardDeviation.toFixed(3)} mg</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Acceptance Criteria</h3>
              <div className="space-y-2 text-sm">
                <div>• Accuracy: ±0.1mg for Class I balances</div>
                <div>• Repeatability SD: &lt;0.1mg</div>
                <div>• Linearity R²: &gt;0.9999</div>
                <div>• Temperature: 20°C ±2°C</div>
                <div>• Humidity: 45-75%</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleAIValidation}
              disabled={aiValidating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {aiValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Run AI Validation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Results & Completion */}
      {step === 5 && aiResults && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Validation Results</h2>
          
          <div className={`p-4 rounded-lg ${
            aiResults.status === 'PASS' ? 'bg-green-50' : 
            aiResults.status === 'FAIL' ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {aiResults.status === 'PASS' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : aiResults.status === 'FAIL' ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <h3 className={`font-medium ${
                aiResults.status === 'PASS' ? 'text-green-900' : 
                aiResults.status === 'FAIL' ? 'text-red-900' : 'text-yellow-900'
              }`}>
                Status: {aiResults.status}
              </h3>
            </div>
            <p className={`text-sm ${
              aiResults.status === 'PASS' ? 'text-green-800' : 
              aiResults.status === 'FAIL' ? 'text-red-800' : 'text-yellow-800'
            }`}>
              Compliance Score: {aiResults.complianceScore}%
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Performance Summary</h3>
              <p className="text-sm text-gray-600">{aiResults.performanceSummary}</p>
            </div>
            
            {aiResults.recommendations.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {aiResults.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <div className="flex space-x-2">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              <button
                onClick={handleCompleteCalibration}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Calibration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 