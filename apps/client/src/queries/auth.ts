import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginApi, signupApi } from "@/apis/auth";
import { getErrorMessage } from "@/utils/error";

export const useSignupQuery = () =>
	useMutation({
		mutationFn: signupApi,
		onSuccess: (response) => {
			localStorage.setItem("token", response.data.token);
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
		},
		onError: (error) => {
			const message = getErrorMessage(error);
			toast.error(message);
		},
	});
