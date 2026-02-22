import { DashboardSquare01Icon, Workflow } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import BrandIcon from "@/assets/icons/flowmation_temp.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/_mainLayout")({
	component: Layout,
});

function NavItem({
	to,
	label,
	icon: Icon,
	badge = 0,
}: {
	to: string;
	label: string;
	icon: IconSvgElement;
	badge?: number;
}) {
	const { location } = useRouterState();
	const active = location.pathname.startsWith(to);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={active} tooltip={label}>
				<Link to={to}>
					<HugeiconsIcon icon={Icon} strokeWidth={2} />

					<span>{label}</span>
				</Link>
			</SidebarMenuButton>
			{badge > 0 && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
		</SidebarMenuItem>
	);
}

function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarRail />
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							className="hover:bg-background py-3"
						>
							<Link to="/dashboard" className="py-0.5 p-1">
								<div className="flex flex-col gap-0.5 leading-none">
									<div className="flex max-h-9 max-w-9 gap-2 items-center ">
										<img src={BrandIcon} alt="flowmation logo" />
										<span className="text-md">Flowmation</span>
									</div>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarMenu className="gap-1.5">
						<NavItem
							to="/dashboard"
							label="Dashboard"
							icon={DashboardSquare01Icon}
						/>
						<NavItem to="/workflows" label="Workflows" icon={Workflow} />
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem></SidebarMenuItem>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="size-7 rounded-lg">
										<AvatarFallback className="rounded-lg bg-violet-100 text-indigo-500 text-xs font-semibold">
											JD
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col gap-0.5 leading-none text-left">
										<span className="font-medium text-sm">Jane Doe</span>
										<span className="text-xs text-muted-foreground">
											jane@example.com
										</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-56" align="start">
								<DropdownMenuItem asChild>
									<Link to="/">
										<Settings className="mr-2 size-4" />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="text-destructive focus:text-destructive">
									<LogOut className="mr-2 size-4" />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex h-full flex-col overflow-auto">
				<header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				<div className="flex-1 overflow-auto">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
