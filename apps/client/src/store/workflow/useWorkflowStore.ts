import { create } from "zustand";
import type { WorkflowCanvasNode } from "@/constants/nodes";

type WorkflowTriggerNode = {
	id: string;
	workflowId: string;
	task: string;
	name: string;
};

type WorkflowStore = {
	selectedNode: WorkflowCanvasNode | null;
	setSelectedNode: (node: WorkflowCanvasNode) => void;
	clearSelectedNode: () => void;
	triggerNodes: WorkflowTriggerNode[];
	setTriggerNodes: (nodes: WorkflowTriggerNode[]) => void;
	isSelectingTriggerForExecution: boolean;
	setIsSelectingTriggerForExecution: (value: boolean) => void;
	executionTriggerFocusRequestKey: number;
	requestExecutionTriggerFocus: () => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
	selectedNode: null,
	setSelectedNode: (node: WorkflowCanvasNode) => set({ selectedNode: node }),
	clearSelectedNode: () => set({ selectedNode: null }),
	triggerNodes: [],
	setTriggerNodes: (nodes) => set({ triggerNodes: nodes }),
	isSelectingTriggerForExecution: false,
	setIsSelectingTriggerForExecution: (value) =>
		set({ isSelectingTriggerForExecution: value }),
	executionTriggerFocusRequestKey: 0,
	requestExecutionTriggerFocus: () =>
		set((state) => ({
			executionTriggerFocusRequestKey:
				state.executionTriggerFocusRequestKey + 1,
		})),
}));
