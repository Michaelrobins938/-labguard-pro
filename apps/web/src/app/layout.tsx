import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LabGuard Pro - Laboratory Compliance Automation',
  description: 'AI-powered laboratory compliance management platform for equipment calibration, validation, and regulatory compliance.',
  keywords: 'laboratory, compliance, calibration, equipment, AI, validation, regulatory',
  authors: [{ name: 'LabGuard Pro Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'LabGuard Pro - Laboratory Compliance Automation',
    description: 'AI-powered laboratory compliance management platform',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabGuard Pro - Laboratory Compliance Automation',
    description: 'AI-powered laboratory compliance management platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-inter">
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
} 