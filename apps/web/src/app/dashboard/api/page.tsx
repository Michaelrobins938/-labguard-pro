'use client'

import { useState, useEffect } from 'react'
import { 
  Key, 
  Activity, 
  BarChart3, 
  FileText, 
  Settings, 
  RefreshCw, 
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Globe,
  Shield
} from 'lucide-react'

interface APIKey {
  id: string
  name: string
  key: string
  status: 'active' | 'inactive' | 'expired'
  permissions: string[]
  rateLimit: number
  usageCount: number
  lastUsed: string
  createdAt: string
  expiresAt?: string
}

interface APIUsage {
  id: string
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  timestamp: string
  userId: string
  ipAddress: string
  userAgent: string
}

interface APIEndpoint {
  id: string
  path: string
  method: string
  description: string
  category: string
  requiresAuth: boolean
  rateLimit: number
  status: 'stable' | 'beta' | 'deprecated'
}

const API_ENDPOINTS: APIEndpoint[] = [
  {
    id: 'equipment-get',
    path: '/api/equipment',
    method: 'GET',
    description: 'Retrieve equipment list with filtering and pagination',
    category: 'Equipment',
    requiresAuth: true,
    rateLimit: 1000,
    status: 'stable'
  },
  {
    id: 'equipment-post',
    path: '/api/equipment',
    method: 'POST',
    description: 'Create new equipment record',
    category: 'Equipment',
    requiresAuth: true,
    rateLimit: 100,
    status: 'stable'
  },
  {
    id: 'calibrations-get',
    path: '/api/calibrations',
    method: 'GET',
    description: 'Retrieve calibration records',
    category: 'Calibrations',
    requiresAuth: true,
    rateLimit: 1000,
    status: 'stable'
  },
  {
    id: 'bulk-operations-post',
    path: '/api/bulk-operations',
    method: 'POST',
    description: 'Execute bulk operations on data',
    category: 'Bulk Operations',
    requiresAuth: true,
    rateLimit: 10,
    status: 'beta'
  },
  {
    id: 'data-export-post',
    path: '/api/data-management/exports',
    method: 'POST',
    description: 'Create data export jobs',
    category: 'Data Management',
    requiresAuth: true,
    rateLimit: 50,
    status: 'stable'
  }
]

