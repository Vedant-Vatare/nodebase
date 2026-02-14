import type z from "zod";
import type { setVariableNodeSchema } from "@/schemas/nodes/transform.nodes.js";

export type SetvariableNode = z.infer<typeof setVariableNodeSchema>;
