import { PrismaClient } from '@prisma/client'
import { CacheService } from './CacheService'

export interface AnalyticsMetrics {
  equipmentUtilization: number
  calibrationEfficiency: number
  complianceRate: number
  costSavings: number
  predictiveMaintenance: any[]
  riskAssessment: any[]
  trends: any[]
}

export interface CustomReport {
  id: string
  name: string
  description: string
  query: string
  parameters: any[]
  schedule?: string
  recipients: string[]
  format: 'PDF' | 'CSV' | 'EXCEL'
  lastGenerated?: Date
}

export class AnalyticsService {
  private prisma: PrismaClient
  private cache: CacheService

  constructor() {
    this.prisma = new PrismaClient()
    this.cache = new CacheService()
  }

  // Real-time Dashboard Metrics
  async getDashboardMetrics(labId: string): Promise<AnalyticsMetrics> {
    const cacheKey = `analytics:dashboard:${labId}`
    
    try {
      const cached = await this.cache.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const metrics = await this.calculateDashboardMetrics(labId)
      
      // Cache for 5 minutes
      await this.cache.redis.setex(cacheKey, 300, JSON.stringify(metrics))
      
      return metrics
    } catch (error) {
      console.error('Dashboard metrics error:', error)
      return await this.calculateDashboardMetrics(labId)
    }
  }

