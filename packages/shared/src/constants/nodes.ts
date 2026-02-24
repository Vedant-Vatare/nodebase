import type { z } from "zod";
import {
	clickNodeSchema,
	conditionalNodeSchema,
	cronJobNodeSchema,
	httpNodeSchema,
	setVariableNodeSchema,
	waitingNodeSchema,
} from "@/schemas/index.js";

export type NodeDefinition = {
	type: string;
	label: string;
	description: string;

	inputs: { name: string; type: string }[];
	outputs: { name: string; type: string }[];
	defaultParams: Record<string, unknown>;
	schema: z.ZodObject;
};

export const TRIGGER_NODES: NodeDefinition[] = [
	{
		type: "trigger.cron",
		label: "Cron Job",
		description: "Run on a schedule",
		inputs: [],
		outputs: [{ name: "timestamp", type: "string" }],
		defaultParams: { expression: "* * * * *" },
		schema: cronJobNodeSchema,
	},
];

export const ACTION_NODES: NodeDefinition[] = [
	{
		type: "action.http",
		label: "HTTP Request",
		description: "Call an external API",
		inputs: [{ name: "trigger", type: "any" }],
		outputs: [
			{ name: "response", type: "object" },
			{ name: "status", type: "number" },
		],
		defaultParams: { method: "GET", url: "", headers: {}, body: null },
		schema: httpNodeSchema,
	},
	{
		type: "action.set_variable",
		label: "Set Variable",
		description: "Store a value",
		inputs: [{ name: "trigger", type: "any" }],
		outputs: [{ name: "value", type: "any" }],
		defaultParams: { key: "", value: "" },
		schema: setVariableNodeSchema,
	},
];

export const CONTROL_NODES: NodeDefinition[] = [
	{
		type: "control.condition",
		label: "Condition",
		description: "Branch on true/false",
		inputs: [{ name: "trigger", type: "any" }],
		outputs: [
			{ name: "true", type: "any" },
			{ name: "false", type: "any" },
		],
		defaultParams: { condition: "" },
		schema: conditionalNodeSchema,
	},
];

export const EVENT_NODES: NodeDefinition[] = [
	{
		type: "event.click",
		label: "Click",
		description: "Trigger on click",
		inputs: [],
		outputs: [{ name: "element", type: "string" }],
		defaultParams: { selector: "" },
		schema: clickNodeSchema,
	},
	{
		type: "event.wait",
		label: "Wait",
		description: "Delay execution",
		inputs: [{ name: "trigger", type: "any" }],
		outputs: [{ name: "done", type: "boolean" }],
		defaultParams: { duration: 1000 },
		schema: waitingNodeSchema,
	},
];

export const ALL_NODES = [
	...TRIGGER_NODES,
	...ACTION_NODES,
	...CONTROL_NODES,
	...EVENT_NODES,
];

export const NODE_REGISTRY = new Map(ALL_NODES.map((n) => [n.type, n]));

export const nodeSchemaRegistry = new Map(
	ALL_NODES.map((n) => [n.type, n.schema]),
);
