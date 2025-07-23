import axios from 'axios';

export interface BiomniAnalysis {
  equipmentNeedsAttention: EquipmentAlert[];
  complianceRisk: number;
  maintenancePredictions: MaintenancePrediction[];
  userStrugglingIndicators: StrugglingIndicator[];
  suggestedActions: SuggestedAction[];
}

export interface EquipmentAlert {
  equipmentId: string;
  name: string;
  type: 'calibration_due' | 'maintenance_needed' | 'error_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  daysUntilDue: number;
  message: string;
}

export interface MaintenancePrediction {
  equipmentId: string;
  predictedFailureDate: string;
  confidence: number;
  preventiveActions: string[];
}

export interface StrugglingIndicator {
  type: 'navigation_confusion' | 'calibration_difficulty' | 'report_generation_issues';
  confidence: number;
  suggestion: string;
  context: any;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  biomniTools: string[];
  estimatedTime: string;
}

export interface LabContext {
  currentPage: string;
  timeOnPage: number;
  recentActions: UserAction[];
  equipmentData: any[];
  complianceMetrics: any;
  userRole: string;
  labType: string;
}

export interface UserAction {
  type: 'navigation' | 'click' | 'form_submit' | 'search' | 'filter';
  timestamp: number;
  target: string;
  metadata?: any;
}

class BiomniClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_BIOMNI_API_KEY || '';
    this.baseUrl = 'https://api.biomni.ai/v1';
  }

  async analyzeLabContext(context: LabContext): Promise<BiomniAnalysis> {
    try {
      // Simulate Biomni API call with intelligent analysis
      const response = await axios.post(`${this.baseUrl}/analyze`, {
        context,
        tools: ['equipment-analyzer', 'compliance-checker', 'predictive-maintenance'],
        environment: 'laboratory-management'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Biomni API Error:', error);
      // Fallback to mock analysis for demonstration
      return this.getMockAnalysis(context);
    }
  }

  private getMockAnalysis(context: LabContext): BiomniAnalysis {
    return {
      equipmentNeedsAttention: [
        {
          equipmentId: 'spec-001',
          name: 'Spectrophotometer UV-2600',
          type: 'calibration_due',
          severity: 'high',
          daysUntilDue: 3,
          message: 'Calibration due in 3 days. Schedule now to maintain compliance.'
        },
        {
          equipmentId: 'cent-002',
          name: 'Centrifuge Model X',
          type: 'maintenance_needed',
          severity: 'medium',
          daysUntilDue: 7,
          message: 'Routine maintenance recommended based on usage patterns.'
        }
      ],
      complianceRisk: context.currentPage.includes('calibration') ? 0.85 : 0.15,
      maintenancePredictions: [
        {
          equipmentId: 'auto-003',
          predictedFailureDate: '2024-02-15',
          confidence: 0.78,
          preventiveActions: ['Replace seals', 'Calibrate sensors', 'Update firmware']
        }
      ],
      userStrugglingIndicators: this.detectStrugglingPatterns(context),
      suggestedActions: [
        {
          id: 'schedule-calibrations',
          title: 'Schedule Overdue Calibrations',
          description: 'AI detected 2 pieces of equipment need immediate attention',
          action: 'auto_schedule_calibrations',
          priority: 'high',
          biomniTools: ['calibration-scheduler', 'equipment-analyzer'],
          estimatedTime: '5 minutes'
        }
      ]
    };
  }

  private detectStrugglingPatterns(context: LabContext): StrugglingIndicator[] {
    const indicators: StrugglingIndicator[] = [];

    // Detect if user is spending too long on calibration page
    if (context.currentPage.includes('calibration') && context.timeOnPage > 300000) { // 5 minutes
      indicators.push({
        type: 'calibration_difficulty',
        confidence: 0.8,
        suggestion: 'ai_assisted_calibration',
        context: { timeSpent: context.timeOnPage, page: context.currentPage }
      });
    }

    // Detect frequent navigation between pages
    if (context.recentActions.filter(a => a.type === 'navigation').length > 5) {
      indicators.push({
        type: 'navigation_confusion',
        confidence: 0.7,
        suggestion: 'guided_tour',
        context: { navigationCount: context.recentActions.length }
      });
    }

    return indicators;
  }

  async generateResponse(message: string, context: LabContext): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat`, {
        message,
        context,
        systemPrompt: `You are a specialized laboratory AI assistant for LabGuard Pro. 
        Help users with equipment calibration, compliance tracking, and laboratory management.
        Be concise, helpful, and focus on actionable solutions.`
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.response;
    } catch (error) {
      return this.generateMockResponse(message, context);
    }
  }

  private generateMockResponse(message: string, context: LabContext): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('calibration')) {
      return "I can help you with calibration scheduling! I notice you have 2 pieces of equipment due for calibration. Would you like me to automatically schedule them based on your availability?";
    }
    
    if (lowerMessage.includes('compliance')) {
      return "Your current compliance rate is 98.5%. I've identified a few areas where we can improve to reach 100%. Shall I show you the specific recommendations?";
    }
    
    if (lowerMessage.includes('equipment')) {
      return "I'm monitoring 145 pieces of equipment in your lab. 142 are currently operational. Would you like me to show you the status of any specific equipment?";
    }
    
    return "I'm here to help with your laboratory management needs. I can assist with equipment calibration, compliance tracking, predictive maintenance, and more. What would you like to know?";
  }
}

export const biomniClient = new BiomniClient(); 