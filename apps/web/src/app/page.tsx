import { Metadata } from 'next'
import { BiomniShowcase } from '@/components/landing/BiomniShowcase'
import { TrustSignalsSection } from '@/components/landing/TrustSignalsSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ROISection } from '@/components/landing/ROISection'
import { AIProcessSection } from '@/components/landing/AIProcessSection'
import { ProductDemoSection } from '@/components/landing/ProductDemoSection'
import { LaboratoryEnvironmentSection } from '@/components/landing/LaboratoryEnvironmentSection'
import { ComplianceComparisonSection } from '@/components/landing/ComplianceComparisonSection'
import { FeatureComparisonSection } from '@/components/landing/FeatureComparisonSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { CTASection } from '@/components/landing/CTASection'
import { FAQSection } from '@/components/landing/FAQSection'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { BiomniAssistant } from '@/components/ai-assistant/BiomniAssistant'

export const metadata: Metadata = {
  title: 'LabGuard Pro - AI-Powered Laboratory Compliance Platform',
  description: 'Transform your laboratory operations with Stanford\'s revolutionary Biomni AI. Automate compliance, streamline workflows, and ensure 100% accuracy.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      <main>
        <BiomniShowcase />
        <TrustSignalsSection />
        <BenefitsSection />
        <FeaturesSection />
        <ROISection />
        <AIProcessSection />
        <ProductDemoSection />
        <LaboratoryEnvironmentSection />
        <ComplianceComparisonSection />
        <FeatureComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
      <BiomniAssistant />
    </div>
  )
} 