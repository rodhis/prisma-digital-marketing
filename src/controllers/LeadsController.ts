import type { Handler } from "express";
import prisma from "../database/index.js";

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const leads = await prisma.lead.findMany();
            res.json(leads);
        } catch (error) {
            next(error);
        }
    };
}