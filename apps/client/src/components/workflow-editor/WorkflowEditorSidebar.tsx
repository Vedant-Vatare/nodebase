import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	ACTION_NODES_UI,
	type Node_UI,
	TRIGGER_NODES_UI,
} from "@/constants/nodes";

const NodeItem = ({ node }: { node: Node_UI }) => {
	const Icon = node.icon;
	return (
		<div className="flex gap-2 items-center">
			<Icon
				strokeWidth={2}
				className="h-6 w-6 p-1 rounded-sm"
				style={{
					color: node.color ?? "currentColor",
					background: node.background ?? "#21212A",
					fill: node.fill ?? "none",
				}}
			/>
			<span>{node.name}</span>
		</div>
	);
};

export const WorkflowEditorSidebar = () => {
	return (
		<Sidebar side="right" collapsible="offcanvas" className="h-screen">
			<SidebarRail />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Triggers</SidebarGroupLabel>
					<SidebarMenu className="gap-1 text-sm tracking-tight [word-spacing:0.125rem]">
						{TRIGGER_NODES_UI.map((node) => {
							return (
								<SidebarMenuItem
									key={node.type}
									className="cursor-pointer hover:bg-background p-1.5 rounded-sm pl-2.5"
								>
									<NodeItem node={node} />
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Actions</SidebarGroupLabel>
					<SidebarMenu className="text-sm gap-1 tracking-tight">
						{ACTION_NODES_UI.map((node) => {
							return (
								<SidebarMenuItem
									key={node.type}
									className="cursor-pointer hover:bg-background p-1.5 rounded-sm pl-2.5"
								>
									<NodeItem node={node} />
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
