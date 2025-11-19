import type { LeadCampaignStatus } from './CampaignsRepository.js'

export type LeadStatus =
    | 'NEW'
    | 'CONTACTED'
    | 'QUALIFIED'
    | 'CONVERTED'
    | 'UNRESPONSIVE'
    | 'DISQUALIFIED'
    | 'ARCHIVED'

export interface LeadModel {
    id: number
    name: string
    email: string
    phone: string | null
    status: LeadStatus
    createdAt: Date
    updatedAt: Date
}

export interface LeadWhereParams {
    name?: {
        like?: string
        equals?: string
        mode?: 'default' | 'insensitive'
    }
    status?: LeadStatus
    campaignStatus?: LeadCampaignStatus
    groupId?: number
    campaignId?: number
}

export interface FindLeadsParams {
    where?: LeadWhereParams
    sortBy?: 'name' | 'status' | 'createdAt' | 'id'
    order?: 'asc' | 'desc'
    limit?: number
    offset?: number
    include?: {
        groups?: boolean
        campaigns?: boolean
    }
}

export interface CreateLeadAttributes {
    name: string
    email: string
    phone?: string
    status?: LeadStatus
}

export interface LeadsRepository {
    find: (params: FindLeadsParams) => Promise<LeadModel[]>
    findById: (id: number) => Promise<LeadModel | null>
    count: (where: LeadWhereParams) => Promise<number>
    create: (attributes: CreateLeadAttributes) => Promise<LeadModel>
    updateById: (id: number, attributes: Partial<CreateLeadAttributes>) => Promise<LeadModel | null>
    deleteById: (id: number) => Promise<LeadModel | null>
}
