import type { Handler } from 'express'
import {
    CreateCampaignRequestSchema,
    UpdateCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import prisma from '../database/index.js'
import { de } from 'zod/locales'

export class CampaignsController {
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await prisma.campaign.findMany({
                include: {
                    leads: {
                        include: {
                            lead: true,
                        },
                    },
                },
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
                include: {
                    leads: {
                        include: {
                            lead: true,
                        },
                    },
                },
            })
            if (!campaign) {
                return res.status(404).json({ message: 'Campaign not found' })
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
            const existingCampaign = await prisma.campaign.findUnique({
                where: { id },
            })
            if (!existingCampaign) {
                return res.status(404).json({ message: 'Campaign not found' })
            }
            const campaignData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.startDate !== undefined && { startDate: body.startDate }),
                ...(body.endDate !== undefined && { endDate: body.endDate }),
            }

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: campaignData,
            })
            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const existingCampaign = await prisma.campaign.findUnique({
                where: { id },
            })
            if (!existingCampaign) {
                return res.status(404).json({ message: 'Campaign not found' })
            }
            const deletedCampaign = await prisma.campaign.delete({
                where: { id },
            })
            res.json(deletedCampaign)
        } catch (error) {
            next(error)
        }
    }
}
