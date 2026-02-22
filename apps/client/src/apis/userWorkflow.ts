import type { UserWorkflow } from "@nodebase/shared";
import api from "./axios";

export const getUserWorkflowsApi = async () => {
	const respose = await api.get<{ userWorkflows: UserWorkflow[] }>(
		"/workflows/all",
	);
	return respose.data.userWorkflows;
};
