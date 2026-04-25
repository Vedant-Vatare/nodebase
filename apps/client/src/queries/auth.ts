import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginApi, signupApi } from "@/apis/auth";
import { router } from "@/main";
import { getErrorMessage } from "@/utils/error";

export const useSignupQuery = () =>
	useMutation({
		mutationFn: signupApi,
		onSuccess: (response) => {
			localStorage.setItem("token", response.data.token);
			router.navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});

export const useLoginQuery = () =>
	useMutation({
		mutationFn: loginApi,
		onSuccess: (response) => {
			localStorage.setItem("token", response.data.token);
			router.navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
