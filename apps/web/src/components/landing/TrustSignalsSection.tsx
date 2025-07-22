'use client'

import { Shield, Lock, CheckCircle, Award } from 'lucide-react'

export function TrustSignalsSection() {
  return (
    <section className="py-16 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Enterprise Security & Compliance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            LabGuard Pro meets the highest standards for laboratory data security and regulatory compliance
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 items-center">
          {/* SOC 2 Type II */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">SOC 2</div>
              <div className="text-xs text-gray-600">Type II Certified</div>
            </div>
          </div>
          
          {/* HIPAA */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">HIPAA</div>
              <div className="text-xs text-gray-600">Compliant</div>
            </div>
          </div>
          
          {/* CAP */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">CAP</div>
              <div className="text-xs text-gray-600">Approved</div>
            </div>
          </div>
          
          {/* CLIA */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">CLIA</div>
              <div className="text-xs text-gray-600">Validated</div>
            </div>
          </div>
          
          {/* ISO 15189 */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">ISO 15189</div>
              <div className="text-xs text-gray-600">Certified</div>
            </div>
          </div>
          
          {/* GDPR */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-xl shadow-enterprise border border-gray-200 hover:shadow-enterprise-lg transition-all duration-enterprise">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900">GDPR</div>
              <div className="text-xs text-gray-600">Ready</div>
            </div>
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-blue mb-2">500+</div>
            <div className="text-gray-600">Laboratories Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-green mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-blue mb-2">24/7</div>
            <div className="text-gray-600">Enterprise Support</div>
          </div>
        </div>
      </div>
    </section>
  )
} 