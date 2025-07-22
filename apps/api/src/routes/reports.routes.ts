import { Router } from 'express'

const router = Router()

// TODO: Implement reports routes
router.get('/', (req, res) => {
  res.json({ message: 'List reports - to be implemented' })
})

router.post('/', (req, res) => {
  res.json({ message: 'Create report - to be implemented' })
})

export default router 