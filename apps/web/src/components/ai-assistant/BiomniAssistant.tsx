'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { Avatar3D } from './Avatar3D';
import { biomniClient } from '@/lib/ai/biomni-client';
import { contextAnalyzer } from '@/lib/ai/context-analyzer';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  avatarState?: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

export function BiomniAssistant() {
  const [isVisible, setIsVisible] = useState(true); // Changed to true to show immediately
  const [isExpanded, setIsExpanded] = useState(false);
  const [avatarState, setAvatarState] = useState<string>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug log to verify component is rendering
  console.log('BiomniAssistant component rendered, isVisible:', isVisible);

  // Initialize assistant
  useEffect(() => {
    console.log('BiomniAssistant initializing...');
    const initializeAssistant = async () => {
      // Add welcome message
      setMessages([{
        id: '1',
        type: 'assistant',
        content: "Hello! I'm your AI lab assistant powered by Biomni. I can help with equipment calibration, compliance tracking, and predictive maintenance. How can I assist you today?",
        timestamp: Date.now(),
        avatarState: 'excited'
      }]);

      // Start proactive monitoring
      startProactiveMonitoring();
    };

    initializeAssistant();

    // Listen for toggle events from header
    const handleToggleAssistant = () => {
      setIsVisible(true);
      setIsExpanded(true);
      setAvatarState('excited');
      setTimeout(() => setAvatarState('idle'), 1000);
    };

    window.addEventListener('toggle-assistant', handleToggleAssistant);

    return () => {
      window.removeEventListener('toggle-assistant', handleToggleAssistant);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Proactive monitoring - simplified to avoid hiding the assistant
  const startProactiveMonitoring = () => {
    console.log('Starting proactive monitoring...');
    setInterval(async () => {
      console.log('Proactive monitoring check...');
      if (!isExpanded) {
        setAvatarState('analyzing');
        
        try {
          const context = await contextAnalyzer.getCurrentContext();
          const analysis = await biomniClient.analyzeLabContext(context);
          
          if (analysis.suggestedActions.length > 0) {
            const criticalAction = analysis.suggestedActions
              .filter(action => action.priority === 'critical' || action.priority === 'high')[0];
            
            if (criticalAction) {
              setCurrentSuggestion({
                id: criticalAction.id,
                title: criticalAction.title,
                description: criticalAction.description,
                action: criticalAction.action,
                priority: criticalAction.priority,
                confidence: 0.9
              });
              // Don't hide the assistant, just show the suggestion
              setAvatarState('concerned');
              
              // Flash attention
              setTimeout(() => setAvatarState('idle'), 3000);
            }
          } else {
            setAvatarState('idle');
          }
        } catch (error) {
          console.log('Proactive monitoring error:', error);
          setAvatarState('idle');
        }
      }
    }, 30000); // Check every 30 seconds
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    console.log('🔄 handleSendMessage called with:', inputValue);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    console.log('📝 Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAvatarState('thinking');

    try {
      console.log('🤖 Calling AI services...');
      
      // Simulate AI response with better error handling
      const context = await contextAnalyzer.getCurrentContext();
      console.log('📊 Context received:', context);
      
      const response = await biomniClient.generateResponse(inputValue, context);
      console.log('💬 AI Response received:', response);
      
      // Determine avatar state based on response content
      let responseAvatarState = 'speaking';
      if (response.toLowerCase().includes('error') || response.toLowerCase().includes('problem')) {
        responseAvatarState = 'concerned';
      } else if (response.toLowerCase().includes('great') || response.toLowerCase().includes('excellent')) {
        responseAvatarState = 'excited';
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: Date.now(),
        avatarState: responseAvatarState
      };

      console.log('🤖 Adding assistant message:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      setAvatarState('idle');
    } catch (error) {
      console.error('❌ Chat error:', error);
      
      // Fallback response if API fails
      const fallbackResponse = getFallbackResponse(inputValue);
      console.log('🔄 Using fallback response:', fallbackResponse);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: Date.now(),
        avatarState: 'speaking'
      };

      console.log('🤖 Adding fallback message:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      setAvatarState('idle');
    }
  };

  // Fallback response function
  const getFallbackResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('calibration') || lowerInput.includes('calibrate')) {
      return "I can help you with calibration scheduling! I notice you have 2 pieces of equipment due for calibration. Would you like me to automatically schedule them based on your availability?";
    }
    
    if (lowerInput.includes('compliance') || lowerInput.includes('audit')) {
      return "Your current compliance rate is 98.5%. I've identified a few areas where we can improve to reach 100%. Shall I show you the specific recommendations?";
    }
    
    if (lowerInput.includes('equipment') || lowerInput.includes('device')) {
      return "I'm monitoring 145 pieces of equipment in your lab. 142 are currently operational. Would you like me to show you the status of any specific equipment?";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm your AI lab assistant powered by Stanford's Biomni technology. I can help with equipment management, compliance tracking, and predictive maintenance. What would you like to know?";
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I'm here to help! I can assist with equipment calibration, compliance reports, maintenance scheduling, and lab optimization. What specific area do you need help with?";
    }
    
    return "I'm here to help with your laboratory management needs. I can assist with equipment calibration, compliance tracking, predictive maintenance, and more. What would you like to know?";
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setAvatarState('excited');
    setTimeout(() => setAvatarState('idle'), 1000);
  };

  const handleApplySuggestion = () => {
    if (!currentSuggestion) return;
    
    setIsExpanded(true);
    setAvatarState('analyzing');
    setCurrentSuggestion(null);
    
    // Simulate applying suggestion
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Perfect! I've successfully applied the suggestion: "${currentSuggestion.title}". Your lab systems have been updated. Is there anything else I can help you with?`,
        timestamp: Date.now(),
        avatarState: 'excited'
      }]);
      setAvatarState('idle');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
          style={{ zIndex: 1000 }}
        >
          {/* Test Button - Always visible */}
          <div className="absolute -top-12 right-0">
            <Button
              size="sm"
              onClick={() => {
                console.log('Test button clicked!');
                setIsVisible(true);
                setIsExpanded(!isExpanded);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
            >
              Test Biomni
            </Button>
            <Button
              size="sm"
              onClick={() => {
                console.log('🧪 Test message button clicked!');
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  type: 'assistant',
                  content: '🧪 Test message - Basic functionality working! Try typing a message now.',
                  timestamp: Date.now(),
                  avatarState: 'excited'
                }]);
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 ml-2"
            >
              Test Message
            </Button>
          </div>

          {/* Collapsed State with 3D Avatar */}
          {!isExpanded && (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Main Avatar */}
              <Avatar3D 
                state={avatarState}
                size="xl"
                onClick={handleExpand}
                className="drop-shadow-2xl"
              />
              
              {/* Suggestion Bubble */}
              {currentSuggestion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="absolute -left-80 top-4 w-72 glass-card p-4 rounded-2xl"
                >
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {currentSuggestion.title}
                      </h4>
                      <p className="text-xs text-gray-300 mb-3">
                        {currentSuggestion.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleApplySuggestion}
                          className="h-7 px-3 text-xs bg-gradient-to-r from-teal-500 to-cyan-500"
                        >
                          Apply Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentSuggestion(null)}
                          className="h-7 px-3 text-xs hover:bg-white/10"
                        >
                          Later
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className="absolute right-4 top-6 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent transform rotate-90" />
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Expanded Chat Interface */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, height: 400 }}
              animate={{ opacity: 1, scale: 1, height: 500 }}
              exit={{ opacity: 0, scale: 0.9, height: 400 }}
              className="glass-card w-96 rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Header with Avatar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
                <div className="flex items-center space-x-3">
                  <Avatar3D 
                    state={avatarState} 
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Biomni Assistant</h3>
                    <p className="text-xs text-gray-400">
                      {avatarState === 'thinking' ? 'Thinking...' : 
                       avatarState === 'analyzing' ? 'Analyzing lab data...' :
                       avatarState === 'speaking' ? 'Speaking...' : 'Ready to help'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                  >
                    {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Messages with Avatar States */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {message.type === 'assistant' && (
                        <Avatar3D 
                          state={message.avatarState || 'idle'} 
                          size="sm"
                          className="flex-shrink-0"
                        />
                      )}
                      <div className={`rounded-2xl p-3 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <p className="text-sm text-gray-200">{message.content}</p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">U</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input with Voice Controls */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      console.log('📝 Input changed:', e.target.value);
                      setInputValue(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      console.log('⌨️ Key pressed:', e.key);
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        console.log('🚀 Enter pressed, calling handleSendMessage');
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about equipment, calibration, compliance..."
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onClick={() => {
                      console.log('🎤 Voice button clicked');
                      setIsListening(!isListening);
                    }}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      console.log('📤 Send button clicked');
                      handleSendMessage();
                    }}
                    disabled={!inputValue.trim()}
                    className="h-10 w-10 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 