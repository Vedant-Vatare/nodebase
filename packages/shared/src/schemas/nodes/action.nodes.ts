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
				value: z.string(),
				options: z.array(z.object({ label: z.string(), value: z.string() })),
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

const startOptionSchema = z.union([
	z.object({
		name: z.literal("after time period"),
		value: z.literal("time_period"),
	}),
	z.object({
		name: z.literal("on specific date & time"),
		value: z.literal("date_time"),
	}),
]);

const timeUnitOptionSchema = z.union([
	z.object({ name: z.literal("Seconds"), value: z.literal("seconds") }),
	z.object({ name: z.literal("Minute"), value: z.literal("minutes") }),
	z.object({ name: z.literal("Hours"), value: z.literal("hours") }),
	z.object({ name: z.literal("Days"), value: z.literal("days") }),
]);

export const waitingNodeSchema = baseNodeSchema.extend({
	name: z.literal("waiting node"),
	task: z.literal("action.wait"),
	type: z.union([z.literal("trigger"), z.literal("action")]),
	parameters: z.array(
		z.discriminatedUnion("name", [
			z.object({
				label: z.literal("Start on"),
				name: z.literal("start"),
				type: z.literal("dropdown"),
				value: z.enum(["time_period", "date_time"]),
				options: z.array(startOptionSchema),
				default: z.literal("time_period").optional(),
				required: z.literal(true).optional(),
			}),

			z.object({
				label: z.literal("Wait time"),
				name: z.literal("wait_time_period"),
				type: z.literal("number"),
				value: z.number(),
				default: z.literal("10").optional(),
				required: z.literal(true).optional(),
				dependsOn: z.tuple([
					z.object({
						parameter: z.literal("start"),
						values: z.tuple([z.literal("time_period")]),
					}),
				]),
			}),

			z.object({
				label: z.literal("time unit"),
				name: z.literal("time_unit"),
				type: z.literal("dropdown"),
				value: z.enum(["seconds", "minutes", "hours", "days"]),
				options: z.array(timeUnitOptionSchema),
				default: z.literal("seconds").optional(),
				required: z.literal(true).optional(),
				dependsOn: z.tuple([
					z.object({
						parameter: z.literal("start"),
						values: z.tuple([z.literal("time_period")]),
					}),
				]),
			}),

			z.object({
				label: z.literal("At specific time"),
				name: z.literal("date_time"),
				type: z.literal("date-time"),
				value: z.string(),
				required: z.literal(true).optional(),
				dependsOn: z.tuple([
					z.object({
						parameter: z.literal("start"),
						values: z.tuple([z.literal("date_time")]),
					}),
				]),
			}),
		]),
	),
});
