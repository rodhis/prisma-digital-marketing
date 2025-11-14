import { LeadsController } from './controllers/LeadsController.js'
import { GroupsController } from './controllers/GroupsController.js'
import { CampaignsController } from './controllers/CampaignsController.js'
import { CampaignLeadsController } from './controllers/CampaignLeadsController.js'
import { GroupLeadsController } from './controllers/GroupLeadsController.js'
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository.js'
import { PrismaGroupsRepository } from './repositories/prisma/PrismaGroupsRepository.js'
import { PrismaCampaignsRepository } from './repositories/prisma/PrismaCampaignsRepository.js'

// repositories
const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()
const campaignsRepository = new PrismaCampaignsRepository()

// controllers instances
export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController(groupsRepository)
export const groupsLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
export const campaignsController = new CampaignsController(campaignsRepository)
export const campaignLeadsController = new CampaignLeadsController()
