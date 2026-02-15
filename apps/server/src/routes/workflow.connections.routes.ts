import {
	partialWorkflowConnectionSchema,
	workflowConnectionSchema,
} from "@nodebase/shared";
import { Router, type Router as RouterType } from "express";
import {
	addWorkflowConnection,
	getAllConnectionsInWorkflow,
	removeNodeConnection,
	updateNodeConnection,
} from "@/controllers/workflow.connections.controller.js";
import { asyncHandler, validateRequest } from "@/utils/api.utils.js";
import { authenticateUser } from "@/utils/auth.utils.js";

const router = Router() as RouterType;

router.use(authenticateUser);

router.post(
	"/",
	validateRequest(workflowConnectionSchema, "body"),
	asyncHandler(addWorkflowConnection),
);

router.get("/:workflowId", asyncHandler(getAllConnectionsInWorkflow));
router.patch(
	"/",
	validateRequest(partialWorkflowConnectionSchema, "body"),
	asyncHandler(updateNodeConnection),
);
router.delete("/:id", asyncHandler(removeNodeConnection));

export default router;
