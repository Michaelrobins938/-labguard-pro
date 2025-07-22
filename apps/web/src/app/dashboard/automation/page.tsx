'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Play, 
  Pause, 
  Stop, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Activity,
  BarChart3,
  FileText,
  Users,
  Calendar,
  Database,
  Bell,
  Mail,
  MessageSquare
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft' | 'error'
  trigger: string
  actions: string[]
  lastRun: string
  nextRun: string
  runCount: number
  successRate: number
  createdAt: string
  updatedAt: string
}

interface WorkflowRun {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  duration: number
  actionsExecuted: number
  actionsTotal: number
  error?: string
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  color: string
  trigger: string
  actions: string[]
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'calibration-reminder',
    name: 'Calibration Reminder',
    description: 'Automatically send reminders for upcoming calibrations',
    category: 'Calibrations',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-blue-500',
    trigger: 'Schedule (Daily)',
    actions: ['Check due calibrations', 'Send email notification', 'Update dashboard']
  },
  {
    id: 'equipment-maintenance',
    name: 'Equipment Maintenance Alert',
    description: 'Monitor equipment status and alert on maintenance needs',
    category: 'Equipment',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-green-500',
    trigger: 'Equipment status change',
    actions: ['Check maintenance schedule', 'Send SMS alert', 'Create maintenance ticket']
  },
  {
    id: 'data-backup',
    name: 'Automated Data Backup',
    description: 'Regular backup of critical data to secure storage',
    category: 'Data Management',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-purple-500',
    trigger: 'Schedule (Weekly)',
    actions: ['Export data', 'Compress files', 'Upload to cloud storage', 'Send confirmation']
  },
  {
    id: 'report-generation',
    name: 'Report Generation',
    description: 'Generate and distribute reports automatically',
    category: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-orange-500',
    trigger: 'Schedule (Monthly)',
    actions: ['Generate compliance report', 'Create PDF', 'Send to stakeholders', 'Archive report']
  },
  {
    id: 'user-notification',
    name: 'User Activity Notification',
    description: 'Notify administrators of important user activities',
    category: 'Users',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-indigo-500',
    trigger: 'User action',
    actions: ['Log activity', 'Check permissions', 'Send notification', 'Update audit trail']
  },
  {
    id: 'system-health',
    name: 'System Health Check',
    description: 'Monitor system performance and alert on issues',
    category: 'System',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-red-500',
    trigger: 'Schedule (Hourly)',
    actions: ['Check system metrics', 'Validate data integrity', 'Send alert if issues', 'Log results']
  }
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [workflowConfig, setWorkflowConfig] = useState<any>({})
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchAutomationData()
  }, [])

  const fetchAutomationData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch workflows and runs
      const [workflowsResponse, runsResponse] = await Promise.all([
        fetch('/api/automation/workflows', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/automation/runs', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      if (!workflowsResponse.ok) { throw new Error('Failed to fetch workflows') }
      if (!runsResponse.ok) { throw new Error('Failed to fetch workflow runs') }

      const workflowsData = await workflowsResponse.json()
      const runsData = await runsResponse.json()

      setWorkflows(workflowsData.data || [])
      setWorkflowRuns(runsData.data || [])
    } catch (err) {
      console.error('Error fetching automation data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch automation data')
      // Fallback to mock data
      setWorkflows([
        {
          id: '1',
          name: 'Daily Calibration Check',
          description: 'Check for equipment due for calibration and send reminders',
          status: 'active',
          trigger: 'Daily at 9:00 AM',
          actions: ['Check due calibrations', 'Send email notifications', 'Update dashboard'],
          lastRun: '2024-01-15T09:00:00Z',
          nextRun: '2024-01-16T09:00:00Z',
          runCount: 15,
          successRate: 100,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z'
        },
        {
          id: '2',
          name: 'Weekly Data Backup',
          description: 'Automated backup of all critical data',
          status: 'active',
          trigger: 'Weekly on Sunday at 2:00 AM',
          actions: ['Export data', 'Compress files', 'Upload to cloud', 'Send confirmation'],
          lastRun: '2024-01-14T02:00:00Z',
          nextRun: '2024-01-21T02:00:00Z',
          runCount: 3,
          successRate: 100,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-14T02:00:00Z'
        },
        {
          id: '3',
          name: 'Equipment Maintenance Alert',
          description: 'Alert when equipment needs maintenance',
          status: 'inactive',
          trigger: 'Equipment status change',
          actions: ['Check maintenance schedule', 'Send SMS alert', 'Create ticket'],
          lastRun: '2024-01-10T14:30:00Z',
          nextRun: 'Never',
          runCount: 8,
          successRate: 87.5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T14:30:00Z'
        }
      ])
      setWorkflowRuns([
        {
          id: '1',
          workflowId: '1',
          status: 'completed',
          startedAt: '2024-01-15T09:00:00Z',
          completedAt: '2024-01-15T09:02:30Z',
          duration: 150,
          actionsExecuted: 3,
          actionsTotal: 3
        },
        {
          id: '2',
          workflowId: '2',
          status: 'completed',
          startedAt: '2024-01-14T02:00:00Z',
          completedAt: '2024-01-14T02:15:45Z',
          duration: 945,
          actionsExecuted: 4,
          actionsTotal: 4
        },
        {
          id: '3',
          workflowId: '3',
          status: 'failed',
          startedAt: '2024-01-10T14:30:00Z',
          completedAt: '2024-01-10T14:31:15Z',
          duration: 75,
          actionsExecuted: 1,
          actionsTotal: 3,
          error: 'SMS service unavailable'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setWorkflowConfig({
        name: template.name,
        description: template.description,
        trigger: template.trigger,
        actions: template.actions
      })
    }
  }

  const handleCreateWorkflow = async () => {
    if (!selectedTemplate || !workflowConfig.name) {
      alert('Please select a template and enter a workflow name')
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch('/api/automation/workflows', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          config: workflowConfig
        })
      })

      if (!response.ok) { throw new Error('Failed to create workflow') }
      
      const result = await response.json()
      alert('Workflow created successfully!')
      
      // Reset form
      setSelectedTemplate(null)
      setWorkflowConfig({})
      setShowCreateWorkflow(false)
      
      // Refresh data
      fetchAutomationData()
    } catch (err) {
      console.error('Error creating workflow:', err)
      alert('Failed to create workflow. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleWorkflow = async (workflowId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/automation/workflows/${workflowId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) { throw new Error('Failed to update workflow status') }
      
      alert(`Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
      fetchAutomationData()
    } catch (err) {
      console.error('Error updating workflow status:', err)
      alert('Failed to update workflow status. Please try again.')
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!response.ok) { throw new Error('Failed to delete workflow') }
      
      alert('Workflow deleted successfully!')
      fetchAutomationData()
    } catch (err) {
      console.error('Error deleting workflow:', err)
      alert('Failed to delete workflow. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'inactive':
        return <Pause className="w-5 h-5 text-gray-500" />
      case 'error':
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
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRunStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
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
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automation Workflows</h1>
          <p className="text-gray-600">Create and manage automated workflows for your laboratory</p>
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
          {/* Workflows */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Active Workflows</h2>
                  <p className="text-gray-600 mt-1">Manage your automated workflows</p>
                </div>
                <button
                  onClick={() => setShowCreateWorkflow(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(workflow.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Trigger:</span>
                        <p>{workflow.trigger}</p>
                      </div>
                      <div>
                        <span className="font-medium">Success Rate:</span>
                        <p>{workflow.successRate}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {workflow.actions.slice(0, 2).map((action) => (
                          <span key={action} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {action}
                          </span>
                        ))}
                        {workflow.actions.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{workflow.actions.length - 2} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                          className={`text-sm px-3 py-1 rounded ${
                            workflow.status === 'active' 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {workflow.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete workflow"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {workflows.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No workflows yet</p>
                    <p className="text-sm">Create your first workflow to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Workflow Runs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Runs</h2>
              <p className="text-gray-600 mt-1">Monitor workflow execution history</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {workflowRuns.map((run) => {
                  const workflow = workflows.find(w => w.id === run.workflowId)
                  return (
                    <div key={run.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRunStatusColor(run.status)}`}>
                            {run.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {workflow?.name || 'Unknown Workflow'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(run.startedAt)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Duration:</span>
                          <p>{run.duration}s</p>
                        </div>
                        <div>
                          <span className="font-medium">Actions:</span>
                          <p>{run.actionsExecuted}/{run.actionsTotal}</p>
                        </div>
                      </div>

                      {run.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                          <p className="font-medium mb-1">Error:</p>
                          <p>{run.error}</p>
                        </div>
                      )}
                    </div>
                  )
                })}

                {workflowRuns.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No workflow runs yet</p>
                    <p className="text-sm">Workflow execution history will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Templates */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Workflow Templates</h2>
            <p className="text-gray-600 mt-1">Pre-built templates to get you started</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKFLOW_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Trigger:</span> {template.trigger}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Actions:</span> {template.actions.length} steps
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Workflow Modal */}
        {showCreateWorkflow && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Workflow</h3>
                <button
                  onClick={() => setShowCreateWorkflow(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={workflowConfig.name || ''}
                    onChange={(e) => setWorkflowConfig((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter workflow name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workflowConfig.description || ''}
                    onChange={(e) => setWorkflowConfig((prev: any) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Describe what this workflow does"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger
                  </label>
                  <select
                    value={workflowConfig.trigger || ''}
                    onChange={(e) => setWorkflowConfig((prev: any) => ({ ...prev, trigger: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a trigger</option>
                    <option value="schedule">Schedule</option>
                    <option value="event">Event-based</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                {workflowConfig.trigger === 'schedule' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule
                    </label>
                    <select
                      value={workflowConfig.schedule || ''}
                      onChange={(e) => setWorkflowConfig((prev: any) => ({ ...prev, schedule: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select frequency</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowCreateWorkflow(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkflow}
                  disabled={!selectedTemplate || !workflowConfig.name || isCreating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Workflow'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 