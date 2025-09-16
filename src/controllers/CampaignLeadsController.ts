import type { Handler } from 'express'
import type { Prisma } from '@prisma/client'

import { GetCampaignLeadsRequestSchema } from './schemas/CampaignsRequestSchemas.js'
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
        } catch (error) {
            next(error)
        }
    }
    updateLeadStatus: Handler = async (req, res, next) => {
        try {
        } catch (error) {
            next(error)
        }
    }
    removeLead: Handler = async (req, res, next) => {
        try {
        } catch (error) {
            next(error)
        }
    }
}
