import { Router } from 'express'
import { LeadsController } from './controllers/LeadsController.js'

const router = Router()

// leads routes
const leadsController = new LeadsController()

router.get('/leads', leadsController.index)
router.post('/leads', leadsController.create)
router.get('/leads/:id', leadsController.show)

// status route
router.get('/status', (req, res) => {
    res.json({ message: 'OK!' })
})

export { router }
