import type { Handler } from 'express'
import { CreateCampaignRequestSchema } from './schemas/CampaignsRequestSchemas.js'
import prisma from '../database/index.js'

export class CampaignsController {
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await prisma.campaign.findMany({
                include: { leads: {
                    include: {
                        lead: true,
                    }
                } },
            })
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)
            const newCampaign = await prisma.campaign.create({
                data: {
                    ...body,
                    endDate: body.endDate === undefined ? null : body.endDate,
                },
            })
            res.status(201).json(newCampaign)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id: Number(req.params.id) },
                include: { leads: {
                    include: {
                        lead: true,
                    }
                } },
            })
            if (!campaign) {
                return res.status(404).json({ message: 'Campaign not found' })
            }
            res.json(campaign)
        } catch (error) {
            next(error)
        }
    }
}
