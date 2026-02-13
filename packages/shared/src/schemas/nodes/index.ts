import z from "zod";

export const nodeTypesSchema = z.enum([
	"action",
	"trigger",
	"transform",
	"cron",
	"helper",
	"webhook",
]);

export const nodeCredentialsEnum = z.enum([
	"OAuth",
	"API Keys",
	"Bearer_Token",
	"username_password",
]);

export const nodeCredentialSchema = z.object({
	name: z.string(),
	value: z.string(),
	required: z.boolean(),
	type: nodeCredentialsEnum,
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

export const parameterDependSchema = z.object({
	parameter: z.string(),
	values: z.array(z.unknown()),
});

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
	dependsOn: z.array(parameterDependSchema).optional(),
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
	credentials: nodeCredentialSchema.optional(),
	settings: baseNodeSettingsSchema.optional(),
});

export const updateBaseNodeSchema = baseNodeSchema.partial();
