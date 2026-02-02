import { baseNodeSchema } from "@nodebase/shared";
import { Router, type Router as routerType } from "express";
import { createNode } from "@/controllers/node.controller.js";
import { asyncHandler, validateRequest } from "@/utils/api.utils.js";

const router = Router() as routerType;

router.post(
	"/add",
	validateRequest(baseNodeSchema, "body"),
	asyncHandler(createNode),
);

export default router;
