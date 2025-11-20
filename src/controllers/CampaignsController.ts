import type { Handler } from 'express'

import {
    CreateCampaignRequestSchema,
    UpdateCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import type { CampaignsService } from '../services/CampaignsService.js'
import type { CreateCampaignAttributes } from '../repositories/CampaignsRepository.js'

export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) {}
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await this.campaignsService.getAllCampaigns()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)
            const newCampaign = await this.campaignsService.createCampaign({
                name: body.name,
                description: body.description,
                startDate: body.startDate,
                ...(body.endDate !== undefined && { endDate: body.endDate }),
            })
            res.status(201).json(newCampaign)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const campaign = await this.campaignsService.getCampaignById(Number(req.params.id))
            res.json(campaign)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateCampaignRequestSchema.parse(req.body)

            const campaignData: Partial<CreateCampaignAttributes> = {}

            if (body.name !== undefined) {
                campaignData.name = body.name
            }
            if (body.description !== undefined) {
                campaignData.description = body.description
            }
            if (body.startDate !== undefined) {
                campaignData.startDate = body.startDate
            }
            if (body.endDate !== undefined && body.endDate !== null) {
                campaignData.endDate = body.endDate
            }

            const updatedCampaign = await this.campaignsService.updateCampaign(id, campaignData)

            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const deletedCampaign = await this.campaignsService.deleteCampaign(id)

            res.json(deletedCampaign)
        } catch (error) {
            next(error)
        }
    }
}
