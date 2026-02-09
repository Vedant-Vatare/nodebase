import { Router, type Router as routerType } from "express";
import authRouter from "@/routes/auth.routes.js";
import nodeRouter from "@/routes/node.routes.js";
import workflowRouter from "@/routes/workflow.routes.js";

const router = Router() as routerType;

router.use("/auth", authRouter);
router.use("/nodes", nodeRouter);
router.use("/workflows", workflowRouter);

export default router;
