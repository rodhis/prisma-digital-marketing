import type { Handler } from 'express'

import {
    CreateCampaignRequestSchema,
    UpdateCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import type { CampaignsRepository, CreateCampaignAttributes } from '../repositories/CampaignsRepository.js'

export class CampaignsController {
    constructor(private readonly campaignRepository: CampaignsRepository) {}
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await this.campaignRepository.find()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)
            const newCampaign = await this.campaignRepository.create({
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
            const campaign = await this.campaignRepository.findById(Number(req.params.id))
            if (!campaign) {
                throw new HttpError(404, 'Campaign not found')
            }
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

            const updatedCampaign = await this.campaignRepository.updateById(id, campaignData)

            if (!updatedCampaign) throw new HttpError(404, 'Campaign not found')

            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const deletedCampaign = await this.campaignRepository.deleteById(id)

            if (!deletedCampaign) throw new HttpError(404, 'Campaign not found')

            res.json(deletedCampaign)
        } catch (error) {
            next(error)
        }
    }
}
