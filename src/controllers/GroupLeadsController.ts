import type { Handler } from 'express'

import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchemas.js'
import { AddLeadtoGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import type { GroupLeadsService } from '../services/GroupLeadsService.js'

export class GroupLeadsController {
    constructor(private readonly groupLeadsService: GroupLeadsService) {}

    getLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const result = await this.groupLeadsService.getGroupLeads({
                groupId,
                page: +page,
                pageSize: +pageSize,
                ...(name !== undefined && { name }),
                ...(status !== undefined && { status }),
                sortBy,
                order,
            })

            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    addLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const { leadId } = AddLeadtoGroupRequestSchema.parse(req.body)

            const updatedGroup = await this.groupLeadsService.addLeadToGroup(groupId, leadId)

            res.status(201).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
    removeLead: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const leadId = Number(req.params.leadId)

            const updatedGroup = await this.groupLeadsService.removeLeadFromGroup(groupId, leadId)

            res.status(200).json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }
}
