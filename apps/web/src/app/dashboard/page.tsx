'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuickAccessWidget } from '@/components/dashboard/QuickAccessWidget'
import { 
  TestTube, 
  Thermometer, 
  Shield, 
  Bot, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FlaskConical
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Chen</h1>
          <p className="text-gray-600 mt-2">
            Your laboratory compliance dashboard is ready. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Quick Access Widget */}
      <QuickAccessWidget />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">PCR Machine #1</p>
                      <p className="text-sm text-gray-600">Operational</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Centrifuge #2</p>
                      <p className="text-sm text-gray-600">Calibration Due</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Microscope #3</p>
                      <p className="text-sm text-gray-600">Operational</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Incubator #1</p>
                      <p className="text-sm text-gray-600">Operational</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">PCR run completed</p>
                    <p className="text-sm text-gray-600">COVID-19 RT-PCR - 24 samples processed</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Thermometer className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Media validation</p>
                    <p className="text-sm text-gray-600">156 media lots checked for expiration</p>
                  </div>
                  <span className="text-sm text-gray-500">4 hours ago</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">AI Assistant used</p>
                    <p className="text-sm text-gray-600">Protocol validation assistance provided</p>
                  </div>
                  <span className="text-sm text-gray-500">6 hours ago</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Safety incident reported</p>
                    <p className="text-sm text-gray-600">Minor chemical spill - properly contained</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CAP Accreditation</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CLIA Certification</span>
                <Badge className="bg-green-100 text-green-700">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Safety Protocols</span>
                <Badge className="bg-green-100 text-green-700">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quality Control</span>
                <Badge className="bg-yellow-100 text-yellow-700">Review Due</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">SC</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dr. Sarah Chen</p>
                  <p className="text-xs text-gray-600">PCR verification completed</p>
                </div>
                <span className="text-xs text-gray-500">2h</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">MJ</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mike Johnson</p>
                  <p className="text-xs text-gray-600">Media validation in progress</p>
                </div>
                <span className="text-xs text-gray-500">4h</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">AL</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dr. Alex Lee</p>
                  <p className="text-xs text-gray-600">Safety incident report filed</p>
                </div>
                <span className="text-xs text-gray-500">1d</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/compliance?tool=pcr">
                <Button variant="outline" className="w-full justify-start">
                  <TestTube className="h-4 w-4 mr-2" />
                  PCR Verification
                </Button>
              </Link>
              
              <Link href="/dashboard/compliance?tool=media">
                <Button variant="outline" className="w-full justify-start">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Media Validation
                </Button>
              </Link>
              
              <Link href="/dashboard/ai-assistant-demo">
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>
              
              <Link href="/dashboard/compliance?tool=incident">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Incidents
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 