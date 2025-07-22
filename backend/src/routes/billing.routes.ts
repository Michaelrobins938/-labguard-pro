import { Router } from 'express'

const router = Router()

// TODO: Implement billing routes
router.get('/subscription', (req, res) => {
  res.json({ message: 'Get subscription - to be implemented' })
})

router.post('/webhook', (req, res) => {
  res.json({ message: 'Stripe webhook - to be implemented' })
})

export default router 