import type z from "zod";
import type {
	httpNodeSchema,
	mergeDataSchema,
	waitingNodeSchema,
} from "@/schemas/nodes/action.nodes.js";

export type HTTPNode = z.infer<typeof httpNodeSchema>;

export type WaitingNode = z.infer<typeof waitingNodeSchema>;

export type MergeData = z.infer<typeof mergeDataSchema>;
