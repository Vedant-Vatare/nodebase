import {
	addNodeInQueue,
	connection,
	NODE_QUEUE_NAME,
	type NodeExecutionConfig,
	type PrevioudExecution,
	WORKFLOW_QUEUE_NAME,
	type WorkflowJobPayload,
} from "@nodebase/queue";
import { type Job, QueueEvents, Worker } from "bullmq";
import {
	updateUserWorkflowStatusQuery,
	updateWorkflowStatusQuery,
} from "@/queries/workflow.executions.js";
import {
	handlePreviousNodeExecution,
	nodeExecutionConfig,
} from "@/utils/node.executor.utils.js";

const nodeQueueEvents = new QueueEvents(NODE_QUEUE_NAME, { connection });

export const workflowWorker = new Worker(
	WORKFLOW_QUEUE_NAME,
	async (job: Job<WorkflowJobPayload>) => {
		console.log("executing workflow:", job.data.workflowId);
		await handleSequentialNodeExecution(job);
	},
	{ connection },
);

workflowWorker.on("completed", async (job: Job<WorkflowJobPayload>) => {
	console.log("workflow execution complete for workflow:", job.data.workflowId);
	await updateWorkflowStatusQuery(job.data.executionId, "executed");
	await updateUserWorkflowStatusQuery(job.data.workflowId, "active");
});

workflowWorker.on(
	"failed",
	async (job: Job<WorkflowJobPayload> | undefined, err: Error) => {
		if (!job) return;
		console.error(err);
		await updateWorkflowStatusQuery(job.data.executionId, "failed");
		await updateUserWorkflowStatusQuery(job.data.workflowId, "failed");
	},
);

workflowWorker.on("error", (err) => {
	console.error(err);
});

const handleSequentialNodeExecution = async (job: Job<WorkflowJobPayload>) => {
	const { nodes, connections, executionId, workflowId } = job.data;

	const targetIds = new Set(connections.map((c) => c.targetId));
	const startNode = nodes.find((n) => !targetIds.has(n.id));
	if (!startNode) throw new Error("no start node found");

	let currentId: string | undefined = startNode.id;

	/* nodeconfigs is populated when current node is executed and its configs can be passed for the next node execution which is used by worker job configs. */
	let previousExecution: PrevioudExecution = null;
	let nodeConfigs: NodeExecutionConfig = {};

	while (currentId) {
		const node = nodes.find((n) => n.id === currentId);
		if (!node) throw new Error(`node ${currentId} not found`);

		// saving work for  previosly executed node
		handlePreviousNodeExecution(previousExecution, workflowId);

		const nodeJob = await addNodeInQueue(
			{ node, executionId, workflowId },
			nodeConfigs,
		);

		const nodeExecution = await nodeJob.waitUntilFinished(nodeQueueEvents);

		nodeConfigs = nodeExecutionConfig(node, nodeExecution?.output);
		previousExecution = {
			id: nodeExecution.id,
			nodeName: node.name,
			status: nodeExecution.status,
			output: nodeExecution.output,
		};

		currentId = connections.find((c) => c.sourceId === currentId)?.targetId;
	}
};
