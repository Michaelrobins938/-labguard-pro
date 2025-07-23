import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

// Simple in-memory metrics (in production, use Prometheus/DataDog/etc.)
interface Metrics {
  httpRequestsTotal: { [key: string]: number }
  httpRequestDuration: { [key: string]: number[] }
  dbQueryDuration: { [key: string]: number[] }
  calibrationsTotal: { completed: number; failed: number; overdue: number }
  aiRequestsTotal: { compliance: number; biomni: number }
  aiCostTotal: { compliance: number; biomni: number }
  userActionsTotal: { [key: string]: number }
}

const metrics: Metrics = {
  httpRequestsTotal: {},
  httpRequestDuration: {},
  dbQueryDuration: {},
  calibrationsTotal: { completed: 0, failed: 0, overdue: 0 },
  aiRequestsTotal: { compliance: 0, biomni: 0 },
  aiCostTotal: { compliance: 0, biomni: 0 },
  userActionsTotal: {}
}

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const route = req.route?.path || req.path
  const method = req.method
  
  // Track request metrics
  const requestKey = `${method} ${route}`
  metrics.httpRequestsTotal[requestKey] = (metrics.httpRequestsTotal[requestKey] || 0) + 1

  // Track response time and errors
  res.on('finish', () => {
    const duration = Date.now() - startTime
    
    // Track response time
    if (!metrics.httpRequestDuration[requestKey]) {
      metrics.httpRequestDuration[requestKey] = []
    }
    metrics.httpRequestDuration[requestKey].push(duration)

    // Keep only last 100 measurements
    if (metrics.httpRequestDuration[requestKey].length > 100) {
      metrics.httpRequestDuration[requestKey] = metrics.httpRequestDuration[requestKey].slice(-100)
    }

    // Track errors
    if (res.statusCode >= 400) {
      logger.error(`HTTP ${res.statusCode}: ${requestKey}`, {
        method,
        route,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      })
    }

    // Log slow requests
    if (duration > 1000) {
      logger.warn(`Slow request detected: ${requestKey} took ${duration}ms`)
    }
  })

  next()
}

// Database performance monitoring
export class DatabaseMonitor {
  static trackQuery(query: string, duration: number) {
    const queryType = this.getQueryType(query)
    
    if (!metrics.dbQueryDuration[queryType]) {
      metrics.dbQueryDuration[queryType] = []
    }
    metrics.dbQueryDuration[queryType].push(duration)

    // Keep only last 100 measurements
    if (metrics.dbQueryDuration[queryType].length > 100) {
      metrics.dbQueryDuration[queryType] = metrics.dbQueryDuration[queryType].slice(-100)
    }
    
    if (duration > 1000) { // Slow query alert
      logger.warn(`Slow query detected: ${query} took ${duration}ms`)
    }
  }

  static trackConnection(pool: any) {
    setInterval(() => {
      const activeConnections = pool.totalCount || 0
      const idleConnections = pool.idleCount || 0
      
      logger.info('Database connection status', {
        active: activeConnections,
        idle: idleConnections,
        total: activeConnections + idleConnections
      })
    }, 30000) // Check every 30 seconds
  }

  private static getQueryType(query: string): string {
    const upperQuery = query.toUpperCase()
    if (upperQuery.includes('SELECT')) return 'SELECT'
    if (upperQuery.includes('INSERT')) return 'INSERT'
    if (upperQuery.includes('UPDATE')) return 'UPDATE'
    if (upperQuery.includes('DELETE')) return 'DELETE'
    return 'OTHER'
  }
}

// Business metrics tracking
export class BusinessMetrics {
  static trackCalibration(status: 'completed' | 'failed' | 'overdue') {
    metrics.calibrationsTotal[status]++
    
    logger.info('Calibration tracked', {
      status,
      total: metrics.calibrationsTotal
    })
  }

  static trackAIUsage(type: 'compliance' | 'biomni', cost: number) {
    metrics.aiRequestsTotal[type]++
    metrics.aiCostTotal[type] += cost
    
    logger.info('AI usage tracked', {
      type,
      requests: metrics.aiRequestsTotal[type],
      totalCost: metrics.aiCostTotal[type]
    })
  }

  static trackUserActivity(action: string, userId: string) {
    metrics.userActionsTotal[action] = (metrics.userActionsTotal[action] || 0) + 1
    
    logger.info('User activity tracked', {
      action,
      userId,
      total: metrics.userActionsTotal[action]
    })
  }

  static getMetrics() {
    return {
      ...metrics,
      // Calculate averages
      httpRequestDurationAvg: Object.keys(metrics.httpRequestDuration).reduce((acc, key) => {
        const durations = metrics.httpRequestDuration[key]
        acc[key] = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
        return acc
      }, {} as { [key: string]: number }),
      dbQueryDurationAvg: Object.keys(metrics.dbQueryDuration).reduce((acc, key) => {
        const durations = metrics.dbQueryDuration[key]
        acc[key] = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
        return acc
      }, {} as { [key: string]: number })
    }
  }
}

// Health check endpoint
export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis connection (if using Redis)
    // const redis = new Redis(process.env.REDIS_URL)
    // await redis.ping()
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: BusinessMetrics.getMetrics()
    }
    
    res.json(health)
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

// Metrics endpoint for monitoring systems
export const metricsEndpoint = (req: Request, res: Response) => {
  const currentMetrics = BusinessMetrics.getMetrics()
  
  // Format for Prometheus
  const prometheusFormat = Object.entries(currentMetrics)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        return Object.entries(value)
          .map(([subKey, subValue]) => `${key}_${subKey} ${subValue}`)
          .join('\n')
      }
      return `${key} ${value}`
    })
    .join('\n')
  
  res.set('Content-Type', 'text/plain')
  res.send(prometheusFormat)
}

// Performance monitoring for specific routes
export const performanceMonitor = (routeName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - startTime
      
      logger.info(`Route performance: ${routeName}`, {
        duration,
        method: req.method,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent')
      })
      
      // Track for business metrics
      BusinessMetrics.trackUserActivity(`route_${routeName}`, req.user?.id || 'anonymous')
    })
    
    next()
  }
}

// Error tracking middleware
export const errorTracking = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Application error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id
  })
  
  // Track error metrics
  BusinessMetrics.trackUserActivity('error', req.user?.id || 'anonymous')
  
  next(error)
}

// Rate limiting middleware
export const rateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown'
    const now = Date.now()
    
    const requestData = requests.get(key)
    
    if (!requestData || now > requestData.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs })
    } else {
      requestData.count++
      
      if (requestData.count > max) {
        logger.warn(`Rate limit exceeded for IP: ${key}`)
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
        })
      }
    }
    
    next()
  }
} 