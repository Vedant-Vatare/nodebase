import { createFileRoute, redirect } from "@tanstack/react-router";
import { Signup } from "@/pages/signup";

export const Route = createFileRoute("/auth/signup")({
	component: Signup,
	beforeLoad: () => {
		const token = localStorage.getItem("token");
		if (token) return redirect({ to: "/dashboard" });
	},
});
