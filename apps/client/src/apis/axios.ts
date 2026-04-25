import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { router } from "@/main";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log({ error });
		if (!(error instanceof AxiosError)) return Promise.reject(error);
		const errorMessage = error.response?.data.message;
		if (error.response?.status === 401 && errorMessage === "Token expired") {
			localStorage.removeItem("token");
			toast.info(
				"you token was expired.\n Login again to continue with your account",
			);
			router.navigate({ to: "/auth/login" });
		}
		if (errorMessage === "Invalid JWT Token") {
			localStorage.removeItem("token");
			toast.info(
				"Invalid authentication token.\n Login again to continue with your account",
			);
			router.navigate({ to: "/auth/login" });
		}
		return Promise.reject(error);
	},
);

export default api;
