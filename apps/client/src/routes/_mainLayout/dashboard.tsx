import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <h1>Dashboard</h1>;
}
