import type z from "zod";
import type { httpNodeSchema } from "@/schemas/nodes/action.nodes.js";

export type HTTPNode = z.infer<typeof httpNodeSchema>;
