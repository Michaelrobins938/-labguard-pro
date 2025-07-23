'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Shield, ChevronDown, Zap } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white/10 backdrop-blur-md shadow-lg/20 border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section with modern branding */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg/30 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">LabGuard Pro</span>
              <span className="text-xs text-gray-500 font-medium">Enterprise Compliance</span>
            </div>
          </div>
          
          {/* Navigation Links with glassmorphic styling */}
          <nav className="hidden lg:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              What we do
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group flex items-center">
              Our offerings
              <ChevronDown className="w-4 h-4 ml-1" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
          {/* CTA Buttons with modern styling */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-white/50 backdrop-blur-sm"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg/30 backdrop-blur-sm flex items-center space-x-2 border border-gray-200/20"
            >
              <span>Get Demo</span>
              <Zap className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button with glassmorphic styling */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Navigation with glassmorphism */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-xl hover:bg-white/50">
                What we do
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-xl hover:bg-white/50">
                Our offerings
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-xl hover:bg-white/50">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-xl hover:bg-white/50">
                Blog
              </a>
              <div className="flex flex-col space-y-3 pt-6 border-t border-white/20">
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-white/50 rounded-xl">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-lg/30 rounded-xl border border-gray-200/20">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 