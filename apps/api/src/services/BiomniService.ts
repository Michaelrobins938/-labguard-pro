web application import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export interface BiomniQuery {
  id: string;
  query: string;
  tools: string[];
  databases: string[];
  category: 'PROTOCOL_GENERATION' | 'RESEARCH_ASSISTANT' | 'DATA_ANALYSIS' | 'EQUIPMENT_OPTIMIZATION' | 'VISUAL_ANALYSIS' | 'COMPLIANCE_VALIDATION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface BiomniProtocol {
  id: string;
  title: string;
  description: string;
  category: 'CELL_CULTURE' | 'PCR' | 'SEQUENCING' | 'MICROSCOPY' | 'FLOW_CYTOMETRY' | 'CUSTOM';
  steps: BiomniProtocolStep[];
  equipment: string[];
  reagents: string[];
  safetyNotes: string[];
  estimatedDuration: number; // in minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  aiGenerated: boolean;
  validatedBy?: string;
  validationDate?: Date;
}

export interface BiomniProtocolStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // in minutes
  equipment: string[];
  reagents: string[];
  safetyNotes: string[];
  criticalPoints: string[];
}

export interface BiomniResearchProject {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  methodology: string;
  expectedOutcomes: string[];
  timeline: number; // in days
  budget: number;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  equipmentRequirements: string[];
  personnelRequirements: string[];
  riskAssessment: string[];
}

export interface BiomniVisualAnalysis {
  id: string;
  imageUrl: string;
  analysisType: 'SAMPLE_QUALITY' | 'EQUIPMENT_CONDITION' | 'CULTURE_GROWTH' | 'CONTAMINATION_DETECTION';
  results: {
    quality: number; // 0-100
    issues: string[];
    recommendations: string[];
    confidence: number; // 0-1
  };
  metadata: {
    imageSize: number;
    format: string;
    timestamp: Date;
  };
}

export interface BiomniComplianceValidation {
  id: string;
  protocolId: string;
  validationType: 'SAFETY' | 'REGULATORY' | 'QUALITY' | 'COST';
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
  regulatoryStandards: string[];
}

class BiomniService {
  private pythonPath: string;
  private biomniScriptPath: string;
  private availableTools: string[];
  private availableDatabases: string[];
  private biomniApiKey: string;
  private biomniBaseUrl: string;

  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python3';
    this.biomniScriptPath = path.join(__dirname, '../scripts/biomni_agent.py');
    this.biomniApiKey = process.env.BIOMNI_API_KEY || 'demo-key';
    this.biomniBaseUrl = process.env.BIOMNI_BASE_URL || 'https://api.biomni.stanford.edu';
    
    this.availableTools = [
      'protocol_generator',
      'research_assistant',
      'data_analyzer',
      'equipment_optimizer',
      'safety_checker',
      'compliance_validator',
      'cost_calculator',
      'timeline_planner',
      'risk_assessor',
      'quality_controller',
      'visual_analyzer',
      'sample_quality_assessor',
      'culture_growth_analyzer',
      'contamination_detector',
      'equipment_condition_monitor',
      'microscopy_interpreter',
      'pcr_optimizer',
      'sequencing_analyzer',
      'flow_cytometry_processor',
      'cell_culture_monitor'
    ];
    
