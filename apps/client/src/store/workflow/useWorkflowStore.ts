import type { WorkflowNode } from "@nodebase/shared";
import { create } from "zustand";

type WorkflowStore = {
	selectedNode: WorkflowNode | null;
	setSelectedNode: (node: WorkflowNode) => void;
	clearSelectedNode: () => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
	selectedNode: null,
	setSelectedNode: (node: WorkflowNode) => set({ selectedNode: node }),
	clearSelectedNode: () => set({ selectedNode: null }),
}));
