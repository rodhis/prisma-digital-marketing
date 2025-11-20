import { HttpError } from '../errors/HttpError.js'
import type { CreateGroupAttributes, GroupsRepository } from '../repositories/GroupsRepository.js'

export class GroupsService {
    constructor(private readonly groupsRepository: GroupsRepository) {}

    async getAllGroups() {
        const groups = await this.groupsRepository.find()
        return groups
    }

    async getGroupById(id: number) {
        const group = await this.groupsRepository.findById(id)
        if (!group) {
            throw new HttpError(404, 'Group not found')
        }

        return group
    }

    async createGroup(attributes: CreateGroupAttributes) {
        const newGroup = await this.groupsRepository.create(attributes)
        return newGroup
    }

    async updateGroup(groupId: number, attributes: Partial<CreateGroupAttributes>) {
        const updatedGroup = await this.groupsRepository.updateById(groupId, attributes)
        if (!updatedGroup) {
            throw new HttpError(404, 'Group not found')
        }

        return updatedGroup
    }

    async deleteGroup(groupId: number) {
        const deletedGroup = await this.groupsRepository.deleteById(groupId)
        if (!deletedGroup) {
            throw new HttpError(404, 'Group not found')
        }

        return deletedGroup
    }
}
