import { Clock, DollarSign, Shield, TrendingUp, Users, Zap } from 'lucide-react'

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: 'Save 10+ Hours Weekly',
      description: 'Automate manual compliance tasks and free up technicians for actual testing work.',
      metric: '15 hours saved per week on average'
    },
    {
      icon: DollarSign,
      title: 'Prevent $50K+ in Failures',
      description: 'AI-powered early detection prevents equipment failures and costly re-work.',
      metric: '$50K average annual savings'
    },
    {
      icon: Shield,
      title: '99.9% Compliance Rate',
      description: 'Never fail a CAP audit again with automated compliance checking.',
      metric: '99.9% compliance rate achieved'
    },
    {
      icon: TrendingUp,
      title: '40% Efficiency Boost',
      description: 'Streamlined workflows and automated processes improve overall lab efficiency.',
      metric: '40% improvement in lab efficiency'
    },
    {
      icon: Users,
      title: 'Reduce Technician Stress',
      description: 'Eliminate compliance anxiety and focus on meaningful scientific work.',
      metric: '85% reduction in compliance stress'
    },
    {
      icon: Zap,
      title: 'Instant CAP Reports',
      description: 'Generate audit-ready documentation with one click, anytime.',
      metric: 'Reports generated in under 30 seconds'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Proven <span className="text-blue-600">Results</span> for Laboratories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of laboratories already experiencing dramatic improvements in compliance, efficiency, and cost savings.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
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
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Laboratories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$2.5M</div>
              <div className="text-blue-100">Total Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Compliance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Equipment Monitored</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 