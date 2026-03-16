import type { PartialWorkflowNode, WorkflowNode } from "@nodebase/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	addWorkflowNodeApi,
	addWorkflowNodeConnApi,
	deleteWorkflowConnApi,
	deleteWorkflowNodeApi,
	getUserWorkflowsApi,
	getWorkflowConnections,
	getWorkflowNodes,
	updateNodesPositionApi,
	updateWorkflowNodeApi,
	updateWorkflowNodeConnApi,
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

export const useAddWorkflowNode = () =>
	useMutation({
		mutationFn: (node: WorkflowNode) => addWorkflowNodeApi(node),
	});

export const useDeleteWorkflowNode = () =>
	useMutation({
		mutationFn: ({ id, workflowId }: { id: string; workflowId: string }) =>
			deleteWorkflowNodeApi(id, workflowId),
	});

export const useUpdateWorkflowNode = () =>
	useMutation({
		mutationFn: (node: PartialWorkflowNode) => updateWorkflowNodeApi(node),
	});

export const useAddWorkflowConn = () =>
	useMutation({
		mutationFn: addWorkflowNodeConnApi,
	});

export const useDeleteWorkflowConn = () =>
	useMutation({
		mutationFn: ({ id }: { id: string }) => deleteWorkflowConnApi(id),
	});

export const useUpdateWorkflowConn = () =>
	useMutation({
		mutationFn: updateWorkflowNodeConnApi,
	});

export const useUpdateNodesPositions = () =>
	useMutation({
		mutationFn: updateNodesPositionApi,
	});
