'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Brain, 
  MessageCircle, 
  Send, 
  Camera, 
  FileText, 
  BarChart3, 
  Settings,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  actions?: AssistantAction[]
  attachments?: Attachment[]
  isTyping?: boolean
}

interface AssistantAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  color: string
}

interface Attachment {
  id: string
  type: 'image' | 'file' | 'data'
  url: string
  name: string
  size: number
}

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  action: () => void
}

const quickActions: QuickAction[] = [
  {
    id: 'analyze-image',
    label: 'Analyze Image',
    description: 'Upload a lab image for analysis',
    icon: <Camera className="w-5 h-5" />,
    color: 'bg-blue-500',
    action: () => {}
  },
  {
    id: 'generate-protocol',
    label: 'Generate Protocol',
    description: 'Create an experimental protocol',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-green-500',
    action: () => {}
  },
  {
    id: 'analyze-data',
    label: 'Analyze Data',
    description: 'Process research data',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-purple-500',
    action: () => {}
  },
  {
    id: 'optimize-equipment',
    label: 'Optimize Equipment',
    description: 'Improve equipment performance',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-orange-500',
    action: () => {}
  }
]

export function BiomniAssistant() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm Biomni, your AI laboratory assistant. I can help you with image analysis, protocol generation, data analysis, and equipment optimization. What would you like to work on today?",
      timestamp: new Date(),
      actions: [
        {
          id: 'analyze-image',
          label: 'Analyze Image',
          icon: <Camera className="w-4 h-4" />,
          action: () => handleQuickAction('analyze-image'),
          color: 'bg-blue-500'
        },
        {
          id: 'generate-protocol',
          label: 'Generate Protocol',
          icon: <FileText className="w-4 h-4" />,
          action: () => handleQuickAction('generate-protocol'),
          color: 'bg-green-500'
        }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(inputValue),
        timestamp: new Date(),
        actions: generateActions(inputValue)
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('image') || lowerInput.includes('photo') || lowerInput.includes('picture')) {
      return "I can help you analyze laboratory images! I can detect sample quality, equipment conditions, culture growth patterns, and contamination. Would you like to upload an image for analysis?"
    } else if (lowerInput.includes('protocol') || lowerInput.includes('experiment')) {
      return "Great! I can generate experimental protocols for various techniques like PCR, cell culture, sequencing, and more. What type of protocol are you looking for?"
    } else if (lowerInput.includes('data') || lowerInput.includes('analysis')) {
      return "I can analyze your research data for trends, anomalies, and insights. What type of data are you working with?"
    } else if (lowerInput.includes('equipment') || lowerInput.includes('calibration')) {
      return "I can help optimize your laboratory equipment! I can analyze usage patterns, suggest maintenance schedules, and improve performance. What equipment are you working with?"
    } else {
      return "I'm here to help with your laboratory work! I can assist with image analysis, protocol generation, data analysis, and equipment optimization. What would you like to explore?"
    }
  }

  const generateActions = (input: string): AssistantAction[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('image') || lowerInput.includes('photo')) {
      return [
        {
          id: 'upload-image',
          label: 'Upload Image',
          icon: <Camera className="w-4 h-4" />,
          action: () => handleAction('upload-image'),
          color: 'bg-blue-500'
        },
        {
          id: 'sample-quality',
          label: 'Sample Quality',
          icon: <CheckCircle className="w-4 h-4" />,
          action: () => handleAction('sample-quality'),
          color: 'bg-green-500'
        }
      ]
    } else if (lowerInput.includes('protocol')) {
      return [
        {
          id: 'cell-culture',
          label: 'Cell Culture',
          icon: <FileText className="w-4 h-4" />,
          action: () => handleAction('cell-culture'),
          color: 'bg-green-500'
        },
        {
          id: 'pcr-protocol',
          label: 'PCR Protocol',
          icon: <FileText className="w-4 h-4" />,
          action: () => handleAction('pcr-protocol'),
          color: 'bg-purple-500'
        }
      ]
    }
    
    return []
  }

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (action) {
      const message: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `I want to ${action.label.toLowerCase()}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, message])
      action.action()
    }
  }

  const handleAction = (actionId: string) => {
    console.log('Action triggered:', actionId)
    // Handle specific actions
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Implement voice recognition
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Assistant Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            <Brain className="w-8 h-8" />
          </Button>
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Assistant Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
        }`}>
          <Card className="h-full shadow-2xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Biomni Assistant</CardTitle>
                    <CardDescription className="text-blue-100">
                      AI Laboratory Helper
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          }`}>
                            {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            {message.actions && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {message.actions.map((action) => (
                                  <Button
                                    key={action.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={action.action}
                                    className={`text-xs ${action.color} hover:${action.color}`}
                                  >
                                    {action.icon}
                                    <span className="ml-1">{action.label}</span>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="text-xs h-auto p-2 flex flex-col items-center space-y-1"
                      >
                        <div className={`w-6 h-6 rounded-full ${action.color} flex items-center justify-center text-white`}>
                          {action.icon}
                        </div>
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceInput}
                      className={isListening ? 'bg-red-500 text-white' : ''}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your lab work..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
} 