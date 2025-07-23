'use client'

import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { BiomniShowcase } from '@/components/landing/BiomniShowcase'
import { BiomniContributors } from '@/components/home/BiomniContributors'
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
import { BiomniAssistant } from '@/components/ai/BiomniAssistant'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <BiomniShowcase />
      <BiomniContributors />
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
      <BiomniAssistant />
    </div>
  )
} 