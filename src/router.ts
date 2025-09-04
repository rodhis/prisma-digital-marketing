import { Router } from 'express'
import { LeadsController } from './controllers/LeadsController.js'

const router = Router()

// leads routes
const leadsController = new LeadsController()

router.get('/leads', leadsController.index)


// status route
router.get('/status', (req, res) => {
    res.json({ message: 'OK!' })
})

export { router }
