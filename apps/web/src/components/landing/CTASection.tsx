'use client'

import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-blue to-primary-blue-dark">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to transform your lab compliance?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join hundreds of laboratories already using LabGuard Pro to automate compliance and prevent costly equipment failures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-white text-primary-blue px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-blue transition-all duration-200 font-semibold text-lg"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  )
} 