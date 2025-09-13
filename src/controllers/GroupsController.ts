import type { Handler } from "express";
import prisma from "../database/index.js";
import { CreateGroupRequestSchema } from "./schemas/GroupsRequestsSchemas.js";
import { HttpError } from "../errors/HttpError.js";

export class GroupsController {
    index: Handler = async (req, res, next) => {
        try {
            const groups = await prisma.group.findMany();
            res.json(groups);
        } catch (error) {
            next(error);
        }
    };
    create: Handler = async (req, res, next) => {
        try {
            const body = await CreateGroupRequestSchema.parse(req.body);
            const newGroup = await prisma.group.create({
                data: body,
            });
            res.status(201).json(newGroup);
        } catch (error) {
            next(error);
        }
    };
    show: Handler = async (req, res, next) => {
        try {
            const group = await prisma.group.findUnique({
                where: { id: Number(req.params.id) },
                include: { leads: true },
            });
            if (!group) {
                throw new HttpError(404, "Group not found");
            }
            res.status(201).json(group);
        } catch (error) {
            next(error);
        }
    };
    update: Handler = async (req, res, next) => {
        try {
            res.json({ message: "Groups index" });
        } catch (error) {
            next(error);
        }
    };
    delete: Handler = async (req, res, next) => {
        try {
            res.json({ message: "Groups index" });
        } catch (error) {
            next(error);
        }
    };
}