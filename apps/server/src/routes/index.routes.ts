import { Router, type Router as routerType } from "express";
import authRouter from "@/routes/auth.routes.js";

const router = Router() as routerType;

router.use("/auth", authRouter);

export default router;
