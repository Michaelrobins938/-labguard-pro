'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar3D } from '@/components/ai-assistant/Avatar3D';
import { AIStatusWidget } from '@/components/dashboard/AIStatusWidget';
import { 
  FlaskConical, 
  Lightbulb, 
  Zap, 
  Brain, 
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function AIAssistantDemoPage() {
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'speaking' | 'excited' | 'concerned' | 'analyzing'>('idle');

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Intelligent Analysis',
      description: 'AI-powered equipment monitoring and predictive maintenance',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Compliance Tracking',
      description: 'Automated compliance monitoring and reporting',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Proactive Alerts',
      description: 'Real-time notifications for calibration and maintenance',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Performance Optimization',
      description: 'Data-driven insights to improve lab efficiency',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const demoActions = [
    {
      title: 'Test Thinking State',
      action: () => setAvatarState('thinking'),
      color: 'bg-blue-500'
    },
    {
      title: 'Test Speaking State',
      action: () => setAvatarState('speaking'),
      color: 'bg-green-500'
    },
    {
      title: 'Test Excited State',
      action: () => setAvatarState('excited'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Test Concerned State',
      action: () => setAvatarState('concerned'),
      color: 'bg-red-500'
    },
    {
      title: 'Test Analyzing State',
      action: () => setAvatarState('analyzing'),
      color: 'bg-purple-500'
    },
    {
      title: 'Reset to Idle',
      action: () => setAvatarState('idle'),
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Biomni AI Assistant Demo
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Experience the future of laboratory management with our intelligent AI assistant powered by Stanford's Biomni platform.
        </p>
      </div>

      {/* Main Avatar Demo */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center space-x-3">
            <FlaskConical className="h-8 w-8 text-teal-400" />
            <span>3D AI Avatar Demo</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Interactive demonstration of the Biomni AI assistant's 3D avatar with different emotional states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            {/* Large Avatar */}
            <div className="relative">
              <Avatar3D 
                state={avatarState}
                size="xl"
                className="drop-shadow-2xl"
              />
              
              {/* Status Indicator */}
              <div className="absolute -top-4 -right-4">
                <Badge className={`${
                  avatarState === 'thinking' ? 'bg-blue-500' :
                  avatarState === 'speaking' ? 'bg-green-500' :
                  avatarState === 'excited' ? 'bg-yellow-500' :
                  avatarState === 'concerned' ? 'bg-red-500' :
                  avatarState === 'analyzing' ? 'bg-purple-500' :
                  'bg-gray-500'
                } text-white`}>
                  {avatarState.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* State Controls */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {demoActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} hover:opacity-80 transition-all duration-200`}
                  variant="outline"
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="glass-card border-white/10 hover:border-white/20 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Status Widget Demo */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Live AI Status Monitor</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time monitoring of laboratory equipment and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIStatusWidget />
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span>Key Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proactive Alerts</h3>
              <p className="text-gray-400 text-sm">
                Get notified before equipment issues become problems
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Insights</h3>
              <p className="text-gray-400 text-sm">
                AI-powered recommendations for lab optimization
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Compliance Assurance</h3>
              <p className="text-gray-400 text-sm">
                Automated compliance tracking and reporting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="glass-card border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The Biomni AI assistant is now integrated into your LabGuard Pro dashboard. 
            Navigate to any page to see the intelligent assistant in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              onClick={() => window.location.href = '/dashboard'}
            >
              <FlaskConical className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 