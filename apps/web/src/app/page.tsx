'use client'

import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { ROICalculatorSection } from '@/components/landing/ROICalculatorSection'
import { TrustSignalsSection } from '@/components/landing/TrustSignalsSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <BenefitsSection />
      <ROICalculatorSection />
      <TrustSignalsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
} 