import z from 'zod'

export const CreateCampaignRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    startDate: z.coerce.date({ message: 'Invalid date' }),
    endDate: z.coerce.date({ message: 'Invalid date' }).optional(),
})

export const UpdateCampaignRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    startDate: z.coerce.date({ message: 'Invalid date' }).optional(),
    endDate: z.coerce.date({ message: 'Invalid date' }).optional().nullable(),
})

const LeadCampaignStatusEnum = z.enum([
    'NEW',
    'ENGAGED',
    'FOLLOWUP_SCHEDULED',
    'CONTACTED',
    'CONVERTED',
    'UNRESPONSIVE',
    'DISQUALIFIED',
    'RE_ENGAGED',
    'OPTED_OUT',
])

export const GetCampaignLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadCampaignStatusEnum.optional(),
    sortBy: z.enum(['name', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
})

export const AddLeadToCampaignRequestSchema = z.object({
    leadId: z.number(),
    status: LeadCampaignStatusEnum.optional(),
})

export const UpdateLeadStatusInCampaignRequestSchema = z.object({
    status: LeadCampaignStatusEnum,
})