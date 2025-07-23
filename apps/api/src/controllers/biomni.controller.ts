import { Request, Response } from 'express';
import BiomniService from '../services/BiomniService';

export class BiomniController {
  /**
   * Execute a Biomni query
   */
  async executeQuery(req: Request, res: Response) {
    try {
      const { query, tools, databases, category } = req.body;

      if (!query || !tools || !databases || !category) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: query, tools, databases, category'
        });
      }

      const result = await BiomniService.executeBiomniQuery(query, tools, databases, category);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Biomni query execution error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute Biomni query',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate experimental protocol
   */
  async generateProtocol(req: Request, res: Response) {
    try {
      const { title, description, category, equipment, requirements } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, category'
        });
      }

      const protocol = await BiomniService.generateProtocol(
        title,
        description,
        category,
        equipment || [],
        requirements || []
      );

      res.json({
        success: true,
        data: protocol
      });
    } catch (error) {
      console.error('Protocol generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate protocol',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create research project
   */
  async createResearchProject(req: Request, res: Response) {
    try {
      const { title, description, objectives, budget, timeline } = req.body;

      if (!title || !description || !objectives || !budget || !timeline) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, objectives, budget, timeline'
        });
      }

      const project = await BiomniService.createResearchProject(
        title,
        description,
        objectives,
        budget,
        timeline
      );

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Research project creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create research project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Optimize equipment usage
   */
  async optimizeEquipment(req: Request, res: Response) {
    try {
      const { equipmentId } = req.params;
      const { usageData } = req.body;

      if (!equipmentId) {
        return res.status(400).json({
          success: false,
          message: 'Missing equipment ID'
        });
      }

      const optimization = await BiomniService.optimizeEquipment(equipmentId, usageData || {});

      res.json({
        success: true,
        data: optimization
      });
    } catch (error) {
      console.error('Equipment optimization error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to optimize equipment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Analyze research data
   */
  async analyzeData(req: Request, res: Response) {
    try {
      const { dataType, data, analysisType } = req.body;

      if (!dataType || !data || !analysisType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: dataType, data, analysisType'
        });
      }

      const analysis = await BiomniService.analyzeData(dataType, data, analysisType);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Data analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Validate protocol compliance
   */
  async validateProtocolCompliance(req: Request, res: Response) {
    try {
      const { protocol } = req.body;

      if (!protocol) {
        return res.status(400).json({
          success: false,
          message: 'Missing protocol data'
        });
      }

      const validation = await BiomniService.validateProtocolCompliance(protocol);

      res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      console.error('Protocol validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate protocol compliance',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get available tools
   */
  async getAvailableTools(req: Request, res: Response) {
    try {
      const tools = BiomniService.getAvailableTools();

      res.json({
        success: true,
        data: tools
      });
    } catch (error) {
      console.error('Get available tools error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available tools',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get available databases
   */
  async getAvailableDatabases(req: Request, res: Response) {
    try {
      const databases = BiomniService.getAvailableDatabases();

      res.json({
        success: true,
        data: databases
      });
    } catch (error) {
      console.error('Get available databases error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available databases',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get query history
   */
  async getQueryHistory(req: Request, res: Response) {
    try {
      const { limit = 50 } = req.query;
      const history = await BiomniService.getQueryHistory(Number(limit));

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Get query history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get query history',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get query by ID
   */
  async getQueryById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Missing query ID'
        });
      }

      const query = await BiomniService.getQueryById(id);

      if (!query) {
        return res.status(404).json({
          success: false,
          message: 'Query not found'
        });
      }

      res.json({
        success: true,
        data: query
      });
    } catch (error) {
      console.error('Get query by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get query',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete query
   */
  async deleteQuery(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Missing query ID'
        });
      }

      await BiomniService.deleteQuery(id);

      res.json({
        success: true,
        message: 'Query deleted successfully'
      });
    } catch (error) {
      console.error('Delete query error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete query',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Health check
   */
  async healthCheck(req: Request, res: Response) {
    try {
      const isHealthy = await BiomniService.healthCheck();

      if (isHealthy) {
        res.json({
          success: true,
          message: 'Biomni service is healthy',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          message: 'Biomni service is unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Biomni health check error:', error);
      res.status(503).json({
        success: false,
        message: 'Biomni service health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new BiomniController(); 