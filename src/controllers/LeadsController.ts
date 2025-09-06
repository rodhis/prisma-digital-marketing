import type { Handler } from 'express'
import prisma from '../database/index.js'
import { CreateLeadRequestSchema } from './schemas/LeadsRequestSchema.js'

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
}
