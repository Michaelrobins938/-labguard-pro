import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources - LabGuard Pro',
  description: 'Documentation, API reference, and support resources for LabGuard Pro.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Resources</h1>
          <p className="text-xl text-gray-300">
            Everything you need to get the most out of LabGuard Pro
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Documentation */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Documentation</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive guides and tutorials to help you set up and use LabGuard Pro effectively.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Getting Started Guide</li>
              <li>✓ User Manual</li>
              <li>✓ Best Practices</li>
              <li>✓ Troubleshooting</li>
            </ul>
            <button className="enhanced-button-primary w-full">View Docs</button>
          </div>

          {/* API Reference */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">API Reference</h3>
            <p className="text-gray-300 mb-6">
              Complete API documentation for integrating LabGuard Pro with your existing systems.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ REST API</li>
              <li>✓ Webhooks</li>
              <li>✓ SDK Libraries</li>
              <li>✓ Code Examples</li>
            </ul>
            <button className="enhanced-button-primary w-full">View API</button>
          </div>

          {/* Support Center */}
          <div className="enhanced-card">
            <h3 className="text-2xl font-bold text-white mb-4">Support Center</h3>
            <p className="text-gray-300 mb-6">
              Get help when you need it with our comprehensive support resources and team.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Knowledge Base</li>
              <li>✓ Video Tutorials</li>
              <li>✓ Live Chat</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="enhanced-button-primary w-full">Get Support</button>
          </div>
        </div>
      </div>
    </div>
  )
} 