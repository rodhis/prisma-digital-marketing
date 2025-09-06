import z from 'zod'

const CreateLeadRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1,'Email is required'),
    phone: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
    status: z
        .enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'UNRESPONSIVE', 'DISQUALIFIED', 'ARCHIVED'])
        .optional(),
})

export { CreateLeadRequestSchema }
