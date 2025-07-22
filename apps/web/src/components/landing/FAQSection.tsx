'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How quickly can we implement LabGuard Pro?',
      answer: 'Most laboratories can be up and running with LabGuard Pro within 2-3 weeks. Our team handles the initial setup, data migration, and training. For enterprise customers, we offer accelerated implementation programs.'
    },
    {
      question: 'What types of equipment does LabGuard Pro support?',
      answer: 'LabGuard Pro supports all laboratory equipment including analytical balances, centrifuges, incubators, autoclaves, pH meters, spectrophotometers, and more. Our AI can validate calibration data for any equipment type.'
    },
    {
      question: 'Is LabGuard Pro compliant with CAP and CLIA regulations?',
      answer: 'Yes, LabGuard Pro is designed specifically for CAP and CLIA compliance. Our platform generates audit-ready documentation and maintains all required records. We\'ve helped hundreds of labs pass their CAP inspections.'
    },
    {
      question: 'How does the AI-powered compliance checking work?',
      answer: 'Our AI analyzes calibration data, historical trends, and equipment performance to detect potential compliance issues before they become problems. It learns from your lab\'s specific patterns and provides predictive alerts.'
    },
    {
      question: 'What if we have unique compliance requirements?',
      answer: 'LabGuard Pro is highly customizable. We can create custom workflows, templates, and validation rules to match your specific compliance needs. Our enterprise customers get dedicated support for complex requirements.'
    },
    {
      question: 'How secure is our compliance data?',
      answer: 'LabGuard Pro uses enterprise-grade security with HIPAA compliance, data encryption, and regular security audits. We maintain SOC 2 Type II certification and follow strict data protection protocols.'
    },
    {
      question: 'Can we integrate with our existing LIMS or ERP system?',
      answer: 'Yes, LabGuard Pro offers API access and custom integrations. We can connect to your existing LIMS, ERP, or other laboratory management systems to ensure seamless data flow.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We provide comprehensive support including onboarding, training, and ongoing assistance. Professional and Enterprise plans include dedicated support managers and priority response times.'
    },
    {
      question: 'How do you handle data backup and recovery?',
      answer: 'We provide automatic daily backups with point-in-time recovery capabilities. Your compliance data is stored securely in the cloud with 99.9% uptime SLA and disaster recovery protocols.'
    },
    {
      question: 'What\'s included in the free trial?',
      answer: 'The 14-day free trial includes full access to all features, up to 10 equipment items, and unlimited compliance checks. Our team provides setup assistance and training during the trial period.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about LabGuard Pro implementation, compliance, and support.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help. Contact us for personalized answers and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                Contact Support
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 