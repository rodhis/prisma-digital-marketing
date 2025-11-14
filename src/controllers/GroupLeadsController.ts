import type { Handler } from 'express'

import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchemas.js'
import { AddLeadtoGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import type { GroupsRepository } from '../repositories/GroupsRepository.js'
import type { LeadsRepository, LeadWhereParams } from '../repositories/LeadsRepository.js'

export class GroupLeadsController {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly leadsRepository: LeadsRepository
    ) {}

    getLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            if (!groupId) {
                throw new HttpError(400, 'Group does not exist.')
            }
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const limit = Number(pageSize)
            const offset = (Number(page) - 1) * limit

            const where: LeadWhereParams = { groupId }

            if (name) where.name = { like: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await this.leadsRepository.find({
                where,
                sortBy,
                order,
                limit,
                offset,
                include: { groups: true, campaigns: true },
            })

            const totalLeads = await this.leadsRepository.count(where)

            res.json({
                leads,
                meta: {
                    page: +page,
                    pageSize: limit,
                    totalLeads,
                    totalPages: Math.ceil(totalLeads / limit),
                },
            })
        } catch (error) {
            next(error)
        }
    }

    addLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const { leadId } = AddLeadtoGroupRequestSchema.parse(req.body)

            const existingGroup = await this.groupsRepository.findById(groupId)
            if (!existingGroup) {
                throw new HttpError(400, 'Group does not exist.')
            }

            const existingLead = await this.leadsRepository.findById(leadId)
            if (!existingLead) {
                throw new HttpError(400, 'Lead does not exist.')
            }

            const updatedGroup = await this.groupsRepository.addLead(groupId, leadId)

            res.status(201).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
    removeLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const leadId = Number(req.params.leadId)

            const existingGroup = await this.groupsRepository.findById(groupId)
            if (!existingGroup) {
                throw new HttpError(400, 'Group does not exist.')
            }

            const existingLead = await this.leadsRepository.findById(leadId)
            if (!existingLead) {
                throw new HttpError(400, 'Lead does not exist.')
            }

            const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId)

            res.status(200).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
}
