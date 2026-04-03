import {
	addNodeInQueue,
	connection,
	NODE_QUEUE_NAME,
	type NodeExecutionConfig,
	type PrevioudExecution,
	WORKFLOW_QUEUE_NAME,
	type WorkflowJobPayload,
	type WorkflowNodesWorker,
} from "@nodebase/queue";
import type { WorkflowConnection, WorkflowNode } from "@nodebase/shared";
import { type Job, QueueEvents, UnrecoverableError, Worker } from "bullmq";
import { executeTriggerNode } from "@/executer.js";
import {
	completeNodeExecutionQuery,
	createNodeExecutionQuery,
	createNodeExecutionRecordQuery,
	createWorflowExecutionQuery,
	deleteWorkflowExecutionQuery,
	updateUserWorkflowStatusQuery,
	updateWorkflowStatusQuery,
} from "@/queries/workflow.executions.js";
import {
	handlePreviousNodeExecution,
	nodeExecutionConfig,
} from "@/utils/node.executor.utils.js";

const nodeQueueEvents = new QueueEvents(NODE_QUEUE_NAME, { connection });
await nodeQueueEvents.waitUntilReady();

export const workflowWorker = new Worker(
	WORKFLOW_QUEUE_NAME,
	async (job: Job<WorkflowJobPayload>) => {
		console.log(
			`loading workflow: ${job.data.workflowId} via ${job.data.triggerType ?? "unknown"}`,
		);
		await job.updateData({ ...job.data, executionId: crypto.randomUUID() });

		await createWorflowExecutionQuery(
			job.data.executionId,
			job.data.userId,
			job.data.workflowId,
		);

		const triggerResult = await handleWorkflowTrigger(job);

		if (!triggerResult?.node || triggerResult?.skipCurrentExecution) {
			return { removeRecord: true };
		}
		const startNode = getStartNodeOfWorkflow(job, triggerResult.node);

		await handleSequentialNodeExecution(job, startNode);
	},
	{ connection, concurrency: 50 },
);

workflowWorker.on(
	"completed",
	async (job: Job<WorkflowJobPayload>, result: { removeRecord?: boolean }) => {
		if (!job) return;
		if (result?.removeRecord) {
			await deleteWorkflowExecutionQuery(job.data.executionId);
			console.log("workflow was recorded!", job.data.executionId);
			return;
		}
		console.log(
			"workflow execution complete for workflow:",
			job.data.workflowId,
			job.data.executionId,
		);
		await updateWorkflowStatusQuery(job.data.executionId, "executed");
		await updateUserWorkflowStatusQuery(job.data.workflowId, "active");
	},
);

workflowWorker.on(
	"failed",
	async (job: Job<WorkflowJobPayload> | undefined, err: Error) => {
		if (!job) return;
		console.error(err);

		await deleteWorkflowExecutionQuery(job.data.executionId);
		await updateWorkflowStatusQuery(job.data.executionId, "failed");
		await updateUserWorkflowStatusQuery(job.data.workflowId, "failed");
	},
);

workflowWorker.on("error", (err) => {
	console.error(err);
});

type WorkflowTrigger = {
	node?: WorkflowNode;
	skipCurrentExecution?: boolean;
};

const handleWorkflowTrigger = async (
	job: Job<WorkflowJobPayload>,
): Promise<WorkflowTrigger | null> => {
	const { nodes, triggerNodeId, triggerType } = job.data;
	if (!triggerType) {
		throw new UnrecoverableError(
			"triggerType is required for workflow execution",
		);
	}

	if (!triggerNodeId) {
		throw new UnrecoverableError("triggerNodeId is required");
	}

	const triggerNode = nodes.find((n) => n.id === triggerNodeId);

	if (!triggerNode) {
		throw new UnrecoverableError(
			`trigger node ${triggerNodeId} not found in workflow nodes`,
		);
	}

	if (triggerType === "schedule") {
		await createNodeExecutionRecordQuery(job.data.workflowId, triggerNode.id);
		return { node: triggerNode };
	}

	const executionId = await createNodeExecutionQuery(
		job.data.workflowId,
		triggerNode.id,
	);
	if (!executionId) {
		throw new UnrecoverableError("could not start trigger node execution");
	}

	/* runs the trigger node and also determines if trigger node and workflow 
  should continue executing */

	const nodeExecution = await executeTriggerNode(triggerNode, job);

	await completeNodeExecutionQuery(executionId, nodeExecution);

	return {
		node: triggerNode,
		skipCurrentExecution: nodeExecution.skipCurrentExecution,
	};
};

const handleSequentialNodeExecution = async (
	job: Job<WorkflowJobPayload>,
	startNode: WorkflowNode,
) => {
	const { nodes, connections, executionId, workflowId } = job.data;

	const pendingBranches: WorkflowNode[] = [];
	let currentNode: WorkflowNode | undefined = startNode;
	let previousExecution: PrevioudExecution = null;

	/* nodeconfigs is populated when current node is executed and its configs can be passed for the next node execution which is used by worker job configs. */
	let nodeConfigs: NodeExecutionConfig = {};

	while (currentNode) {
		const node = currentNode;

		// saving work for  previosly executed node
		handlePreviousNodeExecution(previousExecution, workflowId);
		const nodeJob = await addNodeInQueue(
			{ node, executionId, workflowId },
			nodeConfigs,
		);

		const nodeExecution = (await nodeJob.waitUntilFinished(
			nodeQueueEvents,
		)) as WorkflowNodesWorker;

		nodeConfigs = nodeExecutionConfig(node, nodeExecution?.output);
		previousExecution = {
			id: nodeExecution.id,
			nodeName: node.name,
			status: nodeExecution.status,
			output: nodeExecution.output,
		};

		currentNode = getNextNode(
			connections,
			node,
			nodes,
			nodeExecution?.allowedNodePorts ?? [],
			pendingBranches,
		);

		if (!currentNode && pendingBranches.length > 0) {
			currentNode = pendingBranches.pop();

			nodeConfigs = {};
			previousExecution = null;
		}
	}
};

const getStartNodeOfWorkflow = (
	job: Job<WorkflowJobPayload>,
	triggerNode: WorkflowNode,
) => {
	const { nodes, connections } = job.data;
	const triggerConnection = connections.find(
		(c) => c.sourceId === triggerNode.id,
	);
	const startNode = nodes.find((n) => n.id === triggerConnection?.targetId);

	if (!startNode) {
		throw new UnrecoverableError("trigger node has no connected action nodes");
	}

	return startNode;
};

const getNextNode = (
	connections: WorkflowConnection[],
	currentNode: WorkflowNode,
	allNodes: WorkflowNode[],
	allowedPorts: string[],
	pendingBranches: WorkflowNode[],
): WorkflowNode | undefined => {
	const outgoing = connections.filter(
		(c) =>
			c.sourceId === currentNode.id &&
			(allowedPorts.length === 0 || allowedPorts.includes(c.sourcePort)),
	);

	if (outgoing.length === 0) return undefined;

	const nextNodes = outgoing
		.map((c) => allNodes.find((n) => n.id === c.targetId))
		.filter((n): n is WorkflowNode => n !== undefined);

	if (nextNodes.length === 0) return undefined;

	nextNodes.sort((a, b) => a.positionY - b.positionY);

	pendingBranches.push(...nextNodes.slice(1).reverse());

	return nextNodes[0];
};
