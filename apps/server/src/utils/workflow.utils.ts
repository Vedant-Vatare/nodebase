import { db, eq, userWorkflowsTable } from "@nodebase/db";
import { addWorkflowInQueue, type WorkflowTriggerType } from "@nodebase/queue";
import createHttpError from "http-errors";

export const enqueueWorkflow = async (
	workflowId: string,
	userId: string,
	triggerNodeId: string,
	triggerType: WorkflowTriggerType,
) => {
	const workflowData = await db.query.userWorkflowsTable.findFirst({
		where: eq(userWorkflowsTable.id, workflowId),
		with: {
			nodes: true,
			connections: true,
		},
	});
	if (!workflowData) throw createHttpError.NotFound("Workflow not found");

	if (workflowData.userId !== userId) throw createHttpError.Unauthorized();

	await addWorkflowInQueue({
		workflowId: workflowId,
		userId,
		executionId: crypto.randomUUID(),
		nodes: workflowData.nodes,
		connections: workflowData.connections,
		triggerNodeId,
		triggerType,
	});
};
