import type { Handler } from 'express'
import type { Prisma } from '@prisma/client'

import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchemas.js'
import { AddLeadtoGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import prisma from '../database/index.js'
import { HttpError } from '../errors/HttpError.js'

export class GroupLeadsController {
    getLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            if (!groupId) {
                throw new HttpError(400, 'Group does not exist.')
            }
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const pageNumber = +page
            const pageSizeNumber = +pageSize

            const where: Prisma.LeadWhereInput = {
                groups: {
                    some: { id: groupId },
                },
            }

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {
                    [sortBy]: order,
                },
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    groups: true,
                },
            })

            const totalLeads = await prisma.lead.count({ where })

            res.json({
                leads,
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
            const groupId = Number(req.params.groupId)
            const body = AddLeadtoGroupRequestSchema.parse(req.body)

            const existingGroup = await prisma.group.findUnique({
                where: { id: groupId },
            })
            if (!existingGroup) {
                throw new HttpError(400, 'Group does not exist.')
            }

            const existingLead = await prisma.lead.findUnique({
                where: { id: body.leadId },
            })
            if (!existingLead) {
                throw new HttpError(400, 'Lead does not exist.')
            }

            const updatedGroup = await prisma.group.update({
                where: { id: groupId },
                data: {
                    leads: {
                        connect: { id: body.leadId },
                    },
                },
                include: { leads: true },
            })

            res.status(201).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
    removeLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const leadId = Number(req.params.leadId)

            const existingGroup = await prisma.group.findUnique({
                where: { id: groupId },
            })
            if (!existingGroup) {
                throw new HttpError(400, 'Group does not exist.')
            }

            const existingLead = await prisma.lead.findUnique({
                where: { id: leadId },
            })
            if (!existingLead) {
                throw new HttpError(400, 'Lead does not exist.')
            }

            const updatedGroup = await prisma.group.update({
                where: { id: groupId },
                data: {
                    leads: {
                        disconnect: { id: leadId },
                    },
                },
                include: { leads: true },
            })

            res.status(200).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
}
