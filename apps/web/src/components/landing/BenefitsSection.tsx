import { Clock, DollarSign, Shield, TrendingUp, Users, Zap, BarChart3, Database, Upload, Key, Server } from 'lucide-react'

export function BenefitsSection() {
  const benefits = [
    {
      icon: BarChart3,
      title: 'Enterprise Analytics',
      description: 'Business intelligence with predictive insights, revenue tracking, and comprehensive performance metrics.',
      metric: 'Real-time business intelligence'
    },
    {
      icon: Upload,
      title: 'Bulk Operations',
      description: 'File-based batch processing for equipment, calibrations, and data with predefined templates.',
      metric: 'Process 1000+ records in minutes'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Import/export center supporting CSV, Excel, JSON formats with comprehensive data validation.',
      metric: 'Multiple format support'
    },
    {
      icon: Server,
      title: 'LIMS Integration',
      description: 'Connect to Laboratory Information Management Systems with real-time data synchronization.',
      metric: 'Seamless system integration'
    },
    {
      icon: Key,
      title: 'API Management',
      description: 'RESTful API with key management, usage monitoring, and comprehensive documentation.',
      metric: 'Full API access & control'
    },
    {
      icon: Zap,
      title: 'Workflow Automation',
      description: 'Custom workflow creation and management with trigger-based automation and monitoring.',
      metric: 'Automated compliance workflows'
    },
    {
      icon: Shield,
      title: 'System Administration',
      description: 'Complete system management, user administration, security monitoring, and backup management.',
      metric: 'Enterprise-grade security'
    },
    {
      icon: Clock,
      title: 'AI-Powered Calibrations',
      description: 'Smart scheduling with AI validation, automated reminders, and comprehensive compliance tracking.',
      metric: '99.9% compliance rate'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based access control, team management, and seamless collaboration across your laboratory.',
      metric: 'Multi-user platform'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Complete <span className="text-blue-600">Platform</span> for Modern Laboratories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic equipment tracking to advanced enterprise analytics, LabGuard Pro provides everything you need for modern laboratory operations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {benefit.description}
              </p>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-900">
                  {benefit.metric}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Advanced Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Platform Complete</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Phase 3</div>
              <div className="text-blue-100">Enterprise Ready</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Demo Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 