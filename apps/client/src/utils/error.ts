import axios from "axios";

export const getErrorMessage = (
	error: unknown,
	fallback = "Something went wrong",
) => {
	if (axios.isAxiosError<{ message: string }>(error)) {
		return error.response?.data?.message || fallback;
	}
	return fallback;
};