export default function APIManagementPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [usageHistory, setUsageHistory] = useState<APIUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [newKeyConfig, setNewKeyConfig] = useState<any>({})
  const [isCreating, setIsCreating] = useState(false)
  const [showKey, setShowKey] = useState<string | null>(null)

  useEffect(() => {
    fetchAPIData()
  }, [])

  const fetchAPIData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch API keys and usage history
      const [keysResponse, usageResponse] = await Promise.all([
        fetch('/api/api-management/keys', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/api-management/usage', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (!keysResponse.ok) { throw new Error('Failed to fetch API keys') }
      if (!usageResponse.ok) { throw new Error('Failed to fetch usage history') }

      const keysData = await keysResponse.json()
      const usageData = await usageResponse.json()

      setApiKeys(keysData.data || [])
      setUsageHistory(usageData.data || [])
    } catch (err) {
      console.error('Error fetching API data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch API data')
      // Fallback to mock data
      setApiKeys([
        {
          id: '1',
          name: 'Production API Key',
          key: 'sk_live_1234567890abcdef',
          status: 'active',
          permissions: ['read:equipment', 'write:equipment', 'read:calibrations'],
          rateLimit: 1000,
          usageCount: 15420,
          lastUsed: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Development API Key',
          key: 'sk_test_abcdef1234567890',
          status: 'active',
          permissions: ['read:equipment', 'read:calibrations'],
          rateLimit: 100,
          usageCount: 2340,
          lastUsed: '2024-01-14T16:45:00Z',
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'Expired Test Key',
          key: 'sk_test_expired123456',
          status: 'expired',
          permissions: ['read:equipment'],
          rateLimit: 50,
          usageCount: 120,
          lastUsed: '2024-01-05T12:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          expiresAt: '2024-01-10T00:00:00Z'
        }
      ])
      setUsageHistory([
        {
          id: '1',
          endpoint: '/api/equipment',
          method: 'GET',
          statusCode: 200,
          responseTime: 45,
          timestamp: '2024-01-15T10:30:00Z',
          userId: 'user1',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          endpoint: '/api/calibrations',
          method: 'POST',
          statusCode: 201,
          responseTime: 120,
          timestamp: '2024-01-15T10:25:00Z',
          userId: 'user1',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '3',
          endpoint: '/api/equipment',
          method: 'GET',
          statusCode: 429,
          responseTime: 5,
          timestamp: '2024-01-15T10:20:00Z',
          userId: 'user2',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAPIKey = async () => {
    if (!newKeyConfig.name) {
      alert('Please enter a name for the API key')
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch('/api/api-management/keys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newKeyConfig)
      })

      if (!response.ok) { throw new Error('Failed to create API key') }
      
      const result = await response.json()
      alert('API key created successfully!')
      
      // Reset form
      setNewKeyConfig({})
      setShowCreateKey(false)
      
      // Refresh data
      fetchAPIData()
    } catch (err) {
      console.error('Error creating API key:', err)
      alert('Failed to create API key. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevokeAPIKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-management/keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!response.ok) { throw new Error('Failed to revoke API key') }
      
      alert('API key revoked successfully!')
      fetchAPIData()
    } catch (err) {
      console.error('Error revoking API key:', err)
      alert('Failed to revoke API key. Please try again.')
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    alert('API key copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'inactive':
        return <Clock className="w-5 h-5 text-gray-500" />
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600'
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600'
    if (statusCode >= 500) return 'text-red-600'
    return 'text-gray-600'
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
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Management</h1>
          <p className="text-gray-600">Manage API keys, monitor usage, and access documentation</p>
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
          {/* API Keys */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                  <p className="text-gray-600 mt-1">Manage your API access keys</p>
                </div>
                <button
                  onClick={() => setShowCreateKey(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Key
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{key.name}</h3>
                          <p className="text-sm text-gray-600">
                            Created {formatDate(key.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(key.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                          {key.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showKey === key.id ? key.key : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {showKey === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Usage:</span>
                        <p>{key.usageCount.toLocaleString()} requests</p>
                      </div>
                      <div>
                        <span className="font-medium">Rate Limit:</span>
                        <p>{key.rateLimit}/hour</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleRevokeAPIKey(key.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Revoke key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {apiKeys.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No API keys yet</p>
                    <p className="text-sm">Create your first API key to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Usage</h2>
              <p className="text-gray-600 mt-1">Monitor API request activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {usageHistory.map((usage) => (
                  <div key={usage.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusCodeColor(usage.statusCode)}`}>
                          {usage.statusCode}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {usage.method} {usage.endpoint}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(usage.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Response Time:</span>
                        <p>{usage.responseTime}ms</p>
                      </div>
                      <div>
                        <span className="font-medium">IP Address:</span>
                        <p>{usage.ipAddress}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {usageHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No usage history yet</p>
                    <p className="text-sm">API requests will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">API Endpoints</h2>
            <p className="text-gray-600 mt-1">Available endpoints and their documentation</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.status === 'stable' ? 'bg-green-100 text-green-800' :
                        endpoint.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.status}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {endpoint.method} {endpoint.path}
                        </h3>
                        <p className="text-sm text-gray-600">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>Rate Limit: {endpoint.rateLimit}/hour</p>
                      <p>Auth: {endpoint.requiresAuth ? 'Required' : 'Optional'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {endpoint.category}
                    </span>
                    {endpoint.requiresAuth && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Authentication Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateKey && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create API Key</h3>
                <button
                  onClick={() => setShowCreateKey(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeOff className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyConfig.name || ''}
                    onChange={(e) => setNewKeyConfig((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Production API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['read:equipment', 'write:equipment', 'read:calibrations', 'write:calibrations', 'read:reports', 'write:reports'].map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newKeyConfig.permissions?.includes(permission) || false}
                          onChange={(e) => {
                            const permissions = newKeyConfig.permissions || []
                            if (e.target.checked) {
                              setNewKeyConfig((prev: any) => ({ ...prev, permissions: [...permissions, permission] }))
                            } else {
                              setNewKeyConfig((prev: any) => ({ ...prev, permissions: permissions.filter((p: string) => p !== permission) }))
                            }
                          }}
                          className="rounded border-gray-300 mr-2"
                        />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (requests per hour)
                  </label>
                  <input
                    type="number"
                    value={newKeyConfig.rateLimit || 1000}
                    onChange={(e) => setNewKeyConfig((prev: any) => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="10000"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Expires in (days)</span>
                  <input
                    type="number"
                    value={newKeyConfig.expiresIn || 365}
                    onChange={(e) => setNewKeyConfig((prev: any) => ({ ...prev, expiresIn: parseInt(e.target.value) }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="3650"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowCreateKey(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAPIKey}
                  disabled={!newKeyConfig.name || isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 