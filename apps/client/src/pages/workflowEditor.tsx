import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkflowEditorSidebar } from "@/components/workflow-editor/WorkflowEditorSidebar";

export const WorkflowEditorPage = () => {
	return (
		<div className="h-screen bg-card">
			<SidebarProvider
				defaultOpen={true}
				style={
					{
						"--sidebar-width": "16rem",
						"--sidebar-width-mobile": "20rem",
					} as React.CSSProperties
				}
			>
				<div className="flex-1 overflow-hidden">the canvas</div>
				<WorkflowEditorSidebar />
			</SidebarProvider>
		</div>
	);
};
