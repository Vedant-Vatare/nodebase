import { Router, type Router as RouterType } from "express";
import {
	addNodeInWorkflow,
	deleteNodeInWorkflow,
	getNodesInWorkflow,
	updateNodeInWorkflow,
} from "@/controllers/workflow.nodes.controller.js";
import { asyncHandler } from "@/utils/api.utils.js";
import { authenticateUser } from "@/utils/auth.utils.js";
import {
	validateNodeMiddleware,
	validatePartialNodeMiddleware,
} from "@/utils/nodes.utils.js";

const router = Router() as RouterType;

router.use(authenticateUser);

router.post("/", validateNodeMiddleware, asyncHandler(addNodeInWorkflow));
router.get("/:workflowId", asyncHandler(getNodesInWorkflow));
router.patch(
	"/",
	validatePartialNodeMiddleware,
	asyncHandler(updateNodeInWorkflow),
);
router.delete("/", asyncHandler(deleteNodeInWorkflow));

export default router;
