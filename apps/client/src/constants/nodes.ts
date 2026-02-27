import type { WorkflowNode } from "@nodebase/shared";
import type { Node } from "@xyflow/react";
import type { FC, SVGProps } from "react";
import ClickIcon from "@/assets/icons/nodes/click.svg?react";
import ConditionalIcon from "@/assets/icons/nodes/conditional.svg?react";
import GoogleIcon from "@/assets/icons/nodes/google.svg?react";
import HTTPIcon from "@/assets/icons/nodes/http.svg?react";
import SetVarIcon from "@/assets/icons/nodes/set-var.svg?react";
import WaitIcon from "@/assets/icons/nodes/wait.svg?react";

export type NodeUI = {
	name: string;
	icon: FC<SVGProps<SVGSVGElement>>;
	color?: string;
	background?: string;
	fill?: string;
};

export type WorkflowNodeData = WorkflowNode & {
	ui: NodeUI;
} & Record<string, unknown>;

export type WorkflowCanvasNode = Node<WorkflowNodeData>;

export const TRIGGER_NODES_UI: NodeUI[] = [
	{
		name: "Click",
		icon: ClickIcon,
		background: "#0496ff",
	},
	{ name: "API", icon: HTTPIcon, background: "#736ced" },
];

export const ACTION_NODES_UI: NodeUI[] = [
	{
		name: "Google",
		icon: GoogleIcon,
		color: "#4285F4",
	},
	{
		name: "Set Variable",
		icon: SetVarIcon,
	},
	{
		name: "Condition",
		icon: ConditionalIcon,
		background: "#8338EC",
	},
	{ name: "Wait", icon: WaitIcon, background: "#FF9F1C" },
];
