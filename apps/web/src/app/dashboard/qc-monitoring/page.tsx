import QCMonitoringSystem from '@/components/qc/QCMonitoringSystem'
import VectorControlWorkflow from '@/components/workflows/VectorControlWorkflow'
import QCFailurePreventionDemo from '@/components/demos/QCFailurePreventionDemo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function QCMonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">QC Monitoring & Crisis Management</h1>
          <p className="text-gray-300 mt-2">
            Real-time quality control monitoring, automated response, and crisis prevention
          </p>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-medium">System Active</span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
            QC Monitoring
          </TabsTrigger>
          <TabsTrigger value="vector-control" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
            Vector Control
          </TabsTrigger>
          <TabsTrigger value="demo" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="case-study" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
            Case Study
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <QCMonitoringSystem />
        </TabsContent>

        <TabsContent value="vector-control" className="space-y-6">
          <VectorControlWorkflow />
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <QCFailurePreventionDemo />
        </TabsContent>

        <TabsContent value="case-study" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Real-World Case Study</h2>
                <p className="text-gray-300">Vector Control QC Failure Crisis Resolution</p>
              </div>
              <div className="flex items-center space-x-2 text-orange-400">
                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
                <span className="text-sm font-medium">Critical Incident</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* The Problem */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">The Problem</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <h4 className="font-medium text-white mb-2">QC Failure Discovery</h4>
                    <p className="text-sm text-gray-300">
                      Medical Laboratory Scientist discovers positive QC control failed at 2:30 PM
                    </p>
                    <div className="mt-2 text-xs text-red-400">
                      Impact: Entire test batch invalidated, full retest required
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <h4 className="font-medium text-white mb-2">Manual Crisis Management</h4>
                    <p className="text-sm text-gray-300">
                      Manual processes initiated: calls, emails, rescheduling, documentation
                    </p>
                    <div className="mt-2 text-xs text-red-400">
                      Time Lost: 2 hours 35 minutes of manual work
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <h4 className="font-medium text-white mb-2">Communication Overhead</h4>
                    <p className="text-sm text-gray-300">
                      Multiple manual communications: phone calls, emails, internal notifications
                    </p>
                    <div className="mt-2 text-xs text-red-400">
                      Stakeholders: Vector Control, Health Department, Lab Manager
                    </div>
                  </div>
                </div>
              </div>

              {/* The Solution */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">LabGuard Pro Solution</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h4 className="font-medium text-white mb-2">Instant Detection</h4>
                    <p className="text-sm text-gray-300">
                      QC failure detected automatically in 30 seconds
                    </p>
                    <div className="mt-2 text-xs text-green-400">
                      Time Saved: 29.5 minutes
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h4 className="font-medium text-white mb-2">Automated Response</h4>
                    <p className="text-sm text-gray-300">
                      Automated retest scheduling, stakeholder notifications, compliance documentation
                    </p>
                    <div className="mt-2 text-xs text-green-400">
                      Time Saved: 2 hours 30 minutes total
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h4 className="font-medium text-white mb-2">Proactive Communication</h4>
                    <p className="text-sm text-gray-300">
                      All stakeholders notified automatically within 2 minutes
                    </p>
                    <div className="mt-2 text-xs text-green-400">
                      Result: No manual phone calls needed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="mt-8 p-6 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Impact Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">96.8%</div>
                  <div className="text-sm text-gray-300">Reduction in Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">2.5 hrs</div>
                  <div className="text-sm text-gray-300">Time Saved per Incident</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">$150</div>
                  <div className="text-sm text-gray-300">Cost Savings per Incident</div>
                </div>
              </div>
            </div>

            {/* Key Learnings */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Learnings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-medium text-white mb-2">Prevention is Key</h4>
                  <p className="text-sm text-gray-300">
                    AI-powered QC monitoring can prevent failures before they occur, 
                    saving even more time and resources.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-medium text-white mb-2">Automation Matters</h4>
                  <p className="text-sm text-gray-300">
                    Automated workflows eliminate manual errors and ensure 
                    consistent, reliable crisis response.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-medium text-white mb-2">Communication Efficiency</h4>
                  <p className="text-sm text-gray-300">
                    Automated notifications reduce stress and ensure all 
                    stakeholders are informed promptly.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-medium text-white mb-2">Compliance Automation</h4>
                  <p className="text-sm text-gray-300">
                    Automated documentation ensures regulatory compliance 
                    without manual paperwork burden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 