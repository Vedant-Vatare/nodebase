import { z } from "zod";
import { baseNodeSchema } from "./base.nodes.js";

export const clickNodeSchema = baseNodeSchema.extend({
	name: z.literal("click"),
	task: z.literal("trigger.click"),
	type: z.literal("trigger"),
});

export type ClickNode = z.infer<typeof clickNodeSchema>;

export const cronJobNodeSchema = baseNodeSchema.extend({
	name: z.literal("schedule trigger"),
	task: z.literal("trigger.cron"),
	type: z.union([z.literal("trigger"), z.literal("action")]),
	parameters: z.array(
		z.discriminatedUnion("name", [
			z.object({
				label: z.literal("minutes"),
				name: z.literal("minutes"),
				type: z.literal("number"),
				value: z.number(),
				default: z.literal("0").optional(),
			}),

			z.object({
				label: z.literal("Hour"),
				name: z.literal("hour"),
				type: z.literal("number"),
				value: z.number(),
				default: z.literal("0").optional(),
			}),

			z.object({
				label: z.literal("day of the month"),
				name: z.literal("day_of_the_month"),
				type: z.literal("number"),
				value: z.number(),
				default: z.literal("0").optional(),
			}),

			z.object({
				label: z.literal("Month"),
				name: z.literal("month"),
				type: z.literal("number"),
				value: z.number(),
				default: z.literal("0").optional(),
			}),
		]),
	),
});

export const InputNodeSchema = baseNodeSchema.extend({
	name: z.literal("input trigger"),
	type: "trigger",
	task: "trigger.input",
	parameters: [
		{
			label: z.literal("Input Data"),
			name: z.literal("Inputs"),
			type: z.literal("key-value"),
			value: z.record(z.string(), z.unknown()),
			required: z.boolean(),
		},
	],
	credentials: null,
});
