import type { NodeJobPayload, WorkflowJobPayload } from "@nodebase/queue";
import type { InputNode, WorkflowNode } from "@nodebase/shared";
import type { Job } from "bullmq";
import { httpNodeExecutor } from "./nodes/actions/http.node.js";
import { waitNodeExecutor } from "./nodes/actions/wait.node.js";
import { inputNodeExecutor } from "./nodes/triggers/input.node.js";
import { scheduleNodeExecutor } from "./nodes/triggers/schedule.node.js";
import type {
	CronNode,
	HttpNode,
	NodeExecutorOutput,
	TriggerNodeExecutorOutput,
	WaitNode,
} from "./types/nodes.js";
import { checkRequiredParameters } from "./utils/node.executor.utils.js";

export const executeNode = ({
	workflowId,
	node,
}: NodeJobPayload): Promise<NodeExecutorOutput> | NodeExecutorOutput => {
	const { valid, missing } = checkRequiredParameters(node.parameters);

	if (!valid) {
		return {
			success: false,
			message: `Missing required parameters: ${missing.join(", ")}`,
		};
	}
	switch (node.task) {
		case "action.http":
			return httpNodeExecutor(node as HttpNode, workflowId);
		case "action.wait":
			return waitNodeExecutor(node as WaitNode, workflowId);
		case "trigger.input":
			return inputNodeExecutor(node as InputNode);
		default:
			return {
				success: false,
				message: `node with given task does not exist: ${node.task}`,
			};
	}
};
export const executeTriggerNode = async (
	triggerNode: WorkflowNode,
	job: Job<WorkflowJobPayload>,
): Promise<TriggerNodeExecutorOutput> => {
	const { valid, missing } = checkRequiredParameters(triggerNode.parameters);

	if (!valid) {
		return {
			success: false,
			skipCurrentExecution: true,
			message: `Missing required parameters: ${missing.join(", ")}`,
		};
	}
	switch (triggerNode.task) {
		case "trigger.cron":
			return scheduleNodeExecutor(triggerNode as CronNode, job);
		case "trigger.click":
			return { success: true };
		default:
			return {
				success: false,
				skipCurrentExecution: true,
				message: `trigger node with given task does not exist: ${triggerNode.task}`,
			};
	}
};
