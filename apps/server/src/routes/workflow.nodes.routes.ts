import { workflowNodeSchema } from "@nodebase/shared";
import { Router, type Router as RouterType } from "express";
import { addNodeInWorkflow } from "@/controllers/workflow.nodes.controller.js";
import { validateRequest } from "@/utils/api.utils.js";
import { authenticateUser } from "@/utils/auth.utils.js";

const router = Router() as RouterType;

router.post(
	"/add",
	authenticateUser,
	validateRequest(workflowNodeSchema, "body"),
	addNodeInWorkflow,
);
export default router;
