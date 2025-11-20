import type { Handler } from 'express'

import {
    AddLeadToCampaignRequestSchema,
    GetCampaignLeadsRequestSchema,
    UpdateLeadStatusInCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import type { CampaignLeadsService } from '../services/CampaignLeadsService.js'

export class CampaignLeadsController {
    constructor(private readonly campaignLeadsService: CampaignLeadsService) {}

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

            const result = await this.campaignLeadsService.getCampaignLeads({
                campaignId,
                page: +page,
                pageSize: +pageSize,
                ...(name !== undefined && { name }),
                status,
                sortBy,
                order,
            })

            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    addLead: Handler = async (req, res, next) => {
        try {
            const { leadId, status = 'NEW' } = AddLeadToCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)

            const result = await this.campaignLeadsService.addLeadToCampaign(campaignId, leadId, status)

            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try {
            const { status } = UpdateLeadStatusInCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)
            const leadId = Number(req.params.leadId)

            const updatedLeadCampaign = await this.campaignLeadsService.updateLeadStatusInCampaign(
                campaignId,
                leadId,
                status
            )

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

            const result = await this.campaignLeadsService.removeLeadFromCampaign(campaignId, leadId)

            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}
