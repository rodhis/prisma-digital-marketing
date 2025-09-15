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
