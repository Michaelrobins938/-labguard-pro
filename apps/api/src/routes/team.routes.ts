import { Router } from 'express'
import { teamController } from '../controllers/team.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Team dashboard and overview
router.get('/', authMiddleware, teamController.getTeamDashboard)
router.get('/overview', authMiddleware, teamController.getTeamOverview)

// User management
router.get('/users', authMiddleware, teamController.getTeamUsers)
router.get('/users/:id', authMiddleware, teamController.getUserById)
router.put('/users/:id', authMiddleware, teamController.updateUser)
router.delete('/users/:id', authMiddleware, teamController.deactivateUser)
router.post('/users/:id/reactivate', authMiddleware, teamController.reactivateUser)

// User invitations
router.get('/invitations', authMiddleware, teamController.getInvitations)
router.post('/invitations', authMiddleware, teamController.createInvitation)
router.put('/invitations/:id', authMiddleware, teamController.updateInvitation)
router.delete('/invitations/:id', authMiddleware, teamController.cancelInvitation)
router.post('/invitations/:id/resend', authMiddleware, teamController.resendInvitation)

// Team activities
router.get('/activities', authMiddleware, teamController.getTeamActivities)
router.get('/activities/:id', authMiddleware, teamController.getActivityById)
router.post('/activities', authMiddleware, teamController.createActivity)

// Assignments
router.get('/assignments', authMiddleware, teamController.getAssignments)
router.get('/assignments/:id', authMiddleware, teamController.getAssignmentById)
router.post('/assignments', authMiddleware, teamController.createAssignment)
router.put('/assignments/:id', authMiddleware, teamController.updateAssignment)
router.delete('/assignments/:id', authMiddleware, teamController.deleteAssignment)
router.post('/assignments/:id/complete', authMiddleware, teamController.completeAssignment)
router.post('/assignments/:id/start', authMiddleware, teamController.startAssignment)

// User profiles
router.get('/profiles/:userId', authMiddleware, teamController.getUserProfile)
router.put('/profiles/:userId', authMiddleware, teamController.updateUserProfile)

// Team settings
router.get('/settings', authMiddleware, teamController.getTeamSettings)
router.put('/settings', authMiddleware, teamController.updateTeamSettings)

// Performance analytics
router.get('/analytics', authMiddleware, teamController.getTeamAnalytics)
router.get('/analytics/users/:userId', authMiddleware, teamController.getUserAnalytics)

// Bulk operations
router.post('/users/bulk', authMiddleware, teamController.bulkUpdateUsers)
router.post('/assignments/bulk', authMiddleware, teamController.bulkCreateAssignments)

export default router 