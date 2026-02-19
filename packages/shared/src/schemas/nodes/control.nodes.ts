import { z } from "zod";
import { baseNodeSchema } from "./base.nodes.js";

export const comparisonOperatorsEnum = z.enum([
	"eq",
	"neq",
	"gt",
	"lt",
	"gte",
	"lte",
	"con",
	"emt",
]);

export const conditionalNodeSchema = baseNodeSchema.extend({
	name: z.literal("conditional node"),
	type: z.literal("control"),
	task: z.literal("control.condition"),
	parameters: z.array(
		z.discriminatedUnion("name", [
			z.object({
				name: z.literal("left_operand"),
				type: z.literal("input"),

				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.literal(true).optional(),
			}),
			z.object({
				name: z.literal("right_operand"),
				type: z.literal("input"),
				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.literal(true).optional(),
			}),
			z.object({
				name: z.literal("operator"),
				type: z.literal("dropdown"),
				options: comparisonOperatorsEnum,
				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.literal(true).optional(),
			}),
		]),
	),
	outputs: z
		.union([
			z.object({ name: z.literal("true"), value: z.unknown() }),
			z.object({ name: z.literal("false") }),
		])
		.optional(),
});
