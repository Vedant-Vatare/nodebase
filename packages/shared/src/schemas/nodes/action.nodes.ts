import { unknown, z } from "zod";
import { baseNodeSchema, nodeParameterSchema } from "./base.nodes.js";

export const httpNodeSchema = baseNodeSchema.extend({
	name: z.literal("HTTP Request"),
	task: z.literal("action.http"),
	type: z.literal("action"),
	parameters: z.array(
		z.discriminatedUnion("name", [
			nodeParameterSchema.extend({
				label: z.literal("URL"),
				name: z.literal("url"),
				type: z.literal("input"),
				value: z.string(),
				required: z.literal(true),
			}),
			nodeParameterSchema.extend({
				label: z.literal("Method"),
				name: z.literal("method"),
				type: z.literal("dropdown"),
				value: z.enum([
					"GET",
					"POST",
					"PUT",
					"DELETE",
					"PATCH",
					"OPTIONS",
					"HEAD",
				]),
				required: z.literal(true),
			}),
			nodeParameterSchema.extend({
				label: z.literal("Headers"),
				name: z.literal("headers"),
				type: z.literal("key-value"),
				value: z.array(z.record(z.string(), z.string())),
				required: z.literal(false),
				multiValued: z.literal(true).optional(),
			}),
			nodeParameterSchema.extend({
				label: z.literal("Body"),
				name: z.literal("body"),
				type: z.literal("textarea"),
				value: z.string(),
				required: z.literal(false),
				dependsOn: z
					.array(
						z.object({
							parameter: z.literal("method"),
							values: z.array(z.enum(["POST", "PUT", "PATCH", "DELETE"])),
						}),
					)
					.optional(),
			}),
		]),
	),
});

export const mergeDataSchema = baseNodeSchema.extend({
	name: z.literal("merge data"),
	type: z.literal("action"),
	task: z.literal("action.merge"),
	parameters: [
		{
			name: z.literal("input1"),
			type: z.literal("input"),
			label: z.literal("Input 1"),
			value: unknown,
			required: z.boolean(),
		},
		{
			name: z.literal("input2"),
			type: z.literal("input"),
			label: z.literal("Input 2"),
			value: unknown,
			required: z.boolean(),
		},
	],
	credentials: null,
	inputPorts: [
		{
			name: z.literal("input1"),
			label: z.literal("Input 1"),
		},
		{
			name: z.literal("input2"),
			label: z.literal("Input 2"),
		},
	],
	outputPorts: [
		{
			name: z.literal("default"),
			label: z.literal("Default"),
		},
	],
});
