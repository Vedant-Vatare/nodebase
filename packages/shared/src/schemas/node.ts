import z from "zod";

export const nodeTypesSchema = z.enum([
	"action",
	"trigger",
	"transform",
	"cron",
	"helper",
	"webhook",
]);

export const nodeCredentialSchema = z.object({
	name: z.string(),
	required: z.boolean(),
});

export const nodePropertyTypeSchema = z.enum([
	"input",
	"number",
	"dropdown",
	"radio",
	"boolean",
	"date",
]);

export const nodeParameterSchema = z.object({
	label: z.string(),
	name: z.string(),
	description: z.string().optional(),
	type: nodePropertyTypeSchema,
	values: z.array(z.string()),
	default: z.string(),
});

export const baseNodeSchema = z.object({
	name: z.string(),
	task: z.string(),
	icon: z.string(),
	description: z.string(),
	type: nodeTypesSchema,
	credentials: z.array(nodeCredentialSchema).optional(),
	parameters: z.array(nodeParameterSchema),
});
