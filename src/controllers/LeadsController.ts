import type { Handler } from 'express'
import {
    CreateLeadRequestSchema,
    GetLeadsRequestSchema,
    UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchemas.js'
import type { LeadsService } from '../services/LeadsService.js'

export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query)

            const { page = '1', pageSize = '10', name, status, sortBy, order } = query

            const result = await this.leadsService.getAllLeadsPaginated({
                page: +page,
                pageSize: +pageSize,
                ...(name !== undefined && { name }),
                ...(status !== undefined && { status }),
                ...(sortBy !== undefined && { sortBy }),
                ...(order !== undefined && { order }),
            })

            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateLeadRequestSchema.parse(req.body)
            const newLead = await this.leadsService.createLead({
                name: body.name,
                email: body.email,
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            })
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const lead = await this.leadsService.getLeadById(Number(req.params.id))
            res.json(lead)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const body = UpdateLeadRequestSchema.parse(req.body)
            const id = Number(req.params.id)

            const leadData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.email !== undefined && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }

            const updatedLead = await this.leadsService.updateLead(id, leadData)

            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)

            const deletedLead = await this.leadsService.deleteLead(id)
            res.json({ deletedLead })
        } catch (error) {
            next(error)
        }
    }
}
