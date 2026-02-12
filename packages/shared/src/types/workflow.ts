import type { z } from "zod";
import type {
	userWorkflowSchema,
	workflowConnectionSchema,
	workflowNodeSchema,
} from "@/schemas/workflow.js";

export type WorkflowStatus =
	| "active"
	| "stopped"
	| "running"
	| "executed"
	| "failed";

export type CreateWorkflow = {
	name: string;
	description: string;
	status: "active";
	executionCount: 0;
};

export type UserWorkflow = z.infer<typeof userWorkflowSchema>;
export type WorkflowNode = z.infer<typeof workflowNodeSchema>;
export type WorkflowConnection = z.infer<typeof workflowConnectionSchema>;
