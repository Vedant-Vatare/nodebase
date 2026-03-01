import type {
	UserWorkflow,
	WorkflowConnection,
	WorkflowNode,
} from "@nodebase/shared";
import api from "./axios";

export const getUserWorkflowsApi = async () => {
	const respose = await api.get<{ userWorkflows: UserWorkflow[] }>(
		"/workflows/all",
	);
	return respose.data.userWorkflows;
};

export const getWorkflowNodes = async (workflowId: string) => {
	const response = await api.get<{ workflow: WorkflowNode[] }>(
		`/workflow-nodes/${workflowId}`,
	);

	return response.data.workflow;
};
export const getWorkflowConnections = async (workflowId: string) => {
	const response = await api.get<{ workflowConnections: WorkflowConnection[] }>(
		`/workflow-connections/${workflowId}`,
	);

	return response.data.workflowConnections;
};

export const addWorkflowNode = async (node: WorkflowNode) => {
	const response = await api.post<{ userWorkflowNode: WorkflowNode }>(
		"/workflow-nodes",
		{
			node,
		},
	);
	return response.data.userWorkflowNode;
};
