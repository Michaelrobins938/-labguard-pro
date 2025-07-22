'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  Calendar, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Database,
  RefreshCw
} from 'lucide-react'

interface BulkOperation {
  id: string
  type: 'equipment' | 'calibration' | 'user' | 'notification' | 'report' | 'maintenance'
  operation: 'create' | 'update' | 'delete' | 'schedule' | 'export' | 'import'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  itemsCount: number
  processedCount: number
  createdAt: string
  completedAt?: string
  description: string
  errors?: string[]
}

interface BulkOperationTemplate {
  id: string
  name: string
  description: string
  type: 'equipment' | 'calibration' | 'user' | 'notification' | 'report' | 'maintenance'
  operation: 'create' | 'update' | 'delete' | 'schedule' | 'export' | 'import'
  icon: React.ReactNode
  color: string
}

const BULK_OPERATION_TEMPLATES: BulkOperationTemplate[] = [
  {
    id: 'bulk-equipment-create',
    name: 'Bulk Equipment Creation',
    description: 'Create multiple equipment items from CSV/Excel file',
    type: 'equipment',
    operation: 'create',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    id: 'bulk-calibration-schedule',
    name: 'Bulk Calibration Scheduling',
    description: 'Schedule calibrations for multiple equipment items',
    type: 'calibration',
    operation: 'schedule',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    id: 'bulk-user-management',
    name: 'Bulk User Management',
    description: 'Create, update, or deactivate multiple users',
    type: 'user',
    operation: 'create',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500'
  },
  {
    id: 'bulk-notification-send',
    name: 'Bulk Notification Sending',
    description: 'Send notifications to multiple users or teams',
    type: 'notification',
    operation: 'create',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'bg-orange-500'
  },
  {
    id: 'bulk-report-generation',
    name: 'Bulk Report Generation',
    description: 'Generate multiple reports for different equipment or time periods',
    type: 'report',
    operation: 'create',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-indigo-500'
  },
  {
    id: 'bulk-maintenance-schedule',
    name: 'Bulk Maintenance Scheduling',
    description: 'Schedule maintenance for multiple equipment items',
    type: 'maintenance',
    operation: 'schedule',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-red-500'
  }
]

export default function BulkOperationsPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [operationConfig, setOperationConfig] = useState<any>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [recentOperations, setRecentOperations] = useState<BulkOperation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentOperations()
  }, [])

  const fetchRecentOperations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/bulk-operations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (!response.ok) { throw new Error('Failed to fetch bulk operations') }
      const data = await response.json()
      setRecentOperations(data.data || [])
    } catch (err) {
      console.error('Error fetching bulk operations:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch bulk operations')
      // Fallback to mock data
      setRecentOperations([
        {
          id: '1',
          type: 'equipment',
          operation: 'create',
          status: 'completed',
          itemsCount: 25,
          processedCount: 25,
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:35:00Z',
          description: 'Bulk equipment creation from CSV file'
        },
        {
          id: '2',
          type: 'calibration',
          operation: 'schedule',
          status: 'processing',
          itemsCount: 15,
          processedCount: 8,
          createdAt: '2024-01-15T09:15:00Z',
          description: 'Bulk calibration scheduling for Q1 2024'
        },
        {
          id: '3',
          type: 'user',
          operation: 'create',
          status: 'failed',
          itemsCount: 10,
          processedCount: 3,
          createdAt: '2024-01-14T16:45:00Z',
          description: 'Bulk user creation from HR system',
          errors: ['Invalid email format for user@example', 'Duplicate user ID: 12345']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setUploadedFile(null)
    setOperationConfig({})
  }

  const handleStartOperation = async () => {
    if (!selectedTemplate || !uploadedFile) {
      alert('Please select a template and upload a file')
      return
    }

    try {
      setIsProcessing(true)
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('templateId', selectedTemplate)
      formData.append('config', JSON.stringify(operationConfig))

      const response = await fetch('/api/bulk-operations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      if (!response.ok) { throw new Error('Failed to start bulk operation') }
      
      const result = await response.json()
      alert('Bulk operation started successfully!')
      
      // Reset form
      setSelectedTemplate(null)
      setUploadedFile(null)
      setOperationConfig({})
      
      // Refresh recent operations
      fetchRecentOperations()
    } catch (err) {
      console.error('Error starting bulk operation:', err)
      alert('Failed to start bulk operation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Operations</h1>
          <p className="text-gray-600">Perform batch operations on equipment, calibrations, users, and more</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operation Templates */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Operation Templates</h2>
              <p className="text-gray-600 mt-1">Select a template to start a bulk operation</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {BULK_OPERATION_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${template.color} text-white`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTemplate && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File (CSV/Excel)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          CSV, XLSX, or XLS files up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleStartOperation}
                    disabled={!uploadedFile || isProcessing}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Start Bulk Operation'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Operations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Operations</h2>
              <p className="text-gray-600 mt-1">Track the status of your bulk operations</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOperations.map((operation) => (
                  <div key={operation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(operation.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                          {operation.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(operation.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {operation.description}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {operation.processedCount} of {operation.itemsCount} items processed
                      </span>
                      <span className="capitalize">
                        {operation.type} • {operation.operation}
                      </span>
                    </div>

                    {operation.errors && operation.errors.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <p className="font-medium mb-1">Errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {operation.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {recentOperations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No bulk operations yet</p>
                    <p className="text-sm">Start your first bulk operation using the templates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Operations Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Supported File Formats</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSV files with headers</li>
                  <li>• Excel files (.xlsx, .xls)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Maximum 10,000 rows per operation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Operation Types</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Equipment creation and updates</li>
                  <li>• Calibration scheduling</li>
                  <li>• User management</li>
                  <li>• Notification sending</li>
                  <li>• Report generation</li>
                  <li>• Maintenance scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 