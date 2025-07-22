'use client'

import { Shield, Clock, BarChart3, Users, Zap, ArrowRight } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need for lab compliance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From equipment management to AI-powered validation, we've got you covered
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Validation</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced AI algorithms validate calibration data and ensure compliance with regulatory standards.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automated Scheduling</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart scheduling system automatically tracks calibration dates and sends proactive reminders.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive dashboards provide real-time insights into compliance status and equipment performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 