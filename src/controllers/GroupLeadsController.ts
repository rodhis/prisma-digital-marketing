import type { Handler } from "express";
import type { Prisma } from "@prisma/client";

import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchemas.js";
import prisma from "../database/index.js";

export class GroupLeadsController {
    getLeads: Handler = async (req, res, next) => {
        try {
    const groupId = Number(req.params.groupId)
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const pageNumber = +page
            const pageSizeNumber = +pageSize

            const where: Prisma.LeadWhereInput = {
                groups: {
                    some: { id: groupId },
                },
            }

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await prisma.lead.findMany({
                where,
                orderBy: {
                    [sortBy]: order,
                },
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    groups: true
                },
            })

            const totalLeads = await prisma.lead.count({ where })

            res.json({
                data: leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    totalLeads,
                    totalPages: Math.ceil(totalLeads / pageSizeNumber),
                },
            })
        } catch (error) {
            next(error);
        }
    }

    addLead: Handler = async (req, res, next) => {

    }
    removeLead: Handler = async (req, res, next) => {

    }
}