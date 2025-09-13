import type { Handler } from 'express'
import type { Prisma } from '@prisma/client'

import prisma from '../database/index.js'
import {
    CreateLeadRequestSchema,
    GetLeadsRequestSchema,
    UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'id', order = 'asc' } = query

            const where: Prisma.LeadWhereInput = {}

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {
                    [sortBy]: order,
                },
                skip: (+page - 1) * +pageSize,
                take: +pageSize,
            })

            const totalLeads = await prisma.lead.count({ where })
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
            const newLead = await prisma.lead.create({
                data: leadData,
            })
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const lead = await prisma.lead.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    groups: true,
                    campaigns: true,
                },
            })
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
            const existingLead = await prisma.lead.findUnique({
                where: { id },
            })
            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }
            const leadData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.email !== undefined && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }

            const updatedLead = await prisma.lead.update({
                where: { id },
                data: leadData,
            })
            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const existingLead = await prisma.lead.findUnique({
                where: { id },
            })
            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }
            const deletedLead = await prisma.lead.delete({
                where: { id },
            })
            res.json({ deletedLead })
        } catch (error) {
            next(error)
        }
    }
}
