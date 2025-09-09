import type { Handler } from 'express'
import type { Prisma } from '@prisma/client'

import {
    CreateLeadRequestSchema,
    GetLeadsRequestSchema,
    UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import { LeadsModel } from '../models/LeadsModel.js'

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const where: Prisma.LeadWhereInput = {}

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await LeadsModel.findMany(
                where,
                {
                    [sortBy]: order,
                },
                (+page - 1) * +pageSize,
                +pageSize
            )

            const totalLeads = await LeadsModel.count(where)
            const totalPages = Math.ceil(totalLeads / +pageSize)
            res.json({
                data: leads,
                meta: { totalLeads, page: +page, pageSize: +pageSize, totalPages },
            })
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateLeadRequestSchema.parse(req.body)
            const leadData = {
                name: body.name,
                email: body.email,
                phone: body.phone ?? null,
                ...(body.status !== undefined && { status: body.status }),
            }
            const newLead = await LeadsModel.create(leadData)
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const lead = await LeadsModel.findUnique(
                { id: Number(req.params.id) },
                {
                    groups: true,
                    campaigns: true,
                }
            )
            if (!lead) {
                throw new HttpError(404, 'Lead not found')
            }
            res.json(lead)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const body = UpdateLeadRequestSchema.parse(req.body)
            const id = Number(req.params.id)
            const existingLead = await LeadsModel.findUnique({ id })
            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }
            const leadData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.email !== undefined && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }

            const updatedLead = await LeadsModel.update({ id }, leadData)
            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const existingLead = await LeadsModel.findUnique({ id })
            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }
            const deletedLead = await LeadsModel.delete({ id })
            res.json({ deletedLead })
        } catch (error) {
            next(error)
        }
    }
}
