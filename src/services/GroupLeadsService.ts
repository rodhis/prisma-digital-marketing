import { HttpError } from '../errors/HttpError.js'
import type { GroupsRepository } from '../repositories/GroupsRepository.js'
import type { LeadsRepository, LeadWhereParams } from '../repositories/LeadsRepository.js'

interface GetGroupLeadsParams {
    groupId: number
    page?: number
    pageSize?: number
    name?: string
    status?: string
    sortBy?: 'name' | 'status' | 'createdAt' | 'id'
    order?: 'asc' | 'desc'
}

export class GroupLeadsService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly leadsRepository: LeadsRepository
    ) {}

    async getGroupLeads(params: GetGroupLeadsParams) {
        const { groupId, page = 1, pageSize = 10, name, status, sortBy = 'name', order = 'asc' } = params

        if (!groupId) {
            throw new HttpError(400, 'Group does not exist.')
        }

        const limit = pageSize
        const offset = (page - 1) * limit

        const where: LeadWhereParams = { groupId }

        if (name) where.name = { like: name, mode: 'insensitive' }
        if (status) where.status = status as any

        const leads = await this.leadsRepository.find({
            where,
            sortBy,
            order,
            limit,
            offset,
            include: { groups: true, campaigns: true },
        })

        const totalLeads = await this.leadsRepository.count(where)

        return {
            leads,
            meta: {
                page,
                pageSize: limit,
                totalLeads,
                totalPages: Math.ceil(totalLeads / limit),
            },
        }
    }

    async addLeadToGroup(groupId: number, leadId: number) {
        const existingGroup = await this.groupsRepository.findById(groupId)
        if (!existingGroup) {
            throw new HttpError(400, 'Group does not exist.')
        }

        const existingLead = await this.leadsRepository.findById(leadId)
        if (!existingLead) {
            throw new HttpError(400, 'Lead does not exist.')
        }

        const updatedGroup = await this.groupsRepository.addLead(groupId, leadId)

        return updatedGroup
    }

    async removeLeadFromGroup(groupId: number, leadId: number) {
        const existingGroup = await this.groupsRepository.findById(groupId)
        if (!existingGroup) {
            throw new HttpError(400, 'Group does not exist.')
        }

        const existingLead = await this.leadsRepository.findById(leadId)
        if (!existingLead) {
            throw new HttpError(400, 'Lead does not exist.')
        }

        const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId)

        return updatedGroup
    }
}
