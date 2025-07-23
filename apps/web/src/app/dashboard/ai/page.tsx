'use client'

import { useSession } from 'next-auth/react'
import { BiomniAssistant } from '@/components/ai/BiomniAssistant'
import { DataAnalysisComponent } from '@/components/ai/DataAnalysisComponent'
import { EquipmentOptimizationComponent } from '@/components/ai/EquipmentOptimizationComponent'
import { InteractiveVisualAnalysis } from '@/components/ai/InteractiveVisualAnalysis'
import { ProtocolGenerationComponent } from '@/components/ai/ProtocolGenerationComponent'
import { ProtocolWizard } from '@/components/ai/ProtocolWizard'
import { VisualAnalysisComponent } from '@/components/ai/VisualAnalysisComponent'
import { ResearchAssistant } from '@/components/ai/ResearchAssistant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  BarChart3, 
  Settings, 
  FlaskConical, 
  Microscope, 
  TestTube, 
  Dna,
  Sparkles,
  Lightbulb,
  Zap,
  TrendingUp,
  Target,
  Shield,
  Activity
} from 'lucide-react'

export default function AIPage() {
  const session = useSession()
  const { data: sessionData } = session || { data: null }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AI features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">AI Laboratory Assistant</h1>
          <p className="text-gray-400 mt-2">Advanced AI-powered tools for laboratory optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <Badge variant="outline" className="border-teal-500/30 text-teal-400">
            <Activity className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* AI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">AI Status</p>
                <p className="text-lg font-semibold text-white">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Analyses</p>
                <p className="text-lg font-semibold text-white">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-lg font-semibold text-white">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Optimizations</p>
                <p className="text-lg font-semibold text-white">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Tools */}
      <Tabs defaultValue="assistant" className="space-y-4">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="assistant" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Data Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Equipment Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center space-x-2">
            <Microscope className="w-4 h-4" />
            <span>Visual Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center space-x-2">
            <TestTube className="w-4 h-4" />
            <span>Protocols</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center space-x-2">
            <Dna className="w-4 h-4" />
            <span>Research</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-4">
          <BiomniAssistant />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <DataAnalysisComponent />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <EquipmentOptimizationComponent />
        </TabsContent>

        <TabsContent value="visual" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisualAnalysisComponent />
            <InteractiveVisualAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProtocolGenerationComponent />
            <ProtocolWizard />
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <ResearchAssistant />
        </TabsContent>
      </Tabs>

      {/* AI Insights Panel */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>AI Insights & Recommendations</span>
          </CardTitle>
          <CardDescription>
            Real-time AI-powered insights for laboratory optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-400">Recent Optimizations</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Calibration schedule optimized for 15% efficiency gain</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Equipment utilization improved by 23%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Protocol automation reduced manual errors by 40%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-400">Predictive Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Microscope calibration due in 3 days</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Temperature sensor showing drift patterns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Critical equipment maintenance overdue</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              View All Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 