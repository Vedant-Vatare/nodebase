import type {
	conditionalNodeSchema,
	cronJobNodeSchema,
	httpNodeSchema,
	waitingNodeSchema,
} from "@nodebase/shared";
import type z from "zod";

export type NodeExecutorOutput = {
	success?: boolean;
	message?: string;
	output?: unknown;
	status?: "completed" | "waiting" | "stopped";
	allowedOutputPorts?: string[];
};

export type TriggerNodeExecutorOutput = NodeExecutorOutput & {
	// if current trigger node and workflow should be executed or not and be marked as executed
	skipCurrentExecution?: boolean;
};

export type HttpNode = z.infer<typeof httpNodeSchema>;
export type WaitNode = z.infer<typeof waitingNodeSchema>;
export type CronNode = z.infer<typeof cronJobNodeSchema>;
export type ConditionNode = z.infer<typeof conditionalNodeSchema>;
