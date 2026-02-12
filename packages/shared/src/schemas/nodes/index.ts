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
	"checkbox",
	"radio",
	"textarea",
	"boolean",
	"key",
	"key-value",
	"array",
	"date",
]);

export const nodeParameterSchema = z.object({
	label: z.string(),
	name: z.string(),
	description: z.string().optional(),
	placeholder: z.string().optional(),
	type: nodePropertyTypeSchema,
	value: z.unknown(),
	default: z.string(),
	required: z.boolean(),
	multiValued: z.boolean(),
	dependsOn: z.string().optional(),
});

export const nodeOutputPortsSchema = z.array(
	z.object({
		name: z.string(),
		label: z.string(),
	}),
);
export const nodeInputPortsSchema = z.array(
	z.object({
		name: z.string(),
		label: z.string(),
	}),
);

export const baseNodeSettingsSchema = z.object({
	retryAfterFail: z.boolean(),
	executeOnlyOnce: z.boolean(),
});

export const baseNodeSchema = z.object({
	name: z.string(),
	task: z.string(),
	description: z.string(),
	icon: z.string(),
	type: nodeTypesSchema,
	parameters: z.array(nodeParameterSchema),
	outputPorts: z.array(nodeOutputPortsSchema),
	InputPorts: z.array(nodeInputPortsSchema),
	credentials: z.array(nodeCredentialSchema).optional(),
	settings: baseNodeSettingsSchema.optional(),
});

export const updateBaseNodeSchema = baseNodeSchema.partial();
