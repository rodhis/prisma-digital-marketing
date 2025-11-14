import type { Lead, Prisma } from '@prisma/client'
import prisma from '../../database/index.js'
import type {
    CreateLeadAttributes,
    FindLeadsParams,
    LeadsRepository,
    LeadWhereParams,
} from '../LeadsRepository.js'

export class PrismaLeadsRepository implements LeadsRepository {
    async find(params: FindLeadsParams): Promise<Lead[]> {
        const whereClause: Prisma.LeadWhereInput = {}

        if (params.where?.name?.like) {
            whereClause.name = {
                contains: params.where.name.like,
                mode: params.where.name.mode as Prisma.QueryMode,
            }
        } else if (params.where?.name?.equals) {
            whereClause.name = {
                equals: params.where.name.equals,
                mode: params.where.name.mode as Prisma.QueryMode,
            }
        }

        if (params.where?.status) {
            whereClause.status = params.where.status
        }

        if (params.where?.groupId !== undefined) {
            whereClause.groups = {
                some: {
                    id: Number(params.where.groupId),
                },
            }
        }

        const queryOptions: Prisma.LeadFindManyArgs = {
            where: whereClause,
            orderBy: params.sortBy ? { [params.sortBy]: params.order } : { name: 'asc' },
        }

        if (params.offset !== undefined) {
            queryOptions.skip = params.offset
        }

        if (params.limit !== undefined) {
            queryOptions.take = params.limit
        }

        if (params.include?.groups !== undefined || params.include?.campaigns !== undefined) {
            queryOptions.include = {}
            if (params.include.groups !== undefined) {
                queryOptions.include.groups = params.include.groups
            }
            if (params.include.campaigns !== undefined) {
                queryOptions.include.campaigns = params.include.campaigns
            }
        }

        return prisma.lead.findMany(queryOptions)
    }

    async findById(id: number): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: { id },
            include: {
                campaigns: true,
                groups: true,
            },
        })
    }

    async count(where: LeadWhereParams): Promise<number> {
        const whereClause: Prisma.LeadWhereInput = {}

        if (where?.name?.like) {
            whereClause.name = {
                contains: where.name.like,
                mode: where.name.mode as Prisma.QueryMode,
            }
        } else if (where?.name?.equals) {
            whereClause.name = {
                equals: where.name.equals,
                mode: where.name.mode as Prisma.QueryMode,
            }
        }

        if (where?.status) {
            whereClause.status = where.status
        }

        if (where?.groupId !== undefined) {
            whereClause.groups = {
                some: {
                    id: Number(where.groupId),
                },
            }
        }

        return prisma.lead.count({
            where: whereClause,
        })
    }

    async create(attributes: CreateLeadAttributes): Promise<Lead> {
        return prisma.lead.create({ data: attributes })
    }

    async updateById(id: number, attributes: Partial<CreateLeadAttributes>): Promise<Lead | null> {
        try {
            return await prisma.lead.update({
                where: { id },
                data: attributes,
            })
        } catch {
            return null
        }
    }

    async deleteById(id: number): Promise<Lead | null> {
        try {
            return await prisma.lead.delete({ where: { id } })
        } catch {
            return null
        }
    }
}
