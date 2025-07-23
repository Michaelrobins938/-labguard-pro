'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { ComplianceChart } from '@/components/dashboard/ComplianceChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { EquipmentStatus } from '@/components/dashboard/EquipmentStatus'
import { AIInsights } from '@/components/dashboard/AIInsights'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Settings, Zap } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Monitor your laboratory's compliance and equipment status in real-time
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-teal-500/25">
            <Zap className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compliance Chart - Takes up 8 columns */}
        <div className="lg:col-span-8">
          <ComplianceChart />
        </div>
        
        {/* AI Insights - Takes up 4 columns */}
        <div className="lg:col-span-4">
          <AIInsights />
        </div>
        
        {/* Equipment Status - Takes up 8 columns */}
        <div className="lg:col-span-8">
          <EquipmentStatus />
        </div>
        
        {/* Activity Feed - Takes up 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </div>
  )
} 