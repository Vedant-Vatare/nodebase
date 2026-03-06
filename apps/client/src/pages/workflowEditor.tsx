import { ReactFlowProvider } from "@xyflow/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import WorkflowCanvas from "@/components/workflow-editor/WorkflowCanvas";
import { WorkflowEditorSidebar } from "@/components/workflow-editor/WorkflowEditorSidebar";

export const WorkflowEditorPage = () => {
	return (
		<ReactFlowProvider>
			<div className="h-screen bg-card">
				<SidebarProvider
					className="w-full h-full"
					style={
						{
							"--sidebar-width": "18rem",
							"--sidebar-width-mobile": "20rem",
							"--sidebar-width-max": "16rem",
						} as React.CSSProperties
					}
				>
					<WorkflowCanvas />
					<WorkflowEditorSidebar />
				</SidebarProvider>
			</div>
		</ReactFlowProvider>
	);
};
