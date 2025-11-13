import prisma from '../../database/index.js'
import type { CreateGroupAttributes, GroupModel, GroupsRepository } from '../GroupsRepository.js'

export class PrismaGroupsRepository implements GroupsRepository {
    find(): Promise<GroupModel[]> {
        return prisma.group.findMany()
    }
    findById(id: number): Promise<GroupModel | null> {
        return prisma.group.findUnique({ 
            where: { id },
            include: {
                leads: true
            }
        })
    }
    create(attributes: CreateGroupAttributes): Promise<GroupModel> {
        return prisma.group.create({ data: attributes })
    }
    updateById(id: number, attributes: Partial<CreateGroupAttributes>): Promise<GroupModel | null> {
        return prisma.group.update({
            where: { id },
            data: attributes,
        })
    }
    deleteById(id: number): Promise<GroupModel | null> {
        return prisma.group.delete({ where: { id } })
    }
    addLead(groupId: number, leadId: number): Promise<GroupModel> {
        return prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                leads: {
                    connect: {
                        id: leadId,
                    },
                },
            },
            include: { leads: true },
        })
    }
    removeLead(groupId: number, leadId: number): Promise<GroupModel> {
        return prisma.group.update({
                where: { id: groupId },
                data: {
                    leads: {
                        disconnect: { id: leadId },
                    },
                },
                include: { leads: true },
            })
    }
}