    this.availableDatabases = [
      'pubmed',
      'genbank',
      'pdb',
      'chembl',
      'drugbank',
      'clinicaltrials',
      'equipment_catalog',
      'safety_database',
      'compliance_regulations',
      'cost_database',
      'protocol_database',
      'reagent_catalog',
      'equipment_manual_database',
      'troubleshooting_database',
      'best_practices_database'
    ];
  }

  /**
   * Execute a Biomni query with specified tools and databases
   */
  async executeBiomniQuery(query: string, tools: string[], databases: string[], category: string, userId: string, laboratoryId: string): Promise<BiomniQuery> {
    try {
      // Validate tools and databases
      const validTools = tools.filter(tool => this.availableTools.includes(tool));
      const validDatabases = databases.filter(db => this.availableDatabases.includes(db));

      if (validTools.length === 0) {
        throw new Error('No valid tools specified');
      }

      // Create Biomni query record
      const biomniQuery = await prisma.biomniQuery.create({
        data: {
          query,
          userId,
          laboratoryId,
          toolsUsed: validTools,
          databasesQueried: validDatabases,
          status: 'EXECUTING',
          createdAt: new Date()
        }
      });

      // Execute Biomni agent
      const result = await this.runBiomniAgent(query, validTools, validDatabases, category);

      // Update query with result
      const updatedQuery = await prisma.biomniQuery.update({
        where: { id: biomniQuery.id },
        data: {
          status: 'COMPLETED',
          result: result,
          confidence: result.confidence || 0.8,
          executionTime: result.executionTime || 0,
          cost: result.cost || 0,
          updatedAt: new Date()
        }
      });

      return updatedQuery;
    } catch (error) {
      console.error('Biomni query execution failed:', error);
      
      // Update query with error
      if (error instanceof Error && error.message.includes('biomniQuery')) {
        await prisma.biomniQuery.update({
          where: { id: (error as any).queryId },
          data: {
            status: 'FAILED',
            error: error.message,
            updatedAt: new Date()
          }
        });
      }

      throw error;
    }
  }

  /**
   * Run the Biomni Python agent
   */
  private async runBiomniAgent(query: string, tools: string[], databases: string[], category: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
        this.biomniScriptPath,
        '--query', query,
        '--tools', tools.join(','),
        '--databases', databases.join(','),
        '--category', category
      ]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Biomni output: ${error}`));
          }
        } else {
          reject(new Error(`Biomni agent failed with code ${code}: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Biomni agent: ${error.message}`));
      });
    });
  }

  /**
   * Analyze visual data (images) using Biomni
   */
  async analyzeVisualData(imageUrl: string, analysisType: string, userId: string, laboratoryId: string): Promise<BiomniVisualAnalysis> {
    const query = `Analyze ${analysisType} from image: ${imageUrl}`;
    
    const result = await this.executeBiomniQuery(
      query,
      ['visual_analyzer', 'sample_quality_assessor'],
      ['equipment_catalog', 'safety_database'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Visual analysis failed');
    }

    const analysis: BiomniVisualAnalysis = {
      id: `visual_${Date.now()}`,
      imageUrl,
      analysisType: analysisType as any,
      results: {
        quality: result.result.quality || 0,
        issues: result.result.issues || [],
        recommendations: result.result.recommendations || [],
        confidence: result.result.confidence || 0.8
      },
      metadata: {
        imageSize: result.result.imageSize || 0,
        format: result.result.format || 'unknown',
        timestamp: new Date()
      }
    };

    return analysis;
  }

  /**
   * Generate experimental protocol with AI
   */
  async generateProtocol(
    title: string,
    description: string,
    category: string,
    equipment: string[],
    requirements: string[],
    userId: string,
    laboratoryId: string
  ): Promise<BiomniProtocol> {
    const query = `Generate a detailed experimental protocol for: ${title}. Description: ${description}. Category: ${category}. Equipment available: ${equipment.join(', ')}. Requirements: ${requirements.join(', ')}`;

    const result = await this.executeBiomniQuery(
      query,
      ['protocol_generator', 'safety_checker', 'compliance_validator'],
      ['pubmed', 'equipment_catalog', 'safety_database', 'protocol_database'],
      'PROTOCOL_GENERATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Protocol generation failed');
    }

    const protocol: BiomniProtocol = {
      id: `protocol_${Date.now()}`,
      title,
      description,
      category: category as any,
      steps: result.result.steps || [],
      equipment: result.result.equipment || equipment,
      reagents: result.result.reagents || [],
      safetyNotes: result.result.safetyNotes || [],
      estimatedDuration: result.result.estimatedDuration || 120,
      difficulty: result.result.difficulty || 'INTERMEDIATE',
      aiGenerated: true
    };

    return protocol;
  }

  /**
   * Create research project with AI assistance
   */
  async createResearchProject(
    title: string,
    description: string,
    objectives: string[],
    budget: number,
    timeline: number,
    userId: string,
    laboratoryId: string
  ): Promise<BiomniResearchProject> {
    const query = `Create a research project plan for: ${title}. Description: ${description}. Objectives: ${objectives.join(', ')}. Budget: $${budget}. Timeline: ${timeline} days`;

    const result = await this.executeBiomniQuery(
      query,
      ['research_assistant', 'timeline_planner', 'cost_calculator', 'risk_assessor'],
      ['pubmed', 'clinicaltrials', 'cost_database'],
      'RESEARCH_ASSISTANT',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Research project creation failed');
    }

    const project: BiomniResearchProject = {
      id: `project_${Date.now()}`,
      title,
      description,
      objectives,
      methodology: result.result.methodology || '',
      expectedOutcomes: result.result.expectedOutcomes || [],
      timeline,
      budget,
      status: 'PLANNING',
      equipmentRequirements: result.result.equipmentRequirements || [],
      personnelRequirements: result.result.personnelRequirements || [],
      riskAssessment: result.result.riskAssessment || []
    };

    return project;
  }

  /**
   * Optimize equipment usage and calibration
   */
  async optimizeEquipment(equipmentId: string, usageData: any, userId: string, laboratoryId: string): Promise<any> {
    const query = `Optimize equipment usage and calibration for equipment ID: ${equipmentId}. Usage data: ${JSON.stringify(usageData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['equipment_optimizer', 'data_analyzer', 'quality_controller'],
      ['equipment_catalog', 'pubmed', 'troubleshooting_database'],
      'EQUIPMENT_OPTIMIZATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Equipment optimization failed');
    }

    return result.result;
  }

  /**
   * Analyze research data with AI
   */
  async analyzeData(dataType: string, data: any, analysisType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze ${dataType} data for ${analysisType}. Data: ${JSON.stringify(data)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['data_analyzer', 'quality_controller'],
      ['pubmed', 'genbank', 'pdb'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Data analysis failed');
    }

    return result.result;
  }

  /**
   * Validate protocol compliance
   */
  async validateProtocolCompliance(protocol: BiomniProtocol, userId: string, laboratoryId: string): Promise<BiomniComplianceValidation> {
    const query = `Validate protocol compliance for: ${protocol.title}. Steps: ${JSON.stringify(protocol.steps)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['compliance_validator', 'safety_checker', 'quality_controller'],
      ['compliance_regulations', 'safety_database', 'best_practices_database'],
      'COMPLIANCE_VALIDATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Protocol validation failed');
    }

    const validation: BiomniComplianceValidation = {
      id: `validation_${Date.now()}`,
      protocolId: protocol.id,
      validationType: 'REGULATORY',
      status: result.result.status || 'PASS',
      score: result.result.score || 0,
      issues: result.result.issues || [],
      recommendations: result.result.recommendations || [],
      regulatoryStandards: result.result.regulatoryStandards || []
    };

    return validation;
  }

  /**
   * Analyze culture growth patterns
   */
  async analyzeCultureGrowth(imageUrl: string, cultureType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze culture growth patterns for ${cultureType} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['culture_growth_analyzer', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Culture growth analysis failed');
    }

    return result.result;
  }

  /**
   * Detect contamination in samples
   */
  async detectContamination(imageUrl: string, sampleType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Detect contamination in ${sampleType} sample from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['contamination_detector', 'visual_analyzer'],
      ['safety_database', 'pubmed'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Contamination detection failed');
    }

    return result.result;
  }

  /**
   * Monitor equipment condition
   */
  async monitorEquipmentCondition(equipmentId: string, imageUrl: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Monitor equipment condition for ${equipmentId} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['equipment_condition_monitor', 'visual_analyzer'],
      ['equipment_catalog', 'troubleshooting_database'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Equipment condition monitoring failed');
    }

    return result.result;
  }

  /**
   * Interpret microscopy images
   */
  async interpretMicroscopyImage(imageUrl: string, magnification: string, staining: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Interpret microscopy image at ${magnification} magnification with ${staining} staining from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['microscopy_interpreter', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Microscopy interpretation failed');
    }

    return result.result;
  }

  /**
   * Optimize PCR protocols
   */
  async optimizePCRProtocol(protocol: any, targetGene: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Optimize PCR protocol for ${targetGene}. Current protocol: ${JSON.stringify(protocol)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['pcr_optimizer', 'protocol_generator'],
      ['pubmed', 'protocol_database'],
      'PROTOCOL_GENERATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('PCR optimization failed');
    }

    return result.result;
  }

  /**
   * Analyze sequencing data
   */
  async analyzeSequencingData(sequenceData: any, analysisType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze sequencing data for ${analysisType}. Data: ${JSON.stringify(sequenceData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['sequencing_analyzer', 'data_analyzer'],
      ['genbank', 'pubmed'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Sequencing analysis failed');
    }

    return result.result;
  }

  /**
   * Process flow cytometry data
   */
  async processFlowCytometryData(flowData: any, markers: string[], userId: string, laboratoryId: string): Promise<any> {
    const query = `Process flow cytometry data with markers: ${markers.join(', ')}. Data: ${JSON.stringify(flowData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['flow_cytometry_processor', 'data_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Flow cytometry processing failed');
    }

    return result.result;
  }

  /**
   * Monitor cell culture conditions
   */
  async monitorCellCulture(imageUrl: string, cellType: string, cultureConditions: any, userId: string, laboratoryId: string): Promise<any> {
    const query = `Monitor cell culture conditions for ${cellType} under conditions: ${JSON.stringify(cultureConditions)} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['cell_culture_monitor', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Cell culture monitoring failed');
    }

    return result.result;
  }

  /**
   * Get available tools
   */
  getAvailableTools(): string[] {
    return this.availableTools;
  }

  /**
   * Get available databases
   */
  getAvailableDatabases(): string[] {
    return this.availableDatabases;
  }

  /**
   * Get query history
   */
  async getQueryHistory(userId: string, laboratoryId: string, limit: number = 50): Promise<BiomniQuery[]> {
    return prisma.biomniQuery.findMany({
      where: {
        userId,
        laboratoryId
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * Get query by ID
   */
  async getQueryById(id: string): Promise<BiomniQuery | null> {
    return prisma.biomniQuery.findUnique({
      where: { id }
    });
  }

  /**
   * Delete query
   */
  async deleteQuery(id: string): Promise<void> {
    await prisma.biomniQuery.delete({
      where: { id }
    });
  }

  /**
   * Health check for Biomni service
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test Python environment
      const { stdout } = await execAsync(`${this.pythonPath} --version`);
      console.log('Python version:', stdout);

      // Test Biomni script
      const { stdout: scriptOutput } = await execAsync(`${this.pythonPath} ${this.biomniScriptPath} --health`);
      console.log('Biomni script health:', scriptOutput);

      return true;
    } catch (error) {
      console.error('Biomni health check failed:', error);
      return false;
    }
  }

  /**
   * Get Biomni capabilities and statistics
   */
  async getCapabilities(): Promise<any> {
    return {
      tools: this.availableTools,
      databases: this.availableDatabases,
      totalTools: this.availableTools.length,
      totalDatabases: this.availableDatabases.length,
      categories: [
        'PROTOCOL_GENERATION',
        'RESEARCH_ASSISTANT', 
        'DATA_ANALYSIS',
        'EQUIPMENT_OPTIMIZATION',
        'VISUAL_ANALYSIS',
        'COMPLIANCE_VALIDATION'
      ],
      features: [
        'AI-powered protocol generation',
        'Visual sample analysis',
        'Equipment optimization',
        'Compliance validation',
        'Research project planning',
        'Data analysis and interpretation',
        'Culture growth monitoring',
        'Contamination detection',
        'Microscopy interpretation',
        'PCR optimization',
        'Sequencing analysis',
        'Flow cytometry processing',
        'Cell culture monitoring'
      ]
    };
  }
}

export default new BiomniService(); 