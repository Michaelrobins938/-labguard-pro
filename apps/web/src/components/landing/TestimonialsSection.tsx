'use client'

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by leading laboratories
          </h2>
          <p className="text-xl text-gray-600">
            See how LabGuard Pro is transforming laboratory compliance worldwide
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Testimonial 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed">
              "LabGuard Pro has transformed our compliance process. We've reduced calibration errors by 95% and saved countless hours on audit preparation."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold mr-4">
                SJ
              </div>
              <div>
                <div className="font-semibold text-gray-900">Dr. Sarah Johnson</div>
                <div className="text-gray-600 text-sm">Lab Director, City Medical Center</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed">
              "The AI validation feature is incredible. It catches issues we would have missed and ensures we're always audit-ready."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold mr-4">
                MC
              </div>
              <div>
                <div className="font-semibold text-gray-900">Mike Chen</div>
                <div className="text-gray-600 text-sm">Quality Manager, Research Lab</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 mb-6 leading-relaxed">
              "We've been using LabGuard Pro for 6 months and our compliance score went from 78% to 96%. The ROI is incredible."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                AL
              </div>
              <div>
                <div className="font-semibold text-gray-900">Dr. Alex Lee</div>
                <div className="text-gray-600 text-sm">CTO, University Hospital</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 