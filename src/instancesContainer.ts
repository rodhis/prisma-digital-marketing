import { LeadsController } from './controllers/LeadsController.js'
import { GroupsController } from './controllers/GroupsController.js'
import { CampaignsController } from './controllers/CampaignsController.js'
import { CampaignLeadsController } from './controllers/CampaignLeadsController.js'
import { GroupLeadsController } from './controllers/GroupLeadsController.js'
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository.js'
import { PrismaGroupsRepository } from './repositories/prisma/PrismaGroupsRepository.js'
import { PrismaCampaignsRepository } from './repositories/prisma/PrismaCampaignsRepository.js'
import { LeadsService } from './services/LeadsService.js'
import { GroupsService } from './services/GroupsService.js'
import { CampaignsService } from './services/CampaignsService.js'

// repositories
const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()
const campaignsRepository = new PrismaCampaignsRepository()

//services
const leadsService = new LeadsService(leadsRepository)
const groupsService = new GroupsService(groupsRepository)
const campaignsService = new CampaignsService(campaignsRepository)

// controllers instances
export const leadsController = new LeadsController(leadsService)
export const groupsController = new GroupsController(groupsService)
export const groupsLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
export const campaignsController = new CampaignsController(campaignsService)
export const campaignLeadsController = new CampaignLeadsController(campaignsRepository, leadsRepository)
