import { userSignupSchema } from "@nodebase/shared";
import { Router, type Router as routerType } from "express";
import { Signup } from "@/controllers/auth.controller.js";
import { asyncHandler, validateRequest } from "@/utils/api.utils.js";

const router = Router() as routerType;

router.post(
	"/signup",
	validateRequest(userSignupSchema, "body"),
	asyncHandler(Signup),
);

export default router;
