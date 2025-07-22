import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth.middleware'
import { equipmentValidation } from '../utils/validators'
import { ApiError, createApiError } from '../utils/errors'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export const equipmentController = {
  // GET /api/equipment - List all equipment for laboratory
  async getEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, status, type, search } = req.query
      const offset = (Number(page) - 1) * Number(limit)

      const where: any = {
        laboratoryId: req.user.laboratoryId,
        deletedAt: null
      }

      if (status) {
        where.status = status
      }

      if (type) {
        where.equipmentType = type
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { model: { contains: search as string, mode: 'insensitive' } },
          { serialNumber: { contains: search as string, mode: 'insensitive' } },
          { manufacturer: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const [equipment, total] = await Promise.all([
        prisma.equipment.findMany({
          where,
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            },
            calibrationRecords: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                status: true,
                complianceStatus: true,
                dueDate: true,
                performedDate: true
              }
            },
            _count: {
              select: {
                calibrationRecords: true,
                maintenanceRecords: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: Number(limit)
        }),
        prisma.equipment.count({ where })
      ])

      res.json({
        data: equipment,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      next(error)
    }
  },

  // GET /api/equipment/:id - Get equipment by ID
  async getEquipmentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const equipment = await prisma.equipment.findFirst({
        where: {
          id,
          laboratoryId: req.user.laboratoryId,
          deletedAt: null
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          calibrationRecords: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
              performedBy: {
                select: { id: true, name: true, email: true }
              },
              template: {
                select: { id: true, name: true, category: true }
              }
            }
          },
          maintenanceRecords: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })

      if (!equipment) {
        throw createApiError.notFound('Equipment not found')
      }

      res.json({ data: equipment })
    } catch (error) {
      next(error)
    }
  },

  // POST /api/equipment - Create new equipment
  async createEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = equipmentValidation.create.parse(req.body)

      // Check for duplicate serial number in same laboratory
      const existingEquipment = await prisma.equipment.findFirst({
        where: {
          serialNumber: validatedData.serialNumber,
          laboratoryId: req.user.laboratoryId,
          deletedAt: null
        }
      })

      if (existingEquipment) {
        throw createApiError.conflict('Equipment with this serial number already exists')
      }

      const equipment = await prisma.equipment.create({
        data: {
          ...validatedData,
          laboratoryId: req.user.laboratoryId,
          createdById: req.user.id,
          installDate: validatedData.installDate ? new Date(validatedData.installDate) : null,
          warrantyExpiry: validatedData.warrantyExpiry ? new Date(validatedData.warrantyExpiry) : null
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      logger.info(`Equipment created: ${equipment.id} by user ${req.user.id}`)

      res.status(201).json({
        message: 'Equipment created successfully',
        data: equipment
      })
    } catch (error) {
      next(error)
    }
  },

  // PUT /api/equipment/:id - Update equipment
  async updateEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const validatedData = equipmentValidation.update.parse(req.body)

      // Check equipment exists and belongs to laboratory
      const existingEquipment = await prisma.equipment.findFirst({
        where: {
          id,
          laboratoryId: req.user.laboratoryId,
          deletedAt: null
        }
      })

      if (!existingEquipment) {
        throw createApiError.notFound('Equipment not found')
      }

      // Check for duplicate serial number if being updated
      if (validatedData.serialNumber && validatedData.serialNumber !== existingEquipment.serialNumber) {
        const duplicateCheck = await prisma.equipment.findFirst({
          where: {
            serialNumber: validatedData.serialNumber,
            laboratoryId: req.user.laboratoryId,
            deletedAt: null,
            NOT: { id }
          }
        })

        if (duplicateCheck) {
          throw createApiError.conflict('Equipment with this serial number already exists')
        }
      }

      const equipment = await prisma.equipment.update({
        where: { id },
        data: {
          ...validatedData,
          installDate: validatedData.installDate ? new Date(validatedData.installDate) : undefined,
          warrantyExpiry: validatedData.warrantyExpiry ? new Date(validatedData.warrantyExpiry) : undefined,
          updatedAt: new Date()
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      logger.info(`Equipment updated: ${equipment.id} by user ${req.user.id}`)

      res.json({
        message: 'Equipment updated successfully',
        data: equipment
      })
    } catch (error) {
      next(error)
    }
  },

  // DELETE /api/equipment/:id - Soft delete equipment
  async deleteEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      // Check equipment exists and belongs to laboratory
      const equipment = await prisma.equipment.findFirst({
        where: {
          id,
          laboratoryId: req.user.laboratoryId,
          deletedAt: null
        }
      })

      if (!equipment) {
        throw createApiError.notFound('Equipment not found')
      }

      // Soft delete
      await prisma.equipment.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      })

      logger.info(`Equipment deleted: ${id} by user ${req.user.id}`)

      res.json({
        message: 'Equipment deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  },

  // GET /api/equipment/:id/status - Get equipment compliance status
  async getEquipmentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const equipment = await prisma.equipment.findFirst({
        where: {
          id,
          laboratoryId: req.user.laboratoryId,
          deletedAt: null
        },
        include: {
          calibrationRecords: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      if (!equipment) {
        throw createApiError.notFound('Equipment not found')
      }

      const latestCalibration = equipment.calibrationRecords[0]
      const now = new Date()

      let complianceStatus = 'UNKNOWN'
      let daysSinceLast = null
      let daysUntilDue = null

      if (latestCalibration) {
        if (latestCalibration.performedDate) {
          daysSinceLast = Math.floor((now.getTime() - latestCalibration.performedDate.getTime()) / (1000 * 60 * 60 * 24))
        }
        
        daysUntilDue = Math.floor((latestCalibration.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysUntilDue < 0) {
          complianceStatus = 'OVERDUE'
        } else if (daysUntilDue <= 7) {
          complianceStatus = 'DUE_SOON'
        } else if (latestCalibration.complianceStatus === 'COMPLIANT') {
          complianceStatus = 'COMPLIANT'
        } else if (latestCalibration.complianceStatus === 'NON_COMPLIANT') {
          complianceStatus = 'NON_COMPLIANT'
        } else {
          complianceStatus = 'PENDING'
        }
      } else {
        complianceStatus = 'NO_CALIBRATION'
      }

      res.json({
        data: {
          equipmentId: id,
          status: equipment.status,
          complianceStatus,
          daysSinceLast,
          daysUntilDue,
          latestCalibration: latestCalibration ? {
            id: latestCalibration.id,
            status: latestCalibration.status,
            complianceStatus: latestCalibration.complianceStatus,
            dueDate: latestCalibration.dueDate,
            performedDate: latestCalibration.performedDate
          } : null
        }
      })
    } catch (error) {
      next(error)
    }
  }
} 