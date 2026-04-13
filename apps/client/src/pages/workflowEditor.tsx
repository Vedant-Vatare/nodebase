import { ReactFlowProvider } from "@xyflow/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import WorkflowCanvas from "@/components/workflow-editor/WorkflowCanvas";
import { WorkflowEditorSidebar } from "@/components/workflow-editor/WorkflowEditorSidebar";

export const WorkflowEditorPage = () => {
	return (
		<ReactFlowProvider>
			<div className="h-screen bg-card">
				<SidebarProvider
					sidebarId="workflow-editor"
					defaultWidth={288}
					minWidth={256}
					maxWidth={544}
					collapseThreshold={176}
					className="w-full h-full"
				>
					<WorkflowCanvas />
					<WorkflowEditorSidebar />
				</SidebarProvider>
			</div>
		</ReactFlowProvider>
	);
};
