import { db, nodesTable } from "@nodebase/db";
import type { baseNode } from "@nodebase/shared";
import type { Request, RequestHandler, Response } from "express";

export const createNode: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const nodeData = req.body as baseNode;
	const [node] = await db
		.insert(nodesTable)
		.values({
			name: nodeData.name,
			task: nodeData.task,
			description: nodeData.description,
			icon: nodeData.icon,
			parameters: nodeData.parameters,
			credentials: nodeData.credentials,
		})
		.returning();
	return res.status(201).json({ message: "node created successfully", node });
};
