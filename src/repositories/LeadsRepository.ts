import type { Lead } from '@prisma/client'

export type LeadStatus =
    | 'NEW'
    | 'CONTACTED'
    | 'QUALIFIED'
    | 'CONVERTED'
    | 'UNRESPONSIVE'
    | 'DISQUALIFIED'
    | 'ARCHIVED'

export interface LeadWhereParams {
    name?: {
        like?: string
        equals?: string
        mode?: 'default' | 'insensitive'
    }
    status?: LeadStatus
    groupId?: Number
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
    find: (params: FindLeadsParams) => Promise<Lead[]>
    findById: (id: number) => Promise<Lead | null>
    count: (where: LeadWhereParams) => Promise<number>
    create: (attributes: CreateLeadAttributes) => Promise<Lead>
    updateById: (id: number, attributes: Partial<CreateLeadAttributes>) => Promise<Lead | null>
    deleteById: (id: number) => Promise<Lead | null>
}
