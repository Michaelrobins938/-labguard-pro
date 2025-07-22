'use client'

import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'
import { TrustSignalsSection } from '@/components/landing/TrustSignalsSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LabGuard Pro
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Laboratory Compliance Automation Platform
        </p>
        <p className="text-lg text-gray-500">
          AI-powered laboratory compliance management platform for equipment calibration, validation, and regulatory compliance.
        </p>
        <div className="mt-8">
          <a 
            href="/test" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Page
          </a>
        </div>
      </div>
    </div>
  )
} 