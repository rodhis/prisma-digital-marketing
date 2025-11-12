import { LeadsController } from './controllers/LeadsController.js'
import { GroupsController } from './controllers/GroupsController.js'
import { CampaignsController } from './controllers/CampaignsController.js'
import { CampaignLeadsController } from './controllers/CampaignLeadsController.js'
import { GroupLeadsController } from './controllers/GroupLeadsController.js'
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository.js'

// repositories
const leadsRepository = new PrismaLeadsRepository

// controllers instances
export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController()
export const campaignsController = new CampaignsController()
export const campaignLeadsController = new CampaignLeadsController()
export const groupsLeadsController = new GroupLeadsController()