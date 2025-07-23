'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { avatarStates, type AvatarState } from './AvatarStates';

interface Avatar3DProps {
  state: keyof typeof avatarStates;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
}

export function Avatar3D({ state = 'idle', size = 'md', onClick, className }: Avatar3DProps) {
  const [currentState, setCurrentState] = useState<AvatarState>(avatarStates[state]);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  useEffect(() => {
    setCurrentState(avatarStates[state]);
  }, [state]);

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentState.glowColor}40 0%, ${currentState.glowColor}20 50%, transparent 100%)`,
          filter: 'blur(8px)'
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [currentState.intensity * 0.6, currentState.intensity, currentState.intensity * 0.6]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Main Swirl Container */}
      <motion.div
        className="relative w-full h-full rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${currentState.glowColor}80, #1E293B, ${currentState.glowColor}60, #374151, ${currentState.glowColor}80)`,
          boxShadow: `inset 0 0 20px ${currentState.glowColor}40, 0 0 30px ${currentState.glowColor}30`
        }}
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 10 / currentState.rotation, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Inner Shadow Ring */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 40%, #0F172A80 70%, #0F172A 100%)`,
            boxShadow: `inset 0 0 15px #00000060`
          }}
        />
        
        {/* Center Face Container */}
        <motion.div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${currentState.glowColor} 0%, ${currentState.glowColor}E6 100%)`,
            boxShadow: `0 0 20px ${currentState.glowColor}80, inset 0 0 10px ${currentState.glowColor}40`
          }}
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Face Elements */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute flex space-x-2" style={{ top: '35%' }}>
              <motion.div
                className="w-2 h-2 bg-white rounded-full shadow-lg"
                animate={currentState.eyeExpression === 'wink' ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="w-2 h-2 bg-white rounded-full shadow-lg"
                animate={currentState.eyeExpression === 'analyzing' ? { 
                  scaleX: [1, 1.2, 1], 
                  scaleY: [1, 0.8, 1] 
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            
            {/* Mouth */}
            <motion.div
              className="absolute bottom-6"
              animate={currentState.mood === 'speaking' ? {
                scaleY: [1, 1.2, 0.8, 1]
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path 
                  d="M2 2C4 4 8 4 10 2" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
            
            {/* Thinking Dots (when analyzing) */}
            {currentState.mood === 'thinking' && (
              <div className="absolute bottom-2 flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-white/80 rounded-full"
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      y: [0, -2, 0]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Interaction Ripple Effect */}
      {onClick && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale: 1.1, opacity: 0.6 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
} 