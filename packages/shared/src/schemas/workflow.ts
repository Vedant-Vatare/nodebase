import z from "zod";

export const createWorkflowSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: z.literal("active").optional(),
	executionCount: z.literal(0).optional(),
});
