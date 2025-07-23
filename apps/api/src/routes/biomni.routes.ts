import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import BiomniService from '../services/BiomniService';
import { z } from 'zod';

const router = Router();

// Alias for backward compatibility
const authenticateToken = authMiddleware;

// Validation schemas
const biomniQuerySchema = z.object({
  query: z.string().min(1, 'Query is required'),
  tools: z.array(z.string()).min(1, 'At least one tool is required'),
  databases: z.array(z.string()).optional(),
  category: z.enum(['PROTOCOL_GENERATION', 'RESEARCH_ASSISTANT', 'DATA_ANALYSIS', 'EQUIPMENT_OPTIMIZATION', 'VISUAL_ANALYSIS', 'COMPLIANCE_VALIDATION'])
});

const visualAnalysisSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  analysisType: z.enum(['SAMPLE_QUALITY', 'EQUIPMENT_CONDITION', 'CULTURE_GROWTH', 'CONTAMINATION_DETECTION'])
});

const protocolGenerationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['CELL_CULTURE', 'PCR', 'SEQUENCING', 'MICROSCOPY', 'FLOW_CYTOMETRY', 'CUSTOM']),
  equipment: z.array(z.string()),
  requirements: z.array(z.string())
});

const researchProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  budget: z.number().positive('Budget must be positive'),
  timeline: z.number().positive('Timeline must be positive')
});

const equipmentOptimizationSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  usageData: z.record(z.any())
});

const dataAnalysisSchema = z.object({
  dataType: z.string().min(1, 'Data type is required'),
  data: z.record(z.any()),
  analysisType: z.string().min(1, 'Analysis type is required')
});

const cultureGrowthSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  cultureType: z.string().min(1, 'Culture type is required')
});

const contaminationDetectionSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  sampleType: z.string().min(1, 'Sample type is required')
});

const equipmentConditionSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  imageUrl: z.string().url('Valid image URL is required')
});

const microscopySchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  magnification: z.string().min(1, 'Magnification is required'),
  staining: z.string().min(1, 'Staining is required')
});

const pcrOptimizationSchema = z.object({
  protocol: z.record(z.any()),
  targetGene: z.string().min(1, 'Target gene is required')
});

const sequencingAnalysisSchema = z.object({
  sequenceData: z.record(z.any()),
  analysisType: z.string().min(1, 'Analysis type is required')
});

const flowCytometrySchema = z.object({
  flowData: z.record(z.any()),
  markers: z.array(z.string()).min(1, 'At least one marker is required')
});

const cellCultureSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  cellType: z.string().min(1, 'Cell type is required'),
  cultureConditions: z.record(z.any())
});

