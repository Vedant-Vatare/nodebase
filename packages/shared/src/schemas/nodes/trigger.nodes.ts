import { z } from "zod";
import { baseNodeSchema } from "./base.nodes.js";

export const clickNodeSchema = baseNodeSchema.extend({
	name: z.literal("click"),
	task: z.literal("event.click"),
	type: z.literal("trigger"),
});

export type ClickNode = z.infer<typeof clickNodeSchema>;

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
	task: z.literal("event.wait"),
	type: z.union([z.literal("trigger"), z.literal("action")]),
	parameters: z.array(
		z.discriminatedUnion("name", [
			z.object({
				label: z.literal("Start on"),
				name: z.literal("start"),
				input: z.literal("dropdown"),
				value: z.enum(["time_period", "date_time"]),
				options: z.array(startOptionSchema),
				default: z.literal("time_period").optional(),
				required: z.literal(true).optional(),
			}),

			z.object({
				label: z.literal("Wait time"),
				name: z.literal("wait_time_period"),
				input: z.literal("number"),
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
				input: z.literal("dropdown"),
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
				input: z.literal("date-time"),
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

export type WaitingNode = z.infer<typeof waitingNodeSchema>;

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
