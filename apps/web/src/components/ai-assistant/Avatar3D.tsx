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
      {/* Main Spherical Orb */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, #60A5FA 0%, #3B82F6 50%, #1E40AF 100%)`,
          boxShadow: `0 0 30px rgba(96, 165, 250, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)`
        }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
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
          <div className="absolute flex space-x-3" style={{ top: '35%' }}>
            <div className="w-3 h-2 bg-white rounded-full shadow-lg opacity-90" />
            <div className="w-3 h-2 bg-white rounded-full shadow-lg opacity-90" />
          </div>
          
          {/* Smile */}
          <div className="absolute bottom-6">
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
              <path 
                d="M3 3C6 6 10 6 13 3" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Inner Curved Element - Darker Teal */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 180deg, transparent 0deg, #0F766E 90deg, transparent 180deg)`,
          borderRadius: '50%',
          transform: 'rotate(-45deg)'
        }}
        animate={{ 
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: `conic-gradient(from 180deg, transparent 0deg, #0F766E 60deg, transparent 120deg)`,
            borderRadius: '50%'
          }}
        />
      </motion.div>

      {/* Outer Curved Element - Brighter Teal */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 45deg, transparent 0deg, #14B8A6 90deg, transparent 180deg)`,
          borderRadius: '50%',
          transform: 'rotate(45deg)'
        }}
        animate={{ 
          rotate: [0, -360]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div 
          className="absolute inset-1 rounded-full"
          style={{
            background: `conic-gradient(from 45deg, transparent 0deg, #14B8A6 60deg, transparent 120deg)`,
            borderRadius: '50%'
          }}
        />
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, rgba(96, 165, 250, 0.1) 50%, transparent 100%)`,
          filter: 'blur(8px)'
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
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