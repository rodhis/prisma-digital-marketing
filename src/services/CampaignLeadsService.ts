import { HttpError } from '../errors/HttpError.js'
import type { CampaignsRepository, LeadCampaignStatus } from '../repositories/CampaignsRepository.js'
import type { LeadsRepository, LeadWhereParams } from '../repositories/LeadsRepository.js'

interface GetCampaignLeadsParams {
    campaignId: number
    page?: number
    pageSize?: number
    name?: string
    status?: LeadCampaignStatus
    sortBy?: 'name' | 'createdAt'
    order?: 'asc' | 'desc'
}

export class CampaignLeadsService {
    constructor(
        private readonly campaignsRepository: CampaignsRepository,
        private readonly leadsRepository: LeadsRepository
    ) {}

    async getCampaignLeads(params: GetCampaignLeadsParams) {
        const {
            campaignId,
            page = 1,
            pageSize = 10,
            name,
            status = 'NEW',
            sortBy = 'name',
            order = 'asc',
        } = params

        const limit = pageSize
        const offset = (page - 1) * limit

        const where: LeadWhereParams = { campaignId, campaignStatus: status }

        if (name) where.name = { like: name, mode: 'insensitive' }

        const leads = await this.leadsRepository.find({
            where,
            sortBy,
            order,
            limit,
            offset,
            include: { groups: true, campaigns: true },
        })

        const total = await this.leadsRepository.count(where)

        return {
            data: leads,
            meta: {
                page,
                pageSize: limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async addLeadToCampaign(campaignId: number, leadId: number, status: LeadCampaignStatus = 'NEW') {
        const campaign = await this.campaignsRepository.findById(campaignId)
        const lead = await this.leadsRepository.findById(leadId)

        if (!campaign) {
            throw new HttpError(404, `Campaign with id ${campaignId} not found`)
        }

        if (!lead) {
            throw new HttpError(404, `Lead with id ${leadId} not found`)
        }

        const existingAssociation = await this.campaignsRepository.findLeadCampaignAssociation(
            campaignId,
            leadId
        )

        if (existingAssociation) {
            throw new HttpError(409, 'Lead is already associated with this campaign')
        }

        await this.campaignsRepository.addLead({
            leadId,
            campaignId,
            status,
        })

        return { message: 'Lead added to campaign successfully' }
    }

    async updateLeadStatusInCampaign(campaignId: number, leadId: number, status: LeadCampaignStatus) {
        const campaign = await this.campaignsRepository.findById(campaignId)
        const lead = await this.leadsRepository.findById(leadId)

        if (!campaign) {
            throw new HttpError(404, `Campaign with id ${campaignId} not found`)
        }

        if (!lead) {
            throw new HttpError(404, `Lead with id ${leadId} not found`)
        }

        const existingAssociation = await this.campaignsRepository.findLeadCampaignAssociation(
            campaignId,
            leadId
        )

        if (!existingAssociation) {
            throw new HttpError(404, 'Lead is not associated with this campaign')
        }

        const updatedLeadCampaign = await this.campaignsRepository.updateLeadStatus({
            leadId,
            campaignId,
            status,
        })

        return updatedLeadCampaign
    }

    async removeLeadFromCampaign(campaignId: number, leadId: number) {
        if (isNaN(campaignId) || isNaN(leadId)) {
            throw new HttpError(400, 'Invalid campaign or lead.')
        }

        const existingAssociation = await this.campaignsRepository.findLeadCampaignAssociation(
            campaignId,
            leadId
        )

        if (!existingAssociation) {
            throw new HttpError(404, 'Lead is not associated with this campaign')
        }

        const deletedLead = await this.campaignsRepository.removeLead(campaignId, leadId)

        return {
            message: 'Lead removed from campaign successfully',
            deletedLead,
        }
    }
}
