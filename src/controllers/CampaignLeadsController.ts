import type { Handler } from 'express'

import {
    AddLeadToCampaignRequestSchema,
    GetCampaignLeadsRequestSchema,
    UpdateLeadStatusInCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import type { CampaignsRepository } from '../repositories/CampaignsRepository.js'
import type { LeadsRepository, LeadWhereParams } from '../repositories/LeadsRepository.js'

export class CampaignLeadsController {
    constructor(
        private readonly campaignsRepository: CampaignsRepository,
        private readonly leadsRepository: LeadsRepository
    ) {}
    getLeads: Handler = async (req, res, next) => {
        try {
            const campaignId = Number(req.params.campaignId)
            const query = GetCampaignLeadsRequestSchema.parse(req.query)
            const {
                page = '1',
                pageSize = '10',
                name,
                status = 'NEW',
                sortBy = 'name',
                order = 'asc',
            } = query

            const limit = +pageSize
            const offset = (+page - 1) * limit

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

            res.json({
                data: leads,
                meta: {
                    page: +page,
                    pageSize: limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            })
        } catch (error) {
            next(error)
        }
    }
    addLead: Handler = async (req, res, next) => {
        try {
            const { leadId, status = 'NEW' } = AddLeadToCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)

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

            res.status(201).json({ message: 'Lead added to campaign successfully' })
        } catch (error) {
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try {
            const { status } = UpdateLeadStatusInCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)
            const leadId = Number(req.params.leadId)

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
            res.status(200).json({ updatedLeadCampaign })
        } catch (error) {
            next(error)
        }
    }
    removeLead: Handler = async (req, res, next) => {
        try {
            req.body = {}
            const campaignId = Number(req.params.campaignId)
            const leadId = Number(req.params.leadId)

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

            res.json({
                message: 'Lead removed from campaign successfully',
                deletedLead,
            })
        } catch (error) {
            next(error)
        }
    }
}
