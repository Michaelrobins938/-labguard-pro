export interface AvatarState {
  mood: 'idle' | 'thinking' | 'speaking' | 'excited' | 'concerned' | 'analyzing';
  intensity: number; // 0-1 for glow intensity
  rotation: number; // Swirl rotation speed
  eyeExpression: 'normal' | 'wink' | 'analyzing' | 'alert';
  glowColor: string;
}

export const avatarStates: Record<string, AvatarState> = {
  idle: {
    mood: 'idle',
    intensity: 0.6,
    rotation: 1,
    eyeExpression: 'normal',
    glowColor: '#14B8A6' // Teal
  },
  thinking: {
    mood: 'thinking',
    intensity: 0.8,
    rotation: 2,
    eyeExpression: 'analyzing',
    glowColor: '#06B6D4' // Cyan
  },
  speaking: {
    mood: 'speaking',
    intensity: 0.9,
    rotation: 1.5,
    eyeExpression: 'normal',
    glowColor: '#10B981' // Emerald
  },
  excited: {
    mood: 'excited',
    intensity: 1,
    rotation: 3,
    eyeExpression: 'normal',
    glowColor: '#F59E0B' // Amber
  },
  concerned: {
    mood: 'concerned',
    intensity: 0.7,
    rotation: 0.8,
    eyeExpression: 'alert',
    glowColor: '#EF4444' // Red
  },
  analyzing: {
    mood: 'analyzing',
    intensity: 0.85,
    rotation: 2.5,
    eyeExpression: 'analyzing',
    glowColor: '#8B5CF6' // Purple
  }
}; 