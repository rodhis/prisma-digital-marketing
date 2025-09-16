import type { Handler } from 'express'

import prisma from '../database/index.js'
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from './schemas/GroupsRequestsSchemas.js'
import { HttpError } from '../errors/HttpError.js'

export class GroupsController {
    index: Handler = async (req, res, next) => {
        try {
            const groups = await prisma.group.findMany()
            res.json(groups)
        } catch (error) {
            next(error)
        }
    }
    create: Handler = async (req, res, next) => {
        try {
            const body = await CreateGroupRequestSchema.parse(req.body)
            const newGroup = await prisma.group.create({
                data: body,
            })
            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }
    show: Handler = async (req, res, next) => {
        try {
            const group = await prisma.group.findUnique({
                where: { id: Number(req.params.id) },
                include: { leads: true },
            })
            if (!group) {
                throw new HttpError(404, 'Group not found')
            }
            res.status(201).json(group)
        } catch (error) {
            next(error)
        }
    }
    update: Handler = async (req, res, next) => {
        try {
            const body = await UpdateGroupRequestSchema.parse(req.body)
            const id = Number(req.params.id)
            const existingGroup = await prisma.group.findUnique({
                where: { id },
            })
            if (!existingGroup) {
                throw new HttpError(404, 'Group not found')
            }
            const groupData = {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
            }

            const updatedGroup = await prisma.group.update({
                where: { id },
                data: groupData,
            })
            res.json({ updatedGroup })
        } catch (error) {
            next(error)
        }
    }
    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const existingGroup = await prisma.group.findUnique({
                where: { id },
            })
            if (!existingGroup) {
                throw new HttpError(404, 'Group not found')
            }
            const deletedGroup = await prisma.group.delete({
                where: { id },
            })

            res.json({ deletedGroup })
        } catch (error) {
            next(error)
        }
    }
}
