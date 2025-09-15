import { Router } from 'express'

import { LeadsController } from './controllers/LeadsController.js'
import { GroupsController } from './controllers/GroupsController.js'
import { CampaignsController } from './controllers/CampaignsController.js'

const router = Router()

const leadsController = new LeadsController()
const groupsController = new GroupsController()
const campaignsController = new CampaignsController()

// leads routes
router.get('/leads', leadsController.index)
router.post('/leads', leadsController.create)
router.get('/leads/:id', leadsController.show)
router.put('/leads/:id', leadsController.update)
router.delete('/leads/:id', leadsController.delete)

// groups routes
router.get('/groups', groupsController.index)
router.post('/groups', groupsController.create)
router.get('/groups/:id', groupsController.show)
router.put('/groups/:id', groupsController.update)
router.delete('/groups/:id', groupsController.delete)

// campaigns routes
router.get('/campaigns', campaignsController.index)
router.post('/campaigns', campaignsController.create)
router.get('/campaigns/:id', campaignsController.show)

// status route
router.get('/status', (req, res) => {
    res.json({ message: 'OK!' })
})

export { router }
