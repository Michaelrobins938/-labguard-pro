'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Brain, 
  Microscope, 
  Flask, 
  TestTube, 
  Camera, 
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Play,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BiomniCapabilities {
  tools: string[]
  databases: string[]
  totalTools: number
  totalDatabases: number
  categories: string[]
  features: string[]
}

interface BiomniQuery {
  id: string
  query: string
  toolsUsed: string[]
  databasesQueried: string[]
  status: string
  result?: any
  confidence?: number
  executionTime?: number
  cost?: number
  createdAt: string
}

export default function AIDashboardPage() {
  const { data: session } = useSession()
  const [capabilities, setCapabilities] = useState<BiomniCapabilities | null>(null)
  const [recentQueries, setRecentQueries] = useState<BiomniQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCapabilities()
    fetchRecentQueries()
  }, [])

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/biomni/capabilities', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCapabilities(data)
      }
    } catch (error) {
      console.error('Failed to fetch capabilities:', error)
    }
  }

  const fetchRecentQueries = async () => {
    try {
      const response = await fetch('/api/biomni/queries?limit=10', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRecentQueries(data)
      }
    } catch (error) {
      console.error('Failed to fetch recent queries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'EXECUTING':
        return 'bg-blue-100 text-blue-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'VISUAL_ANALYSIS':
        return <Camera className="w-4 h-4" />
      case 'PROTOCOL_GENERATION':
        return <FileText className="w-4 h-4" />
      case 'DATA_ANALYSIS':
        return <BarChart3 className="w-4 h-4" />
      case 'EQUIPMENT_OPTIMIZATION':
        return <Settings className="w-4 h-4" />
      case 'RESEARCH_ASSISTANT':
        return <Search className="w-4 h-4" />
      case 'COMPLIANCE_VALIDATION':
        return <Shield className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Laboratory Assistant</h1>
          <p className="text-gray-600 mt-2">
            Powered by Stanford Biomni - Advanced biomedical AI for your laboratory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Brain className="w-4 h-4 mr-1" />
            Biomni v2.0
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Visual Analysis</h3>
                <p className="text-sm text-gray-600">Analyze images</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Generate Protocol</h3>
                <p className="text-sm text-gray-600">Create experiments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Data Analysis</h3>
                <p className="text-sm text-gray-600">Process results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Optimize Equipment</h3>
                <p className="text-sm text-gray-600">Improve performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visual">Visual Analysis</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Capabilities Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>AI Capabilities</span>
                </CardTitle>
                <CardDescription>
                  Available tools and databases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {capabilities && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tools Available</span>
                      <Badge variant="outline">{capabilities.totalTools}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Databases</span>
                      <Badge variant="outline">{capabilities.totalDatabases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Categories</span>
                      <Badge variant="outline">{capabilities.categories.length}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest AI queries and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentQueries.slice(0, 5).map((query) => (
                    <div key={query.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(query.toolsUsed[0] || 'GENERAL')}
                        <span className="text-sm font-medium truncate max-w-32">
                          {query.query.substring(0, 30)}...
                        </span>
                      </div>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
                <CardDescription>
                  AI system metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-sm text-green-600">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-sm text-blue-600">2.3s</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cost per Query</span>
                    <span className="text-sm text-purple-600">$0.05</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>
                Explore the full range of Biomni capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {capabilities?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Analysis Tab */}
        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Visual Analysis</span>
              </CardTitle>
              <CardDescription>
                Analyze images for sample quality, equipment condition, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input id="image-url" placeholder="Enter image URL or upload file" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sample-quality">Sample Quality Assessment</SelectItem>
                      <SelectItem value="equipment-condition">Equipment Condition</SelectItem>
                      <SelectItem value="culture-growth">Culture Growth Analysis</SelectItem>
                      <SelectItem value="contamination">Contamination Detection</SelectItem>
                      <SelectItem value="microscopy">Microscopy Interpretation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Button>
                <Button className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Analyze</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Protocols Tab */}
        <TabsContent value="protocols" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Protocol Generation</span>
              </CardTitle>
              <CardDescription>
                Generate experimental protocols with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protocol-title">Protocol Title</Label>
                  <Input id="protocol-title" placeholder="Enter protocol title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protocol-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cell-culture">Cell Culture</SelectItem>
                      <SelectItem value="pcr">PCR</SelectItem>
                      <SelectItem value="sequencing">Sequencing</SelectItem>
                      <SelectItem value="microscopy">Microscopy</SelectItem>
                      <SelectItem value="flow-cytometry">Flow Cytometry</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="protocol-description">Description</Label>
                <Textarea 
                  id="protocol-description" 
                  placeholder="Describe the experimental protocol you want to generate"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Available Equipment</Label>
                <Input id="equipment" placeholder="Enter equipment (comma-separated)" />
              </div>
              <Button className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Generate Protocol</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Analysis Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Data Analysis</span>
              </CardTitle>
              <CardDescription>
                Analyze research data with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequencing">Sequencing Data</SelectItem>
                      <SelectItem value="flow-cytometry">Flow Cytometry</SelectItem>
                      <SelectItem value="microscopy">Microscopy Images</SelectItem>
                      <SelectItem value="pcr">PCR Results</SelectItem>
                      <SelectItem value="cell-culture">Cell Culture Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">Statistical Analysis</SelectItem>
                      <SelectItem value="quality-control">Quality Control</SelectItem>
                      <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                      <SelectItem value="anomaly-detection">Anomaly Detection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-input">Data Input</Label>
                <Textarea 
                  id="data-input" 
                  placeholder="Paste your data or upload a file"
                  rows={6}
                />
              </div>
              <Button className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analyze Data</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Equipment Optimization</span>
              </CardTitle>
              <CardDescription>
                Optimize equipment usage and calibration with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment-id">Equipment ID</Label>
                  <Input id="equipment-id" placeholder="Enter equipment ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optimization-type">Optimization Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select optimization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calibration">Calibration Schedule</SelectItem>
                      <SelectItem value="maintenance">Maintenance Planning</SelectItem>
                      <SelectItem value="usage">Usage Optimization</SelectItem>
                      <SelectItem value="performance">Performance Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage-data">Usage Data</Label>
                <Textarea 
                  id="usage-data" 
                  placeholder="Enter equipment usage data or upload file"
                  rows={4}
                />
              </div>
              <Button className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Optimize Equipment</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Query History</span>
              </CardTitle>
              <CardDescription>
                View all your AI queries and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQueries.map((query) => (
                  <div key={query.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(query.toolsUsed[0] || 'GENERAL')}
                        <span className="font-medium">{query.query.substring(0, 50)}...</span>
                      </div>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Tools: {query.toolsUsed.join(', ')}</span>
                      <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                    </div>
                    {query.confidence && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Confidence:</span>
                        <Progress value={query.confidence * 100} className="w-20 h-2" />
                        <span className="text-sm">{(query.confidence * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 