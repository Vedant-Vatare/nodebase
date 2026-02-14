import z from "zod";
import { baseNodeSchema } from "./index.js";

export const setVariableNodeSchema = baseNodeSchema.extend({
	name: z.literal("set variable"),
	task: z.literal("action.set_variable"),
	type: z.literal("action"),
	description: z
		.literal("store a value in a variable for later use")
		.optional(),
	parameters: z.array(
		z.discriminatedUnion("name", [
			z.object({
				label: z.literal("Variable Name"),
				name: z.literal("variable_name"),
				input: z.literal("text"),
				value: z.string().optional(),
				required: z.literal(true).optional(),
			}),
			z.object({
				label: z.literal("Value"),
				name: z.literal("value"),
				input: z.literal("text"),
				value: z.union([z.string(), z.number(), z.boolean()]).optional(),
				required: z.literal(true).optional(),
			}),
		]),
	),
	outputs: z
		.tuple([
			z.object({
				name: z.literal("variable"),
				value: z.unknown(),
			}),
		])
		.optional(),
});
