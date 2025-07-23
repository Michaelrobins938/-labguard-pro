'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, AlertCircle, Lightbulb, RefreshCw, ArrowRight } from 'lucide-react'

interface BiomniInsight {
  id: string
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert'
  title: string
  description: string
  confidence: number
  equipmentId?: string
  equipmentName?: string
  createdAt: string
  impact: 'high' | 'medium' | 'low'
  category: 'equipment' | 'protocol' | 'compliance' | 'research'
}

export function BiomniInsights() {
  const [insights, setInsights] = useState<BiomniInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setRefreshing(true)
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/biomni/insights')
      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights || generateMockInsights())
      } else {
        setInsights(generateMockInsights())
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights(generateMockInsights())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const generateMockInsights = (): BiomniInsight[] => [
    {
      id: '1',
      type: 'optimization',
      title: 'Equipment Efficiency Optimization',
      description: 'Centrifuge #2 shows 15% improved efficiency after recent calibration. Consider applying similar settings to other centrifuges.',
      confidence: 0.92,
      equipmentId: 'eq-001',
      equipmentName: 'Centrifuge #2',
      createdAt: new Date().toISOString(),
      impact: 'high',
      category: 'equipment'
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Maintenance Prediction',
      description: 'Spectrophotometer #1 requires preventive maintenance within 7 days based on usage patterns and performance metrics.',
      confidence: 0.87,
      equipmentId: 'eq-002',
      equipmentName: 'Spectrophotometer #1',
      createdAt: new Date().toISOString(),
      impact: 'medium',
      category: 'equipment'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Protocol Automation',
      description: 'PCR protocol can be automated using Biomni tools, reducing manual errors by 40% and improving reproducibility.',
      confidence: 0.95,
      createdAt: new Date().toISOString(),
      impact: 'high',
      category: 'protocol'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Compliance Risk',
      description: 'Temperature sensor #3 showing drift patterns that may affect compliance. Immediate calibration recommended.',
      confidence: 0.78,
      equipmentId: 'eq-003',
      equipmentName: 'Temperature Sensor #3',
      createdAt: new Date().toISOString(),
      impact: 'high',
      category: 'compliance'
    },
    {
      id: '5',
      type: 'recommendation',
      title: 'Research Optimization',
      description: 'Cell culture analysis suggests optimal growth conditions. Consider adjusting media composition for 25% faster growth.',
      confidence: 0.89,
      createdAt: new Date().toISOString(),
      impact: 'medium',
      category: 'research'
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'prediction':
        return <Brain className="w-4 h-4 text-purple-500" />
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Brain className="w-4 h-4 text-gray-500" />
    }
  }

  const getInsightBadge = (type: string) => {
    const badgeStyles = {
      optimization: 'bg-blue-100 text-blue-800 border-blue-200',
      prediction: 'bg-purple-100 text-purple-800 border-purple-200',
      recommendation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      alert: 'bg-red-100 text-red-800 border-red-200'
    }
    
    return (
      <Badge variant="outline" className={badgeStyles[type] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border-0 h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-teal-400" />
            <span>Biomni AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-teal-400" />
            <span>Biomni AI Insights</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchInsights}
            disabled={refreshing}
            className="bg-white/5 border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          AI-powered insights and recommendations for your laboratory
        </p>
      </CardHeader>
      
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No insights available yet</p>
            <p className="text-sm text-gray-400">
              Generate protocols or run equipment analysis to get AI insights
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight) => (
              <div 
                key={insight.id} 
                className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-sm text-white">{insight.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getInsightBadge(insight.type)}
                    <div className="text-xs text-gray-400">
                      {Math.round(insight.confidence * 100)}%
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-2 leading-relaxed">{insight.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {insight.equipmentName && (
                      <span className="text-xs text-blue-400">
                        Equipment: {insight.equipmentName}
                      </span>
                    )}
                    <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            
            {insights.length > 5 && (
              <Button 
                variant="link" 
                className="w-full text-sm text-teal-400 hover:text-teal-300"
              >
                View all {insights.length} insights 
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 