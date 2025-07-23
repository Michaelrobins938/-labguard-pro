// Demo AI service for development
export interface AIAnalysisResult {
  type: string
  score: number
  status: string
  color: string
  details: string
}

export interface AIInsight {
  id: string
  type: 'optimization' | 'prediction' | 'recommendation' | 'alert'
  title: string
  description: string
  confidence: number
  equipmentId?: string
  equipmentName?: string
  createdAt: string
}

export class AIService {
  static async analyzeSample(imageData: string): Promise<AIAnalysisResult[]> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return [
      {
        type: 'Sample Quality',
        score: 98,
        status: 'Excellent',
        color: 'text-green-600',
        details: 'No contamination detected, proper growth patterns observed'
      },
      {
        type: 'Contamination Risk',
        score: 2,
        status: 'Low',
        color: 'text-green-600',
        details: 'Minimal risk of contamination, proper sterile technique'
      },
      {
        type: 'Equipment Condition',
        score: 95,
        status: 'Good',
        color: 'text-blue-600',
        details: 'Equipment functioning within normal parameters'
      },
      {
        type: 'Compliance Status',
        score: 100,
        status: 'Compliant',
        color: 'text-green-600',
        details: 'All regulatory requirements met'
      }
    ]
  }

  static async generateProtocol(query: string): Promise<any> {
    // Simulate protocol generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    return {
      protocol: {
        title: 'Generated Protocol',
        steps: [
          'Prepare sterile environment',
          'Calibrate equipment',
          'Follow safety procedures',
          'Document results'
        ],
        safetyNotes: 'Ensure proper PPE and ventilation',
        qualityControl: 'Run positive and negative controls'
      },
      confidence: 0.95,
      toolsUsed: ['protocol_generator', 'safety_checker'],
      databasesQueried: ['safety_guidelines', 'equipment_manuals']
    }
  }

  static async getInsights(): Promise<AIInsight[]> {
    // Simulate AI insights
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return [
      {
        id: '1',
        type: 'optimization',
        title: 'Equipment Efficiency Improved',
        description: 'AI suggests calibration schedule optimization',
        confidence: 0.92,
        equipmentId: 'eq-001',
        equipmentName: 'Analytical Balance',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'prediction',
        title: 'Maintenance Due Soon',
        description: 'Predictive analysis suggests maintenance in 7 days',
        confidence: 0.88,
        equipmentId: 'eq-002',
        equipmentName: 'Centrifuge',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Process Optimization',
        description: 'AI recommends workflow improvements',
        confidence: 0.85,
        createdAt: new Date().toISOString()
      }
    ]
  }

  static async validateCalibration(equipmentData: any): Promise<any> {
    // Simulate calibration validation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      isValid: true,
      confidence: 0.96,
      issues: [],
      recommendations: [
        'Continue current calibration schedule',
        'Monitor temperature fluctuations',
        'Document environmental conditions'
      ]
    }
  }
} 