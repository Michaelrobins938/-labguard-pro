'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PCRVerificationSystem } from '@/components/compliance/PCRVerificationSystem'
import { BiochemicalMediaValidator } from '@/components/compliance/BiochemicalMediaValidator'
import { CAPSafetyIncidentVerifier } from '@/components/compliance/CAPSafetyIncidentVerifier'
import { Shield, TestTube, Thermometer, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('pcr')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Compliance Hub</h1>
          <p className="text-gray-600 mt-2">
            AI-powered compliance validation tools for laboratory safety and accreditation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            CAP Accredited
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            CLIA Certified
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TestTube className="h-4 w-4" />
              PCR Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-xs text-gray-600">Runs validated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Thermometer className="h-4 w-4" />
              Media Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
            <p className="text-xs text-gray-600">Media lots checked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Safety Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-gray-600">Incidents this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pcr" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            PCR Verification
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Media Validation
          </TabsTrigger>
          <TabsTrigger value="incident" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Safety Incidents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pcr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                PCR Run Setup Verification
              </CardTitle>
              <p className="text-sm text-gray-600">
                Verify PCR run setup matches validated protocol before execution, preventing costly reruns and ensuring CLIA compliance
              </p>
            </CardHeader>
            <CardContent>
              <PCRVerificationSystem />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Biochemical Media Safety Inspector
              </CardTitle>
              <p className="text-sm text-gray-600">
                Prevent use of expired or compromised biochemical test media, ensuring accurate results and CAP compliance
              </p>
            </CardHeader>
            <CardContent>
              <BiochemicalMediaValidator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incident" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                CAP Safety Incident Response Validator
              </CardTitle>
              <p className="text-sm text-gray-600">
                Ensure proper CAP safety protocols were followed after laboratory incidents, maintaining accreditation compliance
              </p>
            </CardHeader>
            <CardContent>
              <CAPSafetyIncidentVerifier />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Compliance Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">PCR Run Approved</p>
                  <p className="text-sm text-green-700">COVID-19 RT-PCR run validated successfully</p>
                </div>
              </div>
              <span className="text-sm text-green-600">2 minutes ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Media Expiration Warning</p>
                  <p className="text-sm text-yellow-700">Catalase test media expires in 3 days</p>
                </div>
              </div>
              <span className="text-sm text-yellow-600">15 minutes ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Incident Report Filed</p>
                  <p className="text-sm text-blue-700">Minor chemical spill properly documented</p>
                </div>
              </div>
              <span className="text-sm text-blue-600">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 