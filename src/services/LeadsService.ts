import type { CreateLeadAttributes, LeadsRepository, LeadStatus, LeadWhereParams } from '../repositories/LeadsRepository.js'

 interface GetLeadsWithPaginationParams {
    name?: string
    status?: LeadStatus
    page?: number
    pageSize?: number
    sortBy?: 'name' | 'status' | 'createdAt' | 'id'
    order?: 'asc' | 'desc'
}

export class LeadsService {
    constructor(private readonly leadsRepository: LeadsRepository) {}

    async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
        const { page = 1, pageSize = 10, name, status, sortBy = 'id', order = 'asc' } = params
        const limit = pageSize
        const offset = (page - 1) * limit

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

        return {
            leads,
            meta: { page, pageSize, total, totalPages },
        }
    }

    async createLead(attributes: CreateLeadAttributes) {
        if (!attributes.status) attributes.status = 'NEW'
        const newLead = await this.leadsRepository.create(attributes)
        return newLead
    }
}
