import { baseNodeSchema } from "@nodebase/shared";
import { Router, type Router as routerType } from "express";
import { createNode, deleteNode } from "@/controllers/node.controller.js";
import { asyncHandler, validateRequest } from "@/utils/api.utils.js";
import { upload } from "@/utils/uploads.utils.js";

const router = Router() as routerType;

router.post(
	"/add",
	upload.single("icon"),
	validateRequest(baseNodeSchema, "body", { parse: true }),
	asyncHandler(createNode),
);
router.delete("/:id", asyncHandler(deleteNode));

export default router;
