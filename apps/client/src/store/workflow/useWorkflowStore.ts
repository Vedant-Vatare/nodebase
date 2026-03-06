import { create } from "zustand";
import type { WorkflowCanvasNode } from "@/constants/nodes";

type WorkflowStore = {
	selectedNode: WorkflowCanvasNode | null;
	setSelectedNode: (node: WorkflowCanvasNode) => void;
	clearSelectedNode: () => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
	selectedNode: null,
	setSelectedNode: (node: WorkflowCanvasNode) => set({ selectedNode: node }),
	clearSelectedNode: () => set({ selectedNode: null }),
}));
