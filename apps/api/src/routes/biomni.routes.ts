import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import BiomniService from '../services/BiomniService';
import { z } from 'zod';

const router = Router();

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

export default router; 