  // Predictive Analytics
  async getPredictiveInsights(labId: string): Promise<any> {
    const equipment = await this.prisma.equipment.findMany({
      where: { laboratoryId: labId },
      include: {
        calibrationRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        maintenanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    const insights = {
      maintenancePredictions: await this.predictMaintenance(equipment),
      calibrationOptimization: await this.optimizeCalibrationSchedule(equipment),
      riskAssessment: await this.assessRisk(equipment),
      costOptimization: await this.optimizeCosts(equipment)
    }

    return insights
  }

  // Custom Report Generation
  async generateCustomReport(reportId: string, parameters: any = {}): Promise<any> {
    const report = await this.prisma.customReport.findUnique({
      where: { id: reportId }
    })

    if (!report) {
      throw new Error('Report not found')
    }

    const data = await this.executeReportQuery(report.query, parameters)
    
    return {
      report,
      data,
      generatedAt: new Date(),
      format: report.format
    }
  }

  // Export Data
  async exportData(labId: string, dataType: string, format: 'CSV' | 'PDF' | 'EXCEL', filters: any = {}): Promise<any> {
    const data = await this.getDataForExport(labId, dataType, filters)
    
    switch (format) {
      case 'CSV':
        return this.exportToCSV(data, dataType)
      case 'PDF':
        return this.exportToPDF(data, dataType)
      case 'EXCEL':
        return this.exportToExcel(data, dataType)
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  // Compliance Reporting
  async generateComplianceReport(labId: string, framework: 'CLIA' | 'CAP' | 'HIPAA' | 'SOC2'): Promise<any> {
    const report = {
      framework,
      generatedAt: new Date(),
      period: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date()
      },
      summary: await this.getComplianceSummary(labId, framework),
      details: await this.getComplianceDetails(labId, framework),
      recommendations: await this.getComplianceRecommendations(labId, framework)
    }

    return report
  }

  // Performance Analytics
  async getPerformanceAnalytics(labId: string, period: 'day' | 'week' | 'month' | 'quarter'): Promise<any> {
    const startDate = this.getStartDate(period)
    
    const analytics = {
      period,
      startDate,
      endDate: new Date(),
      equipmentPerformance: await this.getEquipmentPerformance(labId, startDate),
      calibrationEfficiency: await this.getCalibrationEfficiency(labId, startDate),
      costAnalysis: await this.getCostAnalysis(labId, startDate),
      complianceTrends: await this.getComplianceTrends(labId, startDate),
      userActivity: await this.getUserActivity(labId, startDate)
    }

    return analytics
  }

  // Private helper methods
  private async calculateDashboardMetrics(labId: string): Promise<AnalyticsMetrics> {
    const [
      totalEquipment,
      activeEquipment,
      calibrationsThisMonth,
      totalCostSavings
    ] = await Promise.all([
      this.prisma.equipment.count({
        where: { laboratoryId: labId }
      }),
      this.prisma.equipment.count({
        where: { 
          laboratoryId: labId,
          status: 'ACTIVE'
        }
      }),
      this.prisma.calibrationRecord.count({
        where: {
          equipment: { laboratoryId: labId },
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      this.calculateCostSavings(labId)
    ])

    const utilization = totalEquipment > 0 ? (activeEquipment / totalEquipment) * 100 : 0
    const efficiency = await this.calculateCalibrationEfficiency(labId)
    const compliance = await this.calculateComplianceRate(labId)

    return {
      equipmentUtilization: utilization,
      calibrationEfficiency: efficiency,
      complianceRate: compliance,
      costSavings: totalCostSavings,
      predictiveMaintenance: await this.getPredictiveMaintenance(labId),
      riskAssessment: await this.getRiskAssessment(labId),
      trends: await this.getTrends(labId)
    }
  }

  private async predictMaintenance(equipment: any[]): Promise<any[]> {
    const predictions = []

    for (const item of equipment) {
      const lastMaintenance = item.maintenanceRecords[0]
      const lastCalibration = item.calibrationRecords[0]
      
      if (lastMaintenance && lastCalibration) {
        const daysSinceMaintenance = Math.floor((Date.now() - lastMaintenance.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        const daysSinceCalibration = Math.floor((Date.now() - lastCalibration.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        
        // Simple prediction logic - replace with ML model
        const maintenanceDue = daysSinceMaintenance > 90
        const calibrationDue = daysSinceCalibration > 30
        
        if (maintenanceDue || calibrationDue) {
          predictions.push({
            equipmentId: item.id,
            equipmentName: item.name,
            type: maintenanceDue ? 'MAINTENANCE' : 'CALIBRATION',
            dueDate: new Date(Date.now() + (maintenanceDue ? 7 : 3) * 24 * 60 * 60 * 1000),
            confidence: 0.85,
            priority: maintenanceDue ? 'HIGH' : 'MEDIUM'
          })
        }
      }
    }

    return predictions
  }

  private async optimizeCalibrationSchedule(equipment: any[]): Promise<any[]> {
    const optimizations = []

    for (const item of equipment) {
      const calibrations = item.calibrationRecords
      
      if (calibrations.length > 2) {
        // Calculate optimal interval based on historical data
        const intervals = calibrations.slice(1).map((cal, index) => {
          const prevCal = calibrations[index]
          return Math.floor((cal.createdAt.getTime() - prevCal.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        })
        
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
        const optimalInterval = Math.max(avgInterval * 0.9, 30) // 10% reduction, minimum 30 days
        
        optimizations.push({
          equipmentId: item.id,
          equipmentName: item.name,
          currentInterval: avgInterval,
          recommendedInterval: optimalInterval,
          potentialSavings: (avgInterval - optimalInterval) * 100 // Simplified calculation
        })
      }
    }

    return optimizations
  }

  private async assessRisk(equipment: any[]): Promise<any[]> {
    const risks = []

    for (const item of equipment) {
      const calibrations = item.calibrationRecords
      const maintenance = item.maintenanceRecords
      
      let riskScore = 0
      let riskFactors = []

      // Equipment age risk
      const ageInDays = Math.floor((Date.now() - item.installDate.getTime()) / (1000 * 60 * 60 * 24))
      if (ageInDays > 365 * 3) {
        riskScore += 30
        riskFactors.push('Equipment over 3 years old')
      }

      // Calibration compliance risk
      const overdueCalibrations = calibrations.filter(cal => 
        cal.dueDate && new Date() > cal.dueDate && cal.status !== 'COMPLETED'
      ).length
      
      if (overdueCalibrations > 0) {
        riskScore += overdueCalibrations * 20
        riskFactors.push(`${overdueCalibrations} overdue calibrations`)
      }

      // Maintenance history risk
      const recentIssues = maintenance.filter(maint => 
        maint.createdAt > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) &&
        maint.type === 'REPAIR'
      ).length
      
      if (recentIssues > 2) {
        riskScore += recentIssues * 15
        riskFactors.push(`${recentIssues} recent repairs`)
      }

      if (riskScore > 0) {
        risks.push({
          equipmentId: item.id,
          equipmentName: item.name,
          riskScore,
          riskLevel: riskScore > 50 ? 'HIGH' : riskScore > 25 ? 'MEDIUM' : 'LOW',
          riskFactors,
          recommendations: this.getRiskRecommendations(riskFactors)
        })
      }
    }

    return risks
  }

  private async optimizeCosts(equipment: any[]): Promise<any[]> {
    const optimizations = []

    for (const item of equipment) {
      const calibrations = item.calibrationRecords
      const maintenance = item.maintenanceRecords
      
      // Calculate cost per calibration
      const totalCalibrationCost = calibrations.reduce((sum, cal) => sum + (cal.cost || 0), 0)
      const avgCalibrationCost = calibrations.length > 0 ? totalCalibrationCost / calibrations.length : 0
      
      // Calculate maintenance costs
      const totalMaintenanceCost = maintenance.reduce((sum, maint) => sum + (maint.cost || 0), 0)
      
      // Identify optimization opportunities
      const optimizations = []
      
      if (avgCalibrationCost > 500) {
        optimizations.push({
          type: 'CALIBRATION_COST',
          description: 'High calibration costs detected',
          potentialSavings: avgCalibrationCost * 0.2,
          recommendation: 'Consider bulk calibration contracts'
        })
      }
      
      if (totalMaintenanceCost > totalCalibrationCost * 2) {
        optimizations.push({
          type: 'MAINTENANCE_COST',
          description: 'Maintenance costs exceed calibration costs',
          potentialSavings: totalMaintenanceCost * 0.15,
          recommendation: 'Implement preventive maintenance schedule'
        })
      }

      if (optimizations.length > 0) {
        optimizations.push({
          equipmentId: item.id,
          equipmentName: item.name,
          currentCosts: {
            calibration: avgCalibrationCost,
            maintenance: totalMaintenanceCost
          },
          optimizations
        })
      }
    }

    return optimizations
  }

  private async calculateCostSavings(labId: string): Promise<number> {
    // Calculate cost savings from prevented failures
    const preventedFailures = await this.prisma.maintenanceRecord.count({
      where: {
        equipment: { laboratoryId: labId },
        type: 'PREVENTIVE',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    // Estimate savings (simplified calculation)
    return preventedFailures * 2500 // Average cost of equipment failure
  }

  private async calculateCalibrationEfficiency(labId: string): Promise<number> {
    const calibrations = await this.prisma.calibrationRecord.findMany({
      where: {
        equipment: { laboratoryId: labId },
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    if (calibrations.length === 0) return 0

    const onTimeCalibrations = calibrations.filter(cal => 
      cal.dueDate && cal.performedDate && cal.performedDate <= cal.dueDate
    ).length

    return (onTimeCalibrations / calibrations.length) * 100
  }

  private async calculateComplianceRate(labId: string): Promise<number> {
    const [totalEquipment, compliantEquipment] = await Promise.all([
      this.prisma.equipment.count({
        where: { laboratoryId: labId }
      }),
      this.prisma.equipment.count({
        where: {
          laboratoryId: labId,
          status: 'ACTIVE'
        }
      })
    ])

    return totalEquipment > 0 ? (compliantEquipment / totalEquipment) * 100 : 0
  }

  private getRiskRecommendations(riskFactors: string[]): string[] {
    const recommendations = []
    
    if (riskFactors.some(factor => factor.includes('overdue'))) {
      recommendations.push('Implement automated calibration reminders')
    }
    
    if (riskFactors.some(factor => factor.includes('repairs'))) {
      recommendations.push('Schedule preventive maintenance')
    }
    
    if (riskFactors.some(factor => factor.includes('years old'))) {
      recommendations.push('Consider equipment replacement')
    }
    
    return recommendations
  }

  private getStartDate(period: string): Date {
    const now = new Date()
    
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate())
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1)
      case 'quarter':
        return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1)
    }
  }

  // Placeholder methods for data export
  private async exportToCSV(data: any[], dataType: string): Promise<string> {
    // Implementation for CSV export
    return 'csv_data'
  }

  private async exportToPDF(data: any[], dataType: string): Promise<Buffer> {
    // Implementation for PDF export
    return Buffer.from('pdf_data')
  }

  private async exportToExcel(data: any[], dataType: string): Promise<Buffer> {
    // Implementation for Excel export
    return Buffer.from('excel_data')
  }

  // Placeholder methods for compliance reporting
  private async getComplianceSummary(labId: string, framework: string): Promise<any> {
    return { framework, status: 'COMPLIANT', score: 95 }
  }

  private async getComplianceDetails(labId: string, framework: string): Promise<any> {
    return { details: 'Compliance details' }
  }

  private async getComplianceRecommendations(labId: string, framework: string): Promise<any> {
    return { recommendations: ['Implement additional controls'] }
  }

  // Placeholder methods for performance analytics
  private async getEquipmentPerformance(labId: string, startDate: Date): Promise<any> {
    return { performance: 'Equipment performance data' }
  }

  private async getCalibrationEfficiency(labId: string, startDate: Date): Promise<any> {
    return { efficiency: 'Calibration efficiency data' }
  }

  private async getCostAnalysis(labId: string, startDate: Date): Promise<any> {
    return { costs: 'Cost analysis data' }
  }

  private async getComplianceTrends(labId: string, startDate: Date): Promise<any> {
    return { trends: 'Compliance trends data' }
  }

  private async getUserActivity(labId: string, startDate: Date): Promise<any> {
    return { activity: 'User activity data' }
  }

  // Placeholder methods for predictive analytics
  private async getPredictiveMaintenance(labId: string): Promise<any[]> {
    return []
  }

  private async getRiskAssessment(labId: string): Promise<any[]> {
    return []
  }

  private async getTrends(labId: string): Promise<any[]> {
    return []
  }

  // Placeholder method for report query execution
  private async executeReportQuery(query: string, parameters: any): Promise<any> {
    return { data: 'Report data' }
  }

  // Placeholder method for data export
  private async getDataForExport(labId: string, dataType: string, filters: any): Promise<any[]> {
    return []
  }
} 