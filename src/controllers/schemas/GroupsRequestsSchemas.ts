import z from "zod";

export const CreateGroupRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(4, "Description must be at least 4 characters")
});

export const UpdateGroupRequestSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(4, "Description must be at least 4 characters").optional()
});

export const AddLeadtoGroupRequestSchema = z.object({
    leadId: z.number()
});