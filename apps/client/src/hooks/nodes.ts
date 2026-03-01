import type { BaseNode } from "@nodebase/shared";
import { useMemo } from "react";
import { useAllNodesQuery } from "@/queries/nodes";

export function useSortedNodes():
	| {
			triggers: BaseNode[];
			actions: BaseNode[];
	  }
	| undefined {
	const { data: nodes } = useAllNodesQuery();
	return useMemo(() => {
		if (!nodes) return undefined;
		const actions = nodes
			.filter((node) => node.type === "action")
			.sort((a, b) => a.name.localeCompare(b.name));

		const triggers = nodes
			.filter((node) => node.type === "trigger")
			.sort((a, b) => a.name.localeCompare(b.name));

		return { actions, triggers };
	}, [nodes]);
}
