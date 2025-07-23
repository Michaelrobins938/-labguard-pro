'use client'

import { Sidebar } from '@/components/navigation/Sidebar'
import { Header } from '@/components/navigation/Header'
import { BiomniAssistant } from '@/components/ai-assistant/BiomniAssistant'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Sidebar />
      <div className="flex flex-col min-h-screen ml-80">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* AI Assistant - Always visible in dashboard */}
      <BiomniAssistant />
    </div>
  )
} 