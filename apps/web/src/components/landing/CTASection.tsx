'use client'

import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  Star,
  Shield,
  Brain,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CTASection() {
  const features = [
    '14-day free trial',
    'No credit card required',
    'Full platform access',
    'AI-powered compliance',
    'Stanford Biomni integration',
    '24/7 customer support'
  ]

  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Start Saving Time Today',
      description: 'Begin automating compliance tasks immediately'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Prevent Costly Failures',
      description: 'AI catches issues before they become expensive'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Audit-Ready Always',
      description: 'Generate compliance reports instantly'
    }
  ]

  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Glassmorphic Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-white/80 backdrop-blur-sm text-gray-900 border-gray-200/30 mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Limited Time Offer
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Ready to Transform Your <br />
            <span className="text-blue-600">Laboratory Operations?</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join 500+ laboratories already saving time and preventing costly failures. 
            Start your free trial today and experience the future of laboratory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Main CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200/30 shadow-lg/30">
              <div className="mb-6">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700 text-sm">4.9/5 from 500+ reviews</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Your Free Trial
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Get full access to LabGuard Pro for 14 days. No credit card required.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto bg-gray-900 text-white hover:bg-gray-800 font-semibold text-lg px-8 py-4 shadow-lg/30 backdrop-blur-sm border border-gray-200/20"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-gray-500 text-sm">
                  ✓ No setup fees • ✓ Cancel anytime • ✓ Full support included
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/30 shadow-lg/30">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white shadow-lg/30 border border-white/20">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/30 shadow-lg/30">
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600 text-sm">Laboratories</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/30 shadow-lg/30">
            <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
            <div className="text-gray-600 text-sm">Compliance Rate</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/30 shadow-lg/30">
            <div className="text-3xl font-bold text-gray-900 mb-2">$2.5M</div>
            <div className="text-gray-600 text-sm">Total Savings</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200/30 shadow-lg/30">
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Support</div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">Trusted by leading laboratories worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-gray-700 text-sm font-medium">CAP Certified</div>
            <div className="text-gray-700 text-sm font-medium">CLIA Compliant</div>
            <div className="text-gray-700 text-sm font-medium">HIPAA Secure</div>
            <div className="text-gray-700 text-sm font-medium">SOC 2 Type II</div>
          </div>
        </div>
      </div>
    </section>
  )
} 