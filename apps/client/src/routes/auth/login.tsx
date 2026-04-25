import { createFileRoute, redirect } from "@tanstack/react-router";
import { Login } from "@/pages/login";

export const Route = createFileRoute("/auth/login")({
	component: Login,
	beforeLoad: () => {
		const token = localStorage.getItem("token");
		if (token) return redirect({ to: "/dashboard" });
	},
});
