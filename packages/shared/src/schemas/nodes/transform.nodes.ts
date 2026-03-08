import { z } from "zod";
import { baseNodeSchema, nodeParameterSchema } from "./base.nodes.js";

export const setVariableNodeSchema = baseNodeSchema.extend({
	task: z.literal("action.set_variable"),
	type: z.literal("action"),
	parameters: z.array(
		z.discriminatedUnion("name", [
			nodeParameterSchema.extend({
				label: z.literal("Variable Name"),
				name: z.literal("variable_name"),
				type: z.literal("input"),
				value: z.string(),
				required: z.boolean(),
			}),
			nodeParameterSchema.extend({
				label: z.literal("Value"),
				name: z.literal("value"),
				type: z.literal("input"),
				value: z.union([z.string(), z.number(), z.boolean()]),
				required: z.boolean(),
			}),
		]),
	),
});
