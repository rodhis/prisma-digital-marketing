import type { Prisma } from '@prisma/client'
import prisma from '../database/index.js'

export class LeadsModel {
    static async findMany(
        where: Prisma.LeadWhereInput,
        orderBy: Prisma.LeadOrderByWithRelationInput,
        skip: number,
        take: number
    ) {
        return await prisma.lead.findMany({
            where,
            orderBy,
            skip,
            take,
        })
    }

    static async count(where: Prisma.LeadWhereInput) {
        return await prisma.lead.count({ where })
    }

    static async create(data: Prisma.LeadCreateInput) {
        return await prisma.lead.create({
            data,
        })
    }

    static async findUnique(where: Prisma.LeadWhereUniqueInput, include?: Prisma.LeadInclude) {
        return await prisma.lead.findUnique({
            where,
            ...(include && { include }),
        })
    }

    static async update(where: Prisma.LeadWhereUniqueInput, data: Prisma.LeadUpdateInput) {
        return await prisma.lead.update({
            where,
            data,
        })
    }

    static async delete(where: Prisma.LeadWhereUniqueInput) {
        return await prisma.lead.delete({
            where,
        })
    }
}
