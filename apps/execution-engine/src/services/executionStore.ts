import { redis } from "@/config/redis.js";

export const storeNodeOutput = async (
	workflowId: string,
	nodeName: string,
	output: unknown,
) => {
	const key = `exec:${workflowId}:nodes`;

	await redis.hset(key, nodeName, JSON.stringify(output));
	await redis.expire(key, 3600);
};

export const getNodeOutput = async (
	workflowId: string,
	nodeName: string,
): Promise<unknown> => {
	const key = `exec:${workflowId}:nodes`;

	const data = await redis.hget(key, nodeName);

	return data ? JSON.parse(data) : null;
};