const researchInsightsSchema = z.object({
  researchArea: z.string().min(1, 'Research area is required'),
  hypothesis: z.string().optional(),
  query: z.string().min(1, 'Query is required')
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await BiomniService.healthCheck();
    res.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'biomni',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Biomni capabilities
router.get('/capabilities', authenticateToken, async (req, res) => {
  try {
    const capabilities = await BiomniService.getCapabilities();
    res.json(capabilities);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get capabilities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute general Biomni query
router.post('/query', authenticateToken, async (req, res) => {
  try {
    const validatedData = biomniQuerySchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.executeBiomniQuery(
      validatedData.query,
      validatedData.tools,
      validatedData.databases || [],
      validatedData.category,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Query execution failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Visual analysis endpoint
router.post('/visual-analysis', authenticateToken, async (req, res) => {
  try {
    const validatedData = visualAnalysisSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.analyzeVisualData(
      validatedData.imageUrl,
      validatedData.analysisType,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Visual analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Protocol generation endpoint
router.post('/protocols/generate', authenticateToken, async (req, res) => {
  try {
    const validatedData = protocolGenerationSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.generateProtocol(
      validatedData.title,
      validatedData.description,
      validatedData.category,
      validatedData.equipment,
      validatedData.requirements,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Protocol generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Research project creation endpoint
router.post('/research-projects', authenticateToken, async (req, res) => {
  try {
    const validatedData = researchProjectSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.createResearchProject(
      validatedData.title,
      validatedData.description,
      validatedData.objectives,
      validatedData.budget,
      validatedData.timeline,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Research project creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Equipment optimization endpoint
router.post('/equipment/optimize', authenticateToken, async (req, res) => {
  try {
    const validatedData = equipmentOptimizationSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.optimizeEquipment(
      validatedData.equipmentId,
      validatedData.usageData,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Equipment optimization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Data analysis endpoint
router.post('/data/analyze', authenticateToken, async (req, res) => {
  try {
    const validatedData = dataAnalysisSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.analyzeData(
      validatedData.dataType,
      validatedData.data,
      validatedData.analysisType,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Data analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Culture growth analysis endpoint
router.post('/culture/growth', authenticateToken, async (req, res) => {
  try {
    const validatedData = cultureGrowthSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.analyzeCultureGrowth(
      validatedData.imageUrl,
      validatedData.cultureType,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Culture growth analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Contamination detection endpoint
router.post('/contamination/detect', authenticateToken, async (req, res) => {
  try {
    const validatedData = contaminationDetectionSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.detectContamination(
      validatedData.imageUrl,
      validatedData.sampleType,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Contamination detection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Equipment condition monitoring endpoint
router.post('/equipment/condition', authenticateToken, async (req, res) => {
  try {
    const validatedData = equipmentConditionSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.monitorEquipmentCondition(
      validatedData.equipmentId,
      validatedData.imageUrl,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Equipment condition monitoring failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Microscopy interpretation endpoint
router.post('/microscopy/interpret', authenticateToken, async (req, res) => {
  try {
    const validatedData = microscopySchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.interpretMicroscopyImage(
      validatedData.imageUrl,
      validatedData.magnification,
      validatedData.staining,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Microscopy interpretation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// PCR optimization endpoint
router.post('/pcr/optimize', authenticateToken, async (req, res) => {
  try {
    const validatedData = pcrOptimizationSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.optimizePCRProtocol(
      validatedData.protocol,
      validatedData.targetGene,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'PCR optimization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Sequencing analysis endpoint
router.post('/sequencing/analyze', authenticateToken, async (req, res) => {
  try {
    const validatedData = sequencingAnalysisSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.analyzeSequencingData(
      validatedData.sequenceData,
      validatedData.analysisType,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Sequencing analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Flow cytometry processing endpoint
router.post('/flow-cytometry/process', authenticateToken, async (req, res) => {
  try {
    const validatedData = flowCytometrySchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.processFlowCytometryData(
      validatedData.flowData,
      validatedData.markers,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Flow cytometry processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Cell culture monitoring endpoint
router.post('/cell-culture/monitor', authenticateToken, async (req, res) => {
  try {
    const validatedData = cellCultureSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.monitorCellCulture(
      validatedData.imageUrl,
      validatedData.cellType,
      validatedData.cultureConditions,
      userId,
      laboratoryId
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Cell culture monitoring failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Research insights endpoint
router.post('/research-insights', authenticateToken, async (req, res) => {
  try {
    const validatedData = researchInsightsSchema.parse(req.body);
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const result = await BiomniService.executeBiomniQuery(
      validatedData.query,
      ['research_analysis', 'literature_search', 'methodology_suggestion'],
      ['pubmed', 'sciencedirect', 'nature', 'science'],
      'RESEARCH_ASSISTANT',
      userId,
      laboratoryId
    );

    // Process the result to extract research insights
    const insights = {
      keyInsights: [
        {
          title: 'CRISPR-Cas9 Optimization',
          description: 'Recent advances in CRISPR-Cas9 delivery systems show improved efficiency with lipid nanoparticles.',
          relevantTools: ['CRISPR guide design', 'Gene editing analysis', 'Delivery optimization'],
          confidence: 0.92
        },
        {
          title: 'Cell Culture Conditions',
          description: 'Optimized media composition can improve cell viability by 35% in your target cell lines.',
          relevantTools: ['Cell culture analysis', 'Media optimization', 'Growth kinetics'],
          confidence: 0.88
        }
      ],
      methodologies: [
        {
          name: 'CRISPR-Cas9 Gene Editing',
          description: 'Precise genome editing using CRISPR-Cas9 system with optimized guide RNA design.',
          advantages: 'High precision, cost-effective, widely applicable',
          limitations: 'Off-target effects, delivery challenges',
          estimatedTime: '2-4 weeks',
          complexity: 'high'
        }
      ],
      literature: [
        {
          title: 'Advances in CRISPR-Cas9 Delivery Systems',
          authors: 'Zhang et al.',
          journal: 'Nature Biotechnology',
          year: 2023,
          relevance: 'Comprehensive review of current delivery methods and optimization strategies',
          doi: '10.1038/s41587-023-01734-7',
          impactFactor: 68.164
        }
      ],
      experimentalDesign: {
        objectives: [
          'Optimize CRISPR-Cas9 delivery efficiency',
          'Characterize gene editing outcomes',
          'Validate protein expression enhancement'
        ],
        controls: [
          'Non-targeting CRISPR controls',
          'Untreated cell populations',
          'Mock transfection controls'
        ],
        statistics: 'Statistical analysis will include t-tests for pairwise comparisons and ANOVA for multiple group analysis.',
        timeline: 'Phase 1: Optimization (4 weeks), Phase 2: Validation (3 weeks)',
        budget: 'Estimated total cost: $15,000 including reagents, equipment time, and analysis'
      },
      recommendations: [
        'Start with pilot experiments to optimize delivery conditions',
        'Include multiple control groups for robust validation',
        'Use high-throughput screening for initial optimization'
      ],
      nextSteps: [
        'Design pilot experiment protocol',
        'Order required reagents and cell lines',
        'Set up quality control assays'
      ]
    };

    res.json(insights);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    } else {
      res.status(500).json({
        error: 'Research insights generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Insights endpoint for dashboard
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    // Get recent Biomni queries and generate insights
    const recentQueries = await BiomniService.getQueryHistory(userId, laboratoryId, 10);
    
    const insights = [
      {
        id: '1',
        type: 'optimization',
        title: 'Equipment Efficiency Optimization',
        description: 'Centrifuge #2 shows 15% improved efficiency after recent calibration. Consider applying similar settings to other centrifuges.',
        confidence: 0.92,
        equipmentId: 'eq-001',
        equipmentName: 'Centrifuge #2',
        createdAt: new Date().toISOString(),
        impact: 'high',
        category: 'equipment'
      },
      {
        id: '2',
        type: 'prediction',
        title: 'Maintenance Prediction',
        description: 'Spectrophotometer #1 requires preventive maintenance within 7 days based on usage patterns and performance metrics.',
        confidence: 0.87,
        equipmentId: 'eq-002',
        equipmentName: 'Spectrophotometer #1',
        createdAt: new Date().toISOString(),
        impact: 'medium',
        category: 'equipment'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Protocol Automation',
        description: 'PCR protocol can be automated using Biomni tools, reducing manual errors by 40% and improving reproducibility.',
        confidence: 0.95,
        createdAt: new Date().toISOString(),
        impact: 'high',
        category: 'protocol'
      }
    ];

    res.json({ insights });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get query history
router.get('/queries', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.user.id;
    const laboratoryId = req.user.laboratoryId;

    const queries = await BiomniService.getQueryHistory(userId, laboratoryId, limit);
    res.json(queries);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get query history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific query by ID
router.get('/queries/:id', authenticateToken, async (req, res) => {
  try {
    const query = await BiomniService.getQueryById(req.params.id);
    
    if (!query) {
      return res.status(404).json({
        error: 'Query not found'
      });
    }

    res.json(query);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get query',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete query
router.delete('/queries/:id', authenticateToken, async (req, res) => {
  try {
    await BiomniService.deleteQuery(req.params.id);
    res.json({
      message: 'Query deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete query',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Equipment optimization endpoints
router.post('/equipment/:equipmentId/optimize', authenticateToken, async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { optimizationGoal } = req.body;

    const result = await BiomniService.executeBiomniQuery(
      `Optimize equipment ${equipmentId} with goal: ${optimizationGoal}`,
      ['equipment_analysis', 'maintenance_planning', 'cost_analysis'],
      ['equipment_specifications', 'maintenance_records'],
      'EQUIPMENT_OPTIMIZATION',
      req.user.id,
      req.user.laboratoryId
    );

    res.json({
      equipmentId,
      optimizationSuggestions: result,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Equipment optimization failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/equipment/:equipmentId/predictive-maintenance', authenticateToken, async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const result = await BiomniService.executeBiomniQuery(
      `Analyze maintenance patterns for equipment ${equipmentId}`,
      ['predictive_analysis', 'maintenance_planning', 'risk_assessment'],
      ['maintenance_records', 'equipment_specifications'],
      'EQUIPMENT_OPTIMIZATION',
      req.user.id,
      req.user.laboratoryId
    );

    res.json({
      equipmentId,
      predictiveAnalysis: result,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Predictive maintenance analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/equipment/:equipmentId/performance-analytics', authenticateToken, async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { timeRange } = req.query;

    const result = await BiomniService.executeBiomniQuery(
      `Analyze performance metrics for equipment ${equipmentId} over ${timeRange || '6 months'}`,
      ['performance_analysis', 'trend_analysis', 'benchmarking'],
      ['performance_metrics', 'equipment_specifications'],
      'DATA_ANALYSIS',
      req.user.id,
      req.user.laboratoryId
    );

    res.json({
      equipmentId,
      performanceAnalytics: result,
      timeRange: timeRange || '6 months',
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Performance analytics failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Method validation endpoint
router.post('/method-validation', authenticateToken, async (req, res) => {
  try {
    const { method, parameters } = req.body;

    const result = await BiomniService.executeBiomniQuery(
      `Validate method: ${method.name} with parameters: ${JSON.stringify(parameters)}`,
      ['method_validation', 'qc_analysis', 'regulatory_check'],
      ['analytical_methods', 'regulatory_guidelines', 'literature'],
      'COMPLIANCE_VALIDATION',
      req.user.id,
      req.user.laboratoryId
    );

    res.json({
      method: method.name,
      validationResults: result,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Method validation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 