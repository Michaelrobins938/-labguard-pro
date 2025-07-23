import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()
const prisma = new PrismaClient()

// Get all reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, equipmentId } = req.query
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Build where clause
    const where: any = {
      laboratoryId: user.laboratoryId
    }

    if (type) where.type = type
    if (status) where.status = status
    if (equipmentId) where.equipmentId = equipmentId

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Get reports with pagination
    const reports = await prisma.report.findMany({
      where,
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take
    })

    // Get total count
    const total = await prisma.report.count({ where })

    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Reports fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single report
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    const report = await prisma.report.findFirst({
      where: {
        id,
        laboratoryId: user.laboratoryId
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            type: true,
            location: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        attachments: true
      }
    })

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({ report })
  } catch (error) {
    console.error('Report fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const {
      title,
      description,
      type,
      equipmentId,
      findings,
      recommendations,
      attachments
    } = req.body

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Title, description, and type are required' })
    }

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        title,
        description,
        type,
        equipmentId,
        findings,
        recommendations,
        status: 'DRAFT',
        laboratoryId: user.laboratoryId,
        createdById: userId,
        attachments: attachments ? JSON.stringify(attachments) : null
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Report created successfully',
      report
    })
  } catch (error) {
    console.error('Report creation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update report
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId
    const {
      title,
      description,
      findings,
      recommendations,
      status,
      attachments
    } = req.body

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Check if report exists and belongs to user's laboratory
    const existingReport = await prisma.report.findFirst({
      where: {
        id,
        laboratoryId: user.laboratoryId
      }
    })

    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        title,
        description,
        findings,
        recommendations,
        status,
        attachments: attachments ? JSON.stringify(attachments) : existingReport.attachments,
        updatedAt: new Date()
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.json({
      message: 'Report updated successfully',
      report: updatedReport
    })
  } catch (error) {
    console.error('Report update error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete report
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Check if report exists and belongs to user's laboratory
    const existingReport = await prisma.report.findFirst({
      where: {
        id,
        laboratoryId: user.laboratoryId
      }
    })

    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Delete report
    await prisma.report.delete({
      where: { id }
    })

    res.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Report deletion error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Generate report PDF
router.post('/:id/generate-pdf', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Get report
    const report = await prisma.report.findFirst({
      where: {
        id,
        laboratoryId: user.laboratoryId
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            type: true,
            location: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // TODO: Implement PDF generation logic
    // For now, return a mock PDF URL
    const pdfUrl = `/api/reports/${id}/pdf`

    res.json({
      message: 'PDF generated successfully',
      pdfUrl
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get report statistics
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId

    // Get user's laboratory
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { laboratoryId: true }
    })

    if (!user?.laboratoryId) {
      return res.status(403).json({ error: 'No laboratory access' })
    }

    // Get report statistics
    const [
      totalReports,
      draftReports,
      completedReports,
      pendingReports,
      reportsByType
    ] = await Promise.all([
      prisma.report.count({
        where: { laboratoryId: user.laboratoryId }
      }),
      prisma.report.count({
        where: { 
          laboratoryId: user.laboratoryId,
          status: 'DRAFT'
        }
      }),
      prisma.report.count({
        where: { 
          laboratoryId: user.laboratoryId,
          status: 'COMPLETED'
        }
      }),
      prisma.report.count({
        where: { 
          laboratoryId: user.laboratoryId,
          status: 'PENDING'
        }
      }),
      prisma.report.groupBy({
        by: ['type'],
        where: { laboratoryId: user.laboratoryId },
        _count: {
          type: true
        }
      })
    ])

    res.json({
      stats: {
        total: totalReports,
        draft: draftReports,
        completed: completedReports,
        pending: pendingReports,
        byType: reportsByType.map(item => ({
          type: item.type,
          count: item._count.type
        }))
      }
    })
  } catch (error) {
    console.error('Report stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 