import { Router } from 'express'
import {
    campaignLeadsController,
    campaignsController,
    groupsController,
    groupsLeadsController,
    leadsController,
} from './instancesContainer.js'

const router = Router()

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

// groupleads routes
router.get('/groups/:groupId/leads', groupsLeadsController.getLeads)
router.post('/groups/:groupId/leads', groupsLeadsController.addLead)
router.delete('/groups/:groupId/leads/:leadId', groupsLeadsController.removeLead)

// campaigns routes
router.get('/campaigns', campaignsController.index)
router.post('/campaigns', campaignsController.create)
router.get('/campaigns/:id', campaignsController.show)
router.put('/campaigns/:id', campaignsController.update)
router.delete('/campaigns/:id', campaignsController.delete)

// campaignleads routes
router.get('/campaigns/:campaignId/leads/', campaignLeadsController.getLeads)
router.post('/campaigns/:campaignId/leads/', campaignLeadsController.addLead)
router.put('/campaigns/:campaignId/leads/:leadId', campaignLeadsController.updateLeadStatus)
router.delete('/campaigns/:campaignId/leads/:leadId', campaignLeadsController.removeLead)

// status route
router.get('/status', (req, res) => {
    res.json({ message: 'OK!' })
})

export { router }
