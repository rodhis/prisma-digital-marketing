import type { Handler } from 'express'
import prisma from '../database/index.js'
import { CreateLeadRequestSchema, UpdateLeadRequestSchema } from './schemas/LeadsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const leads = await prisma.lead.findMany()
            res.json(leads)
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

            const leadData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.email !== undefined && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }

            const updatedLead = await prisma.lead.update({
                where: { id: Number(req.params.id) },
                data: leadData,
            })
            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            await prisma.lead.delete({
                where: { id: Number(req.params.id) },
            })
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
