import type { Handler } from 'express'
import type { Prisma } from '@prisma/client'

import {
    AddLeadToCampaignRequestSchema,
    GetCampaignLeadsRequestSchema,
    UpdateLeadStatusInCampaignRequestSchema,
} from './schemas/CampaignsRequestSchemas.js'
import prisma from '../database/index.js'
import { HttpError } from '../errors/HttpError.js'

export class CampaignLeadsController {
    getLeads: Handler = async (req, res, next) => {
        try {
            const campaignId = Number(req.params.campaignId)
            const query = GetCampaignLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const pageNumber = +page
            const pageSizeNumber = +pageSize

            const where: Prisma.LeadWhereInput = {
                campaigns: {
                    some: { campaignId },
                },
            }

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.campaigns = { some: { status } }

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {
                    [sortBy]: order,
                },
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    campaigns: {
                        select: {
                            campaignId: true,
                            leadId: true,
                            status: true,
                        },
                    },
                },
            })

            const totalLeads = await prisma.lead.count({ where })

            res.json({
                data: leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    totalLeads,
                    totalPages: Math.ceil(totalLeads / pageSizeNumber),
                },
            })
        } catch (error) {
            next(error)
        }
    }
    addLead: Handler = async (req, res, next) => {
        try {
            const body = AddLeadToCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)

            const campaign = await prisma.campaign.findUnique({
                where: { id: campaignId },
            })

            if (!campaign) {
                throw new HttpError(404, `Campaign with id ${campaignId} not found`)
            }

            const lead = await prisma.lead.findUnique({
                where: { id: body.leadId },
            })

            if (!lead) {
                throw new HttpError(404, `Lead with id ${body.leadId} not found`)
            }

            const existingAssociation = await prisma.leadCampaign.findUnique({
                where: {
                    leadId_campaignId: {
                        leadId: body.leadId,
                        campaignId: campaignId,
                    },
                },
            })

            if (existingAssociation) {
                throw new HttpError(409, 'Lead is already associated with this campaign')
            }
            await prisma.leadCampaign.create({
                data: {
                    campaignId: Number(req.params.campaignId),
                    leadId: body.leadId,
                    status: body.status === undefined ? 'NEW' : body.status,
                },
            })
            res.status(201).json({ message: 'Lead added to campaign successfully' })
        } catch (error) {
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try {
            const body = UpdateLeadStatusInCampaignRequestSchema.parse(req.body)
            const campaignId = Number(req.params.campaignId)
            const leadId = Number(req.params.leadId)

            const campaign = await prisma.campaign.findUnique({
                where: { id: campaignId },
            })

            if (!campaign) {
                throw new HttpError(404, `Campaign with id ${campaignId} not found`)
            }

            const lead = await prisma.lead.findUnique({
                where: { id: leadId },
            })

            if (!lead) {
                throw new HttpError(404, `Lead with id ${leadId} not found`)
            }

            const existingAssociation = await prisma.leadCampaign.findUnique({
                where: {
                    leadId_campaignId: {
                        leadId: leadId,
                        campaignId: campaignId,
                    },
                },
            })

            if (!existingAssociation) {
                throw new HttpError(404, 'Lead is not associated with this campaign')
            }

            const updatedLeadCampaign = await prisma.leadCampaign.update({
                data: body,
                where: {
                    leadId_campaignId: {
                        leadId: Number(req.params.leadId),
                        campaignId: Number(req.params.campaignId),
                    },
                },
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

        const existingAssociation = await prisma.leadCampaign.findUnique({
            where: {
                leadId_campaignId: {
                    leadId: leadId,
                    campaignId: campaignId,
                },
            },
        })

        if (!existingAssociation) {
            throw new HttpError(404, 'Lead is not associated with this campaign')
        }

        const deletedLead = await prisma.leadCampaign.delete({
            where: {
                leadId_campaignId: {
                    leadId: leadId,
                    campaignId: campaignId,
                },
            },
        })

        res.json({ 
            message: 'Lead removed from campaign successfully',
            deletedLead
        })
    } catch (error) {
        next(error)
    }
}
}
