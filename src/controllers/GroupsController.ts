import type { Handler } from 'express'

import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import { HttpError } from '../errors/HttpError.js'
import type { GroupsRepository } from '../repositories/GroupsRepository.js'

export class GroupsController {
    constructor(private readonly groupsRepository: GroupsRepository) {}

    index: Handler = async (req, res, next) => {
        try {
            const groups = await this.groupsRepository.find()
            res.json(groups)
        } catch (error) {
            next(error)
        }
    }
    create: Handler = async (req, res, next) => {
        try {
            const body = await CreateGroupRequestSchema.parse(req.body)
            const newGroup = await this.groupsRepository.create(body)
            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const group = await this.groupsRepository.findById(Number(req.params.id))
            if (!group) {
                throw new HttpError(404, 'Group not found')
            }
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

            const updatedGroup = await this.groupsRepository.updateById(id, groupData)
            if (!updatedGroup) {
                throw new HttpError(404, 'Group not found')
            }

            res.json({ updatedGroup })
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)

            const deletedGroup = await this.groupsRepository.deleteById(id)
            if (!deletedGroup) {
                throw new HttpError(404, 'Group not found')
            }

            res.json({ deletedGroup })
        } catch (error) {
            next(error)
        }
    }
}
