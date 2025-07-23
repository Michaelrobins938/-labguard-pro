'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BiomniAssistant } from '@/components/ai/BiomniAssistant'
import { TestTube, Thermometer, Shield, CheckCircle, Bot, Zap, MessageSquare } from 'lucide-react'

export default function AIAssistantDemo() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Biomni AI Assistant Demo</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the future of laboratory compliance with our AI-powered assistant. 
          Validate PCR protocols, check media safety, and ensure CAP compliance in real-time.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            CAP Accredited
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-4 w-4 mr-1" />
            CLIA Certified
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Bot className="h-4 w-4 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistant */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                Biomni AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <BiomniAssistant />
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TestTube className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">PCR Verification</h4>
                    <p className="text-sm text-gray-600">Validate PCR run setup against protocols</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Thermometer className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Media Validation</h4>
                    <p className="text-sm text-gray-600">Check biochemical media safety</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Safety Incidents</h4>
                    <p className="text-sm text-gray-600">Verify CAP compliance protocols</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="font-medium">Try saying:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• "Open PCR verification"</li>
                  <li>• "Check media validation"</li>
                  <li>• "Show safety incidents"</li>
                  <li>• "What are the compliance requirements?"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Compliance Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Prevent costly reruns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Ensure CLIA compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Maintain CAP accreditation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Real-time validation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">1. Start a Conversation</h4>
              <p className="text-sm text-gray-600">
                Type or use voice commands to ask about laboratory compliance, protocols, or safety procedures.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">2. Access Compliance Tools</h4>
              <p className="text-sm text-gray-600">
                Switch to the "Compliance Tools" tab or ask the AI to open specific validation tools.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">3. Validate Procedures</h4>
              <p className="text-sm text-gray-600">
                Use the integrated tools to validate PCR runs, check media safety, and verify incident protocols.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 