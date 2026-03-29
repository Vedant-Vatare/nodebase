import {
	db,
	eq,
	nodeExecutionTable,
	userWorkflowsTable,
	workflowExecutionTable,
} from "@nodebase/db";
import type { WorkflowStatus } from "@nodebase/shared";

export const updateWorkflowStatusQuery = async (
	id: string,
	status: WorkflowStatus,
) => {
	return await db
		.update(workflowExecutionTable)
		.set({ status })
		.where(eq(workflowExecutionTable.id, id))
		.returning();
};

export const updateUserWorkflowStatusQuery = async (
	id: string,
	status: WorkflowStatus,
) => {
	return await db
		.update(userWorkflowsTable)
		.set({ status })
		.where(eq(userWorkflowsTable.id, id))
		.returning();
};

export const createNodeExecutionQuery = async (
	workflowId: string,
	instanceId: string,
) => {
	const [execution] = await db
		.insert(nodeExecutionTable)
		.values({ workflowId, instanceId })
		.returning({ id: nodeExecutionTable.id });
	return execution?.id;
};

export const completeNodeExecutionQuery = async (
	id: string,
	output: unknown,
) => {
	return await db
		.update(nodeExecutionTable)
		.set({ completedAt: new Date(), output })
		.where(eq(nodeExecutionTable.id, id));
};
