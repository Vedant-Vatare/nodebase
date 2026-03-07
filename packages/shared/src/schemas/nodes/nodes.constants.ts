import type z from "zod";
import {
	httpNodeSchema,
	mergeDataSchema,
	waitingNodeSchema,
} from "./action.nodes.js";
import { conditionalNodeSchema } from "./control.nodes.js";
import { setVariableNodeSchema } from "./transform.nodes.js";
import {
	clickNodeSchema,
	cronJobNodeSchema,
	InputNodeSchema,
} from "./trigger.nodes.js";

export const nodeSchemaRegistry = new Map<string, z.ZodObject>([
	["action.http", httpNodeSchema],
	["action.merge", mergeDataSchema],
	["action.wait", waitingNodeSchema],
	["action.set_variable", setVariableNodeSchema],
	["trigger.input", InputNodeSchema],
	["trigger.cron", cronJobNodeSchema],
	["event.click", clickNodeSchema],
	["control.condition", conditionalNodeSchema],
]);
