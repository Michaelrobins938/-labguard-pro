import { Router } from 'express'

const router = Router()

// TODO: Implement authentication routes
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' })
})

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - to be implemented' })
})

router.post('/refresh', (req, res) => {
  res.json({ message: 'Refresh token endpoint - to be implemented' })
})

export default router 