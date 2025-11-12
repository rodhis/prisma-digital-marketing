import type { Handler } from 'express'
import {
    CreateLeadRequestSchema,
    GetLeadsRequestSchema,
    UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import type { LeadsRepository, LeadWhereParams } from '../repositories/LeadsRepository.js'

export class LeadsController {
    private leadsRepository: LeadsRepository

    constructor(leadsRepository: LeadsRepository) {
        this.leadsRepository = leadsRepository
    }

    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'id', order = 'asc' } = query

            const limit = Number(pageSize)
            const offset = (Number(page) - 1) * limit

            const where: LeadWhereParams = {}

            if (name) where.name = { like: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await this.leadsRepository.find({
                where,
                sortBy,
                order,
                limit,
                offset,
            })

            const total = await this.leadsRepository.count(where)
            const totalPages = Math.ceil(total / limit)

            res.json({
                data: leads,
                meta: { page: +page, pageSize: +pageSize, total, totalPages },
            })
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateLeadRequestSchema.parse(req.body)
            if (!body.status) body.status = 'NEW'
            const leadData = {
                name: body.name,
                email: body.email,
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }
            const newLead = await this.leadsRepository.create(leadData)
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const lead = await this.leadsRepository.findById(Number(req.params.id))
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
            const existingLead = await this.leadsRepository.findById(id)

            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }

            if (existingLead.status === 'NEW' && body.status !== undefined && body.status !== 'CONTACTED') {
                throw new HttpError(
                    400,
                    'A new lead must be contacted before changing its status to other value'
                )
            }

            if (body.status && body.status === 'ARCHIVED') {
                const now = new Date()
                const diffTime = Math.abs(now.getTime() - existingLead.updatedAt.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) //converted to  seconds, then minutes, then hours and finally days
                if (diffDays < 180) {
                    throw new HttpError(400, 'A lead can only be archived after 6 months of its last update')
                }
            }

            const leadData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.email !== undefined && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.status !== undefined && { status: body.status }),
            }

            const updatedLead = await this.leadsRepository.updateById(id, leadData)
            if (!updatedLead) {
                throw new HttpError(404, 'Lead not found')
            }
            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const existingLead = await this.leadsRepository.findById(id)
            if (!existingLead) {
                throw new HttpError(404, 'Lead not found')
            }
            const deletedLead = await this.leadsRepository.deleteById(id)
            if (!deletedLead) {
                throw new HttpError(404, 'Lead not found')
            }
            res.json({ deletedLead })
        } catch (error) {
            next(error)
        }
    }
}
