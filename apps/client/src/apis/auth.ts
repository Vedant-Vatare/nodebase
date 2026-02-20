import type { userSignup } from "@nodebase/shared";
import api from "./axios";

export const signup = (data: userSignup) => {
	return api.post<{ token: string }>("/auth/signup", data);
};
