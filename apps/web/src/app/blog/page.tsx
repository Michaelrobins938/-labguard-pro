import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - LabGuard Pro',
  description: 'Latest insights on laboratory compliance and automation.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">LabGuard Pro Blog</h1>
          <p className="text-xl text-gray-300">
            Latest insights on laboratory compliance and automation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <article className="enhanced-card">
            <div className="mb-4">
              <span className="text-sm text-teal-400">Compliance</span>
              <h3 className="text-xl font-semibold text-white mt-2">
                New CAP/CLIA Requirements for 2024
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Learn about the latest updates to laboratory compliance standards and how LabGuard Pro helps you stay compliant.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>January 15, 2024</span>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
          </article>

          {/* Blog Post 2 */}
          <article className="enhanced-card">
            <div className="mb-4">
              <span className="text-sm text-teal-400">AI & Automation</span>
              <h3 className="text-xl font-semibold text-white mt-2">
                How AI is Revolutionizing Lab Management
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Discover how artificial intelligence is transforming laboratory operations and improving efficiency.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>January 10, 2024</span>
              <span className="mx-2">•</span>
              <span>7 min read</span>
            </div>
          </article>

          {/* Blog Post 3 */}
          <article className="enhanced-card">
            <div className="mb-4">
              <span className="text-sm text-teal-400">Best Practices</span>
              <h3 className="text-xl font-semibold text-white mt-2">
                Equipment Calibration Best Practices
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Essential tips for maintaining accurate equipment calibration and ensuring reliable results.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>January 5, 2024</span>
              <span className="mx-2">•</span>
              <span>6 min read</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
} 