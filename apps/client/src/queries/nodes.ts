import { useQuery } from "@tanstack/react-query";
import { getAllNodesApi } from "@/apis/nodes";

export const useAllNodesQuery = () =>
	useQuery({
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		queryKey: ["all-nodes"],
		queryFn: getAllNodesApi,
	});
