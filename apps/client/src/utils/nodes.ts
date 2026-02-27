import type { WorkflowConnection, WorkflowNode } from "@nodebase/shared";
import type { Edge } from "@xyflow/react";
import ClickIcon from "@/assets/icons/nodes/click.svg?react";
import ConditionalIcon from "@/assets/icons/nodes/conditional.svg?react";
import GoogleIcon from "@/assets/icons/nodes/google.svg?react";
import HTTPIcon from "@/assets/icons/nodes/http.svg?react";
import SetVarIcon from "@/assets/icons/nodes/set-var.svg?react";
import WaitIcon from "@/assets/icons/nodes/wait.svg?react";
import type {
	NodeUI,
	WorkflowCanvasNode,
	WorkflowNodeData,
} from "@/constants/nodes";

const NODE_REGISTRY: Record<string, NodeUI> = {
	"event.click": {
		name: "Click",
		icon: ClickIcon,
		background: "#0496ff",
		color: "#ffffff",
	},
	"action.http": {
		name: "HTTP Request",
		icon: HTTPIcon,
		background: "#736ced",
		color: "#ffffff",
	},
	"action.google.search": {
		name: "Google",
		icon: GoogleIcon,
		background: "linear-gradient(135deg, red, blue)",
		color: "#ffffff",
	},
	"action.set_variable": {
		name: "Set Variable",
		icon: SetVarIcon,
		background: "#119da4",
		color: "#ffffff",
	},
	"control.condition": {
		name: "Condition",
		icon: ConditionalIcon,
		background: "#8338EC",
		color: "#ffffff",
	},
	"event.wait": {
		name: "Wait",
		icon: WaitIcon,
		background: "#FF9F1C",
		color: "#ffffff",
	},
};

const FALLBACK_UI: NodeUI = {
	name: "Unknown",
	icon: ClickIcon,
	background: "#6366f1",
	color: "#ffffff",
};

export const getNodeUI = (task: string): NodeUI => {
	return NODE_REGISTRY[task] ?? { ...FALLBACK_UI, name: task };
};

export const toCanvasNode = (node: WorkflowNode): WorkflowCanvasNode => ({
	id: node.instanceId,
	type: "workflowNode",
	position: { x: node.positionX ?? 0, y: node.positionY ?? 0 },
	data: {
		...node,
		ui: getNodeUI(node.task),
	},
});

export const toCanvasNodes = (nodes: WorkflowNode[]): WorkflowCanvasNode[] => {
	return nodes.map(toCanvasNode);
};

export const toServerNode = (node: WorkflowCanvasNode): WorkflowNode => {
	const { ui, ...rest } = node.data as WorkflowNodeData & { ui: NodeUI };
	return rest as WorkflowNode;
};

export const toCanvasEdge = (conn: WorkflowConnection): Edge => ({
	id: conn.id ?? `${conn.sourceInstanceId}-${conn.targetInstanceId}`,
	source: conn.sourceInstanceId,
	target: conn.targetInstanceId,
	sourceHandle: conn.sourceOutput,
	targetHandle: conn.targetInput,
});

export const toCanvasEdges = (connections: WorkflowConnection[]): Edge[] => {
	return connections.map(toCanvasEdge);
};
