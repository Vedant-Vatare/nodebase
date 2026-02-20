import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signup } from "@/apis/auth";
export const useSignupQuery = () =>
	useMutation({
		mutationFn: signup,
		onSuccess: (response) => {
			localStorage.setItem("token", response.data.token);
		},
		onError: (error) => {
			console.log(error.message);
			toast.error(error.message || "failed to signup");
		},
	});
