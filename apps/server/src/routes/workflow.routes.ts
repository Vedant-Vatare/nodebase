import { createWorkflowSchema } from "@nodebase/shared";
import { Router, type Router as RouterType } from "express";
import {
	createWorkflow,
	getAllUserWorkflow,
	getUserWorkflow,
} from "@/controllers/workflow.controller.js";
import { validateRequest } from "@/utils/api.utils.js";
import { authenticateUser } from "@/utils/auth.utils.js";

const router = Router() as RouterType;
router.post(
	"/new",
	authenticateUser,
	validateRequest(createWorkflowSchema, "body"),
	createWorkflow,
);

router.get("/all", authenticateUser, getAllUserWorkflow);
router.get("/:id", authenticateUser, getUserWorkflow);

export default router;
