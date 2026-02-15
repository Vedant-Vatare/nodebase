import z from "zod";
import { baseNodeSchema } from "./nodes/index.js";

const workflowStatusEnum = z.enum([
	"active",
	"cancelled",
	"executed",
	"failed",
	"running",
	"stopped",
]);

export const userWorkflowSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: workflowStatusEnum.default("active"),
	executionCount: z.number(),
	lastExecutedAt: z.iso.datetime().optional(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const createWorkflowSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: z.literal("active").default("active"),
	executionCount: z.literal(0).default(0),
	lastExecutedAt: z.iso.datetime().optional(),
});

export const workflowNodeSchema = baseNodeSchema.omit({ icon: true }).extend({
	workflowId: z.string(),
	nodeId: z.string(),
	description: z.string().optional(),
	instanceId: z.string(),
	positionX: z.number(),
	positionY: z.number(),
	settings: z.record(z.string(), z.unknown()),
	inputPorts: z.array(z.object({ name: z.string(), label: z.string() })),
	outputPorts: z.array(z.object({ name: z.string(), label: z.string() })),
});

export const partialWorkflowNodeSchema = workflowNodeSchema.partial();

export const workflowConnectionSchema = z.object({
	id: z.string().optional(),
	workflowId: z.string(),
	sourceInstanceId: z.string(),
	targetInstanceId: z.string(),
	sourceOutput: z.string(),
	targetInput: z.string(),
});

export const partialWorkflowConnectionSchema = workflowConnectionSchema
	.partial()
	.extend({ id: z.string() });
