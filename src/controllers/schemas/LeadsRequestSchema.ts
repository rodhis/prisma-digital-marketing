import z from 'zod'

const CreateLeadRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().nonoptional('Invalid email address'),
    phone: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
    status: z
        .enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'UNRESPONSIVE', 'DISQUALIFIED', 'ARCHIVED'])
        .optional(),
    campaigns: z.array(z.number().int().positive()).optional(),
})

export { CreateLeadRequestSchema }
