import z from 'zod'

const LeadStatusEnum = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'UNRESPONSIVE', 'DISQUALIFIED', 'ARCHIVED'], {
})

export const GetLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadStatusEnum.optional(),
    sortBy: z.enum(['name', 'status']).optional(),
    orderBy: z.enum(['asc', 'desc']),
})

export const CreateLeadRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1,'Email is required'),
    phone: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
    status: LeadStatusEnum.optional(),
})

export const UpdateLeadRequestSchema = CreateLeadRequestSchema.partial()


