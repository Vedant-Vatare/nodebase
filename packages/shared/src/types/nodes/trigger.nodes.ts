import type z from "zod";
import type {
	clickNodeSchema,
	cronJobNodeSchema,
	waitingNodeSchema,
} from "@/schemas/nodes/trigger.nodes.js";

export type ClickNode = z.infer<typeof clickNodeSchema>;

export type WaitingNode = z.infer<typeof waitingNodeSchema>;

export type CronJobNode = z.infer<typeof cronJobNodeSchema>;
