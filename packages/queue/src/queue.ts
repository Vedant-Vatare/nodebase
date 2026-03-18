import { Queue } from "bullmq";
import "dotenv/config";
import type { WorkflowNode } from "@nodebase/shared";
import { QUEUE_NAME } from "./types.js";

export const connection = {
	host: process.env.REDIS_HOST || "localhost",
	port: 6379,
	maxRetriesPerRequest: null,
};

const workflowQueue = new Queue<WorkflowNode>(QUEUE_NAME, {
	connection,
	defaultJobOptions: {
		removeOnComplete: {
			age: 3 * 24 * 60 * 60,
			count: 1000,
		},
		removeOnFail: {
			age: 7 * 24 * 60 * 60,
			count: 500,
		},
	},
});

export async function addNodeInQueue(data: WorkflowNode) {
	return workflowQueue.add("execute-node", data);
}
