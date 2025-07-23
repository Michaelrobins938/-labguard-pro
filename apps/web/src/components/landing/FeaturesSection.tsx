'use client'

import { 
  Shield, 
  Clock, 
  BarChart3, 
  Users, 
  Zap, 
  ArrowRight,
  Database,
  Upload,
  Search,
  Key,
  Server,
  Activity,
  Settings,
  CreditCard,
  FileText,
  Bell
} from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Complete Laboratory Management Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From basic equipment tracking to advanced enterprise analytics, we provide everything you need for modern laboratory compliance
          </p>
        </div>
        
        {/* Core Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Core Laboratory Management</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Equipment Management */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-blue-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete lifecycle tracking with QR codes, maintenance schedules, and detailed analytics for all laboratory equipment.
              </p>
            </div>
            
            {/* Calibration System */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-green-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/80 to-blue-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Calibrations</h3>
              <p className="text-gray-600 leading-relaxed">
                Smart scheduling with AI validation, automated reminders, and comprehensive compliance tracking.
              </p>
            </div>
            
            {/* Team Collaboration */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-purple-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/80 to-pink-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control, team management, and seamless collaboration across your laboratory.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Advanced Enterprise Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enterprise Analytics */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-red-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/80 to-orange-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Business intelligence with predictive insights, revenue tracking, and comprehensive performance metrics.
              </p>
            </div>
            
            {/* Bulk Operations */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-orange-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/80 to-yellow-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bulk Operations</h3>
              <p className="text-gray-600 leading-relaxed">
                File-based batch processing for equipment, calibrations, and data with predefined templates.
              </p>
            </div>
            
            {/* Data Management */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-teal-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500/80 to-cyan-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Import/export center supporting CSV, Excel, JSON formats with comprehensive data validation.
              </p>
            </div>
            
            {/* LIMS Integration */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-indigo-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/80 to-blue-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Server className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">LIMS Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect to Laboratory Information Management Systems with real-time data synchronization.
              </p>
            </div>
            
            {/* API Management */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-yellow-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/80 to-orange-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">API Management</h3>
              <p className="text-gray-600 leading-relaxed">
                RESTful API with key management, usage monitoring, and comprehensive documentation.
              </p>
            </div>
            
            {/* Automation */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-pink-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/80 to-rose-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Custom workflow creation and management with trigger-based automation and monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Tools</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Global Search */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-gray-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500/80 to-slate-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced search across all data types with intelligent filtering and quick access to information.
              </p>
            </div>
            
            {/* Billing & Subscriptions */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-emerald-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/80 to-green-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Billing & Subscriptions</h3>
              <p className="text-gray-600 leading-relaxed">
                Flexible billing plans, usage tracking, payment processing, and comprehensive invoicing.
              </p>
            </div>
            
            {/* System Administration */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl hover:shadow-lg/30 transition-all duration-300 border border-gray-200/30 hover:border-slate-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500/80 to-gray-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 shadow-lg/30 border border-white/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Administration</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete system management, user administration, security monitoring, and backup management.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg/30 backdrop-blur-sm border border-gray-200/20">
            Explore All Features
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
} 