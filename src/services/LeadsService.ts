import { HttpError } from '../errors/HttpError.js'
import type {
    CreateLeadAttributes,
    LeadsRepository,
    LeadStatus,
    LeadWhereParams,
} from '../repositories/LeadsRepository.js'

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
        const totalPages = Math.ceil(total / pageSize)

        return {
            leads,
            meta: { page, pageSize, total, totalPages },
        }
    }

    async getLeadById(id: number) {
        const lead = await this.leadsRepository.findById(id)
        if (!lead) {
            throw new HttpError(404, 'Lead not found')
        }

        return lead
    }

    async createLead(attributes: CreateLeadAttributes) {
        if (!attributes.status) attributes.status = 'NEW'
        const newLead = await this.leadsRepository.create(attributes)

        return newLead
    }

    async updateLead(leadId: number, attributes: Partial<CreateLeadAttributes>) {
        const existingLead = await this.leadsRepository.findById(leadId)

        if (!existingLead) {
            throw new HttpError(404, 'Lead not found')
        }

        if (
            existingLead.status === 'NEW' &&
            attributes.status !== undefined &&
            attributes.status !== 'CONTACTED'
        ) {
            throw new HttpError(400, 'A new lead must be contacted before changing its status to other value')
        }

        if (attributes.status && attributes.status === 'ARCHIVED') {
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - existingLead.updatedAt.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) //converted to  seconds, then minutes, then hours and finally days
            if (diffDays < 180) {
                throw new HttpError(400, 'A lead can only be archived after 6 months of its last update')
            }
        }

        const leadData = {
            ...(attributes.name !== undefined && { name: attributes.name }),
            ...(attributes.email !== undefined && { email: attributes.email }),
            ...(attributes.phone !== undefined && { phone: attributes.phone }),
            ...(attributes.status !== undefined && { status: attributes.status }),
        }

        const updatedLead = await this.leadsRepository.updateById(leadId, leadData)
        if (!updatedLead) {
            throw new HttpError(404, 'Lead not found')
        }

        return updatedLead
    }

    async deleteLead(leadId: number) {
        const existingLead = await this.leadsRepository.findById(leadId)
        if (!existingLead) {
            throw new HttpError(404, 'Lead not found')
        }
        const deletedLead = await this.leadsRepository.deleteById(leadId)
        if (!deletedLead) {
            throw new HttpError(404, 'Lead not found')
        }

        return deletedLead
    }
}
