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

export const workflowNodeSchema = baseNodeSchema.extend({
	workflowId: z.string(),
	nodeId: z.string(),
	instanceId: z.string(),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
	settings: z.record(z.string(), z.unknown()),
});

export const workflowConnectionSchema = z.object({
	id: z.string(),
	workflowId: z.string(),
	sourceInstanceId: z.string(),
	targetInstanceId: z.string(),
	sourceOutput: z.string(),
	targetInput: z.string(),
});
