import { useQuery } from "@tanstack/react-query";
import { getUserWorkflowsApi } from "@/apis/userWorkflow";

export const useUserWorkflowQuery = () =>
	useQuery({
		queryKey: ["user-workflows"],
		queryFn: getUserWorkflowsApi,
	});
