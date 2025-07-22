'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  Brain,
  BarChart3,
  Calendar,
  User,
  Settings,
  Thermometer,
  Droplets,
  Scale
} from 'lucide-react'

interface CalibrationResult {
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
  performedDate: string
  status: string
  complianceStatus: string
  complianceScore: number
  performedBy: {
    id: string
    name: string
    email: string
  }
  template: {
    id: string
    name: string
    description: string
  }
  measurements: {
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
  environmentalConditions: {
    temperature: number
    humidity: number
    pressure?: number
    vibration?: string
  }
  aiAnalysis: {
    status: string
    complianceScore: number
    performanceSummary: string
    correctiveActions: string[]
    deviations: string[]
    recommendations: string[]
    confidence: number
  }
  certificate?: string
  nextCalibrationDate: string
}

export default function CalibrationResultsPage() {
  const router = useRouter()
  const params = useParams()
  const calibrationId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [calibrationResult, setCalibrationResult] = useState<CalibrationResult | null>(null)

  // Mock data - replace with API call
  useEffect(() => {
    const mockResult: CalibrationResult = {
      id: calibrationId,
      equipment: {
        id: 'eq1',
        name: 'Analytical Balance AB-001',
        model: 'Sartorius ME36S',
        serialNumber: 'AB-001',
        equipmentType: 'ANALYTICAL_BALANCE',
        location: 'Lab A - Room 101'
      },
      calibrationType: 'PERIODIC',
      performedDate: '2024-01-15T10:30:00Z',
      status: 'COMPLETED',
      complianceStatus: 'COMPLIANT',
      complianceScore: 95,
      performedBy: {
        id: 'user1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@lab.com'
      },
      template: {
        id: 'tpl1',
        name: 'Analytical Balance Calibration',
        description: 'Standard calibration procedure for analytical balances'
      },
      measurements: {
        linearity: {
          weights: [0, 1, 5, 10, 20, 50, 100],
          readings: [0.001, 1.002, 5.001, 10.003, 20.002, 50.001, 100.002],
          deviations: [0.001, 0.002, 0.001, 0.003, 0.002, 0.001, 0.002]
        },
        repeatability: {
          measurements: [10.001, 10.002, 10.001, 10.003, 10.002, 10.001, 10.002, 10.001, 10.003, 10.002],
          standardDeviation: 0.0008
        },
        accuracy: {
          referenceValue: 10.000,
          measuredValue: 10.002,
          deviation: 0.002
        }
      },
      environmentalConditions: {
        temperature: 22.5,
        humidity: 45.0,
        pressure: 1013.25,
        vibration: 'LOW'
      },
      aiAnalysis: {
        status: 'PASS',
        complianceScore: 95,
        performanceSummary: 'All measurements within acceptable limits. Equipment meets calibration requirements for CAP/CLIA compliance.',
        correctiveActions: [],
        deviations: [],
        recommendations: [
          'Continue with normal operation',
          'Schedule next calibration in 12 months',
          'Monitor environmental conditions regularly'
        ],
        confidence: 0.95
      },
      certificate: 'CAL-2024-001',
      nextCalibrationDate: '2025-01-15T10:30:00Z'
    }

    setCalibrationResult(mockResult)
    setLoading(false)
  }, [calibrationId])

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true)
    try {
      // Mock PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('PDF generated successfully')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setGeneratingPDF(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800'
      case 'FAIL':
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800'
      case 'CONDITIONAL':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'COMPLIANT':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'FAIL':
      case 'NON_COMPLIANT':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'CONDITIONAL':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!calibrationResult) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Calibration not found</h3>
        <p className="text-gray-600">The requested calibration could not be found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calibration Results</h1>
            <p className="text-gray-600">{calibrationResult.equipment.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate PDF</span>
              </>
            )}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipment</p>
              <p className="text-lg font-bold text-gray-900">{calibrationResult.equipment.name}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              {getStatusIcon(calibrationResult.aiAnalysis.status)}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Status</p>
              <p className="text-lg font-bold text-gray-900">{calibrationResult.aiAnalysis.status}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-lg font-bold text-gray-900">{calibrationResult.complianceScore}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Calibration</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(calibrationResult.nextCalibrationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Analysis Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Analysis Results</h2>
            </div>
            
            <div className={`p-4 rounded-lg mb-4 ${getStatusColor(calibrationResult.aiAnalysis.status)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Status: {calibrationResult.aiAnalysis.status}</h3>
                  <p className="text-sm mt-1">Confidence: {(calibrationResult.aiAnalysis.confidence * 100).toFixed(1)}%</p>
                </div>
                {getStatusIcon(calibrationResult.aiAnalysis.status)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Performance Summary</h3>
                <p className="text-sm text-gray-600">{calibrationResult.aiAnalysis.performanceSummary}</p>
              </div>
              
              {calibrationResult.aiAnalysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {calibrationResult.aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Measurement Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Measurement Data</h2>
            
            <div className="space-y-6">
              {/* Linearity */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Linearity Check</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Reference (g)</th>
                        <th className="px-3 py-2 text-left">Measured (g)</th>
                        <th className="px-3 py-2 text-left">Deviation (mg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {calibrationResult.measurements.linearity.weights.map((weight, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">{weight}</td>
                          <td className="px-3 py-2">{calibrationResult.measurements.linearity.readings[index]}</td>
                          <td className="px-3 py-2">{calibrationResult.measurements.linearity.deviations[index]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Repeatability */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Repeatability Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Standard Deviation: {calibrationResult.measurements.repeatability.standardDeviation} mg</p>
                    <p className="text-sm text-gray-600">Measurements: {calibrationResult.measurements.repeatability.measurements.join(', ')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-900">Acceptance Criteria</p>
                    <p className="text-sm text-gray-600">SD &lt; 0.1mg</p>
                  </div>
                </div>
              </div>

              {/* Accuracy */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Accuracy Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Reference Value</p>
                    <p className="font-medium">{calibrationResult.measurements.accuracy.referenceValue} g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Measured Value</p>
                    <p className="font-medium">{calibrationResult.measurements.accuracy.measuredValue} g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deviation</p>
                    <p className="font-medium">{calibrationResult.measurements.accuracy.deviation} mg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calibration Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calibration Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Certificate Number</p>
                <p className="font-medium">{calibrationResult.certificate}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Performed Date</p>
                <p className="font-medium">{new Date(calibrationResult.performedDate).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Performed By</p>
                <p className="font-medium">{calibrationResult.performedBy.name}</p>
                <p className="text-sm text-gray-500">{calibrationResult.performedBy.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Template Used</p>
                <p className="font-medium">{calibrationResult.template.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Calibration Type</p>
                <p className="font-medium">{calibrationResult.calibrationType}</p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="font-medium">{calibrationResult.environmentalConditions.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-medium">{calibrationResult.environmentalConditions.humidity}%</p>
                </div>
              </div>
              
              {calibrationResult.environmentalConditions.pressure && (
                <div className="flex items-center space-x-3">
                  <Scale className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Pressure</p>
                    <p className="font-medium">{calibrationResult.environmentalConditions.pressure} hPa</p>
                  </div>
                </div>
              )}
              
              {calibrationResult.environmentalConditions.vibration && (
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Vibration</p>
                    <p className="font-medium">{calibrationResult.environmentalConditions.vibration}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(calibrationResult.complianceStatus)}`}>
                  {calibrationResult.complianceStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Score</span>
                <span className="font-medium">{calibrationResult.complianceScore}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Calibration</span>
                <span className="font-medium">{new Date(calibrationResult.nextCalibrationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 