import { z } from "zod";
import {
	baseNodeSchema,
	nodeOutputPortsSchema,
	nodeParameterSchema,
} from "./base.nodes.js";

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
	type: z.literal("action"),
	task: z.literal("action.condition"),
	parameters: z.array(
		z.discriminatedUnion("name", [
			nodeParameterSchema.extend({
				name: z.literal("left_operand"),
				type: z.literal("input"),
				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.boolean(),
			}),
			nodeParameterSchema.extend({
				name: z.literal("right_operand"),
				type: z.literal("input"),
				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.boolean(),
			}),
			nodeParameterSchema.extend({
				name: z.literal("operator"),
				type: z.literal("dropdown"),
				options: z
					.array(z.object({ label: z.string(), value: z.string() }))
					.optional(),
				value: comparisonOperatorsEnum,
				required: z.boolean(),
			}),
		]),
	),
	outputPorts: z.array(nodeOutputPortsSchema).default([
		{ name: "true", label: "True" },
		{ name: "false", label: "False" },
	]),
});
