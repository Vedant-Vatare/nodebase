import type { userLogin, userSignup } from "@nodebase/shared";
import api from "./axios";

export const signupApi = (data: userSignup) => {
	return api.post<{ token: string }>("/auth/signup", data);
};
export const loginApi = (data: userLogin) => {
	return api.post<{ token: string }>("/auth/login", data);
};
