'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Beaker, 
  Search, 
  Eye, 
  Settings, 
  TrendingUp, 
  BookOpen, 
  Cpu,
  Database,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { BiomniInsights } from '@/components/dashboard/BiomniInsights'
import { ProtocolGenerationComponent } from '@/components/ai/ProtocolGenerationComponent'
import { ResearchAssistant } from '@/components/ai/ResearchAssistant'
import { VisualAnalysisComponent } from '@/components/ai/VisualAnalysisComponent'
import { EquipmentOptimizationComponent } from '@/components/ai/EquipmentOptimizationComponent'
import { DataAnalysisComponent } from '@/components/ai/DataAnalysisComponent'

interface BiomniCapabilities {
  tools: string[]
  databases: string[]
  totalTools: number
  totalDatabases: number
  categories: string[]
  features: string[]
}

export default function BiomniDashboard() {
  const [capabilities, setCapabilities] = useState<BiomniCapabilities | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCapabilities()
  }, [])

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/biomni')
      if (response.ok) {
        const data = await response.json()
        setCapabilities(data.capabilities)
      } else {
        // Mock capabilities for demo
        setCapabilities({
          tools: [
            'protocol_generator',
            'research_assistant',
            'data_analyzer',
            'equipment_optimizer',
            'safety_checker',
            'compliance_validator',
            'visual_analyzer',
            'culture_growth_analyzer',
            'contamination_detector',
            'microscopy_interpreter'
          ],
          databases: [
            'pubmed',
            'genbank',
            'pdb',
            'chembl',
            'drugbank',
            'clinicaltrials',
            'equipment_catalog',
            'safety_database',
            'compliance_regulations'
          ],
          totalTools: 20,
          totalDatabases: 15,
          categories: [
            'PROTOCOL_GENERATION',
            'RESEARCH_ASSISTANT',
            'DATA_ANALYSIS',
            'EQUIPMENT_OPTIMIZATION',
            'VISUAL_ANALYSIS',
            'COMPLIANCE_VALIDATION'
          ],
          features: [
            'AI-powered protocol generation',
            'Visual sample analysis',
            'Equipment optimization',
            'Compliance validation',
            'Research project planning',
            'Data analysis and interpretation'
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch capabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PROTOCOL_GENERATION':
        return <Beaker className="w-4 h-4" />
      case 'RESEARCH_ASSISTANT':
        return <Search className="w-4 h-4" />
      case 'DATA_ANALYSIS':
        return <Cpu className="w-4 h-4" />
      case 'EQUIPMENT_OPTIMIZATION':
        return <Settings className="w-4 h-4" />
      case 'VISUAL_ANALYSIS':
        return <Eye className="w-4 h-4" />
      case 'COMPLIANCE_VALIDATION':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>Biomni AI Laboratory Assistant</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Powered by Stanford's Biomni - Advanced biomedical research and laboratory automation
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {capabilities?.totalTools || 20} Tools • {capabilities?.totalDatabases || 15} Databases
        </Badge>
      </div>

      {/* Capabilities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Biomni Capabilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{capabilities?.totalTools || 20}</div>
              <div className="text-sm text-gray-600">AI Tools</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{capabilities?.totalDatabases || 15}</div>
              <div className="text-sm text-gray-600">Databases</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{capabilities?.categories?.length || 6}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">150+</div>
              <div className="text-sm text-gray-600">Biomedical Tools</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center space-x-2">
            <Beaker className="w-4 h-4" />
            <span className="hidden md:inline">Protocols</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Research</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Visual</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span className="hidden md:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <BiomniInsights />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('protocols')}
                >
                  <Beaker className="w-4 h-4 mr-2" />
                  Generate New Protocol
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('research')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Research Assistant
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('visual')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze Sample Image
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('equipment')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Optimize Equipment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Available Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {capabilities?.categories?.map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {getCategoryIcon(category)}
                    <div>
                      <div className="font-medium text-sm">
                        {category.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        AI-powered {category.toLowerCase().replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Protocols Tab */}
        <TabsContent value="protocols">
          <ProtocolGenerationComponent />
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research">
          <ResearchAssistant />
        </TabsContent>

        {/* Visual Analysis Tab */}
        <TabsContent value="visual">
          <VisualAnalysisComponent />
        </TabsContent>

        {/* Equipment Optimization Tab */}
        <TabsContent value="equipment">
          <EquipmentOptimizationComponent />
        </TabsContent>

        {/* Data Analysis Tab */}
        <TabsContent value="data">
          <DataAnalysisComponent />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Powered by Stanford Biomni</span>
            </div>
            <p className="text-sm text-gray-600">
              Advanced biomedical research tools and laboratory automation platform
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>150+ Biomedical Tools</span>
              <span>•</span>
              <span>59 Scientific Databases</span>
              <span>•</span>
              <span>105 Software Packages</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 