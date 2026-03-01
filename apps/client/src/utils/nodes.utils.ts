import type {
	BaseNode,
	NodeParameters,
	WorkflowConnection,
	WorkflowNode,
} from "@nodebase/shared";
import type { Edge } from "@xyflow/react";
import {
	DEFAULT_UI,
	NODE_UI_REGISTRY,
	type NodeUI,
	type PortDefinition,
	type WorkflowCanvasNode,
	type WorkflowNodeData,
} from "@/constants/nodes";

export const toCanvasNode = (node: WorkflowNode): WorkflowCanvasNode => ({
	id: node.id ?? crypto.randomUUID(),
	type: "workflowNode",
	position: { x: node.positionX ?? 100, y: node.positionY ?? 100 },
	data: {
		id: node.id ?? "",
		name: node.name,
		task: node.task,
		type: node.type as WorkflowNodeData["type"],
		description: node.description,
		parameters: (node.parameters as WorkflowNodeData["parameters"]) ?? [],
		inputPorts: (node.inputPorts as WorkflowNodeData["inputPorts"]) ?? [],
		outputPorts: (node.outputPorts as WorkflowNodeData["outputPorts"]) ?? [],
		ui: getNodeUI(node.task),
	},
});

export function getNodeUI(task: string): NodeUI {
	return NODE_UI_REGISTRY[task] ?? { ...DEFAULT_UI, name: task };
}

export function getNodeColorByTask(task: string): string {
	return NODE_UI_REGISTRY[task]?.background ?? "#6366f1";
}

export function createCanvasNode(
	apiNode: BaseNode,
	position: { x: number; y: number } = { x: 100, y: 100 },
): WorkflowCanvasNode {
	const id = crypto.randomUUID();
	const ui = getNodeUI(apiNode.task);

	return {
		id,
		type: "workflowNode",
		position,
		data: {
			id,
			task: apiNode.task,
			name: ui.name,
			type: apiNode.type as WorkflowNodeData["type"],
			description: apiNode.description,
			ui,
			inputPorts: (apiNode.inputPorts as PortDefinition[]) ?? [
				{ name: "default", label: "Default" },
			],
			outputPorts: (apiNode.outputPorts as PortDefinition[]) ?? [
				{ name: "default", label: "Default" },
			],
			parameters: structuredClone(
				(apiNode.parameters as NodeParameters[]) ?? [],
			),
		},
	};
}

export function toApiNode(
	canvasNode: WorkflowCanvasNode,
	workflowId: string,
	nodeId: string,
): Omit<WorkflowNode, "id"> {
	const { ui: _ui, ...data } = canvasNode.data;

	return {
		nodeId,
		workflowId,
		name: data.name,
		task: data.task,
		type: data.type,
		description: data.description ?? "",
		parameters: data.parameters,
		inputPorts: data.inputPorts,
		outputPorts: data.outputPorts,
		positionX: canvasNode.position.x,
		positionY: canvasNode.position.y,
	};
}

export const toCanvasNodes = (nodes: WorkflowNode[]): WorkflowCanvasNode[] =>
	nodes.map(toCanvasNode);

export const toCanvasEdge = (conn: WorkflowConnection): Edge => ({
	id: conn.id ?? crypto.randomUUID(),
	source: conn.sourceId,
	target: conn.targetId,
	sourceHandle: conn.sourcePort,
	targetHandle: conn.targetPort,
});

export const toCanvasEdges = (connections: WorkflowConnection[]): Edge[] =>
	connections.map(toCanvasEdge);
