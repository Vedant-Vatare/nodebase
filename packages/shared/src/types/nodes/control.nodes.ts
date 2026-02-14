import type z from "zod";
import type { conditionalNodeSchema } from "@/schemas/nodes/control.nodes.js";

export type ConditionalNode = z.infer<typeof conditionalNodeSchema>;
