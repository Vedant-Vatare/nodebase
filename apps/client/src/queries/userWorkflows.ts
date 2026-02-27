import { useQuery } from "@tanstack/react-query";
import {
	getUserWorkflowsApi,
	getWorkflowConnections,
	getWorkflowNodes,
} from "@/apis/userWorkflow";

export const useUserWorkflowQuery = () =>
	useQuery({
		queryKey: ["user-workflows"],
		queryFn: getUserWorkflowsApi,
	});

export const useWorkflowNodesQuery = (workflowId: string) =>
	useQuery({
		queryKey: ["workflow-nodes", { workflowId }],
		queryFn: () => getWorkflowNodes(workflowId),
	});

export const useWorkflowConnectionsQuery = (workflowId: string) =>
	useQuery({
		queryKey: ["workflow-connections", { workflowId }],
		queryFn: () => getWorkflowConnections(workflowId),
	});
