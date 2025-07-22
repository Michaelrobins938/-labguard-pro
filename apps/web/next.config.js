/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key-here',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-stripe-publishable-key',
  },
  async rewrites() {
    // Only add rewrites if API_BASE_URL is set
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api'
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig 