import type { BaseNode } from "@nodebase/shared";
import api from "./axios";

export const getAllNodesApi = async () => {
	return (await api.get("/nodes/all")).data.nodes as BaseNode[];
};
