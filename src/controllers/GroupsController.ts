import type { Handler } from 'express'

import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import type { GroupsService } from '../services/GroupsService.js'

export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    index: Handler = async (req, res, next) => {
        try {
            const groups = await this.groupsService.getAllGroups()
            res.json(groups)
        } catch (error) {
            next(error)
        }
    }
    create: Handler = async (req, res, next) => {
        try {
            const body = await CreateGroupRequestSchema.parse(req.body)
            const newGroup = await this.groupsService.createGroup(body)
            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const group = await this.groupsService.getGroupById(Number(req.params.id))
            res.status(200).json(group)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const body = await UpdateGroupRequestSchema.parse(req.body)
            const id = Number(req.params.id)

            const groupData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
            }

            const updatedGroup = await this.groupsService.updateGroup(id, groupData)

            res.json({ updatedGroup })
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)

            const deletedGroup = await this.groupsService.deleteGroup(id)

            res.json({ deletedGroup })
        } catch (error) {
            next(error)
        }
    }
}
