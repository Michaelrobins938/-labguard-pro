'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ArrowRight, Shield, Zap, TrendingUp, Award, CheckCircle, AlertTriangle, BarChart3, Database, Upload, Brain, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Powered by Stanford Biomni AI</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                AI-Powered <br />
                <span className="text-gradient">Laboratory</span> <br />
                <span className="text-gradient">Compliance</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
                Transform your laboratory operations with Stanford's revolutionary Biomni AI. 
                Automate compliance, streamline workflows, and ensure 100% accuracy.
              </p>
              
              {/* Key Features */}
              <div className="mb-12 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Enterprise Analytics</h3>
                    <p className="text-gray-400">Advanced business intelligence & reporting</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Bulk Operations</h3>
                    <p className="text-gray-400">Efficient data management & automation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">LIMS Integration</h3>
                    <p className="text-gray-400">Seamless API management & connectivity</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 space-x-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 space-x-3"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
            
            {/* Right: Interactive Demo Preview */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="space-y-6">
                  {/* Demo Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Live Demo</h3>
                        <p className="text-sm text-gray-400">AI Analysis in Action</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-400">Live</span>
                    </div>
                  </div>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">Upload Laboratory Image</h4>
                    <p className="text-gray-400 mb-4">Drag & drop or click to analyze</p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                      Choose File
                    </button>
                  </div>
                  
                  {/* Analysis Results */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">AI Analysis Results</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-white">Sample Quality: Excellent</span>
                        </div>
                        <span className="text-green-400 text-sm">No contamination</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          <span className="text-white">Equipment Maintenance</span>
                        </div>
                        <span className="text-yellow-400 text-sm">Due in 7 days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                          <span className="text-white">Performance Optimized</span>
                        </div>
                        <span className="text-blue-400 text-sm">AI suggestions ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 