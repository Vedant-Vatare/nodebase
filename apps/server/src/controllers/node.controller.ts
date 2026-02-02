import { db, eq, nodesTable } from "@nodebase/db";
import type { baseNode } from "@nodebase/shared";
import type { Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { uploadFile } from "@/utils/uploads.utils.js";

export const createNode: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	if (!req.file) {
		throw createHttpError.BadRequest("Icon image is required");
	}

	const iconUrl = await uploadFile(req.file);

	if (!iconUrl) {
		throw createHttpError.InternalServerError("failed to upload image");
	}

	const nodeData = req.body as baseNode;

	const [node] = await db
		.insert(nodesTable)
		.values({
			name: nodeData.name,
			task: nodeData.task,
			description: nodeData.description,
			icon: iconUrl,
			parameters: nodeData.parameters,
			credentials: nodeData.credentials,
		})
		.returning();
	return res.status(201).json({ message: "node created successfully", node });
};

export const getAllNodes: RequestHandler = async (
	_req: Request,
	res: Response,
) => {
	const nodes = await db.select().from(nodesTable);
	return res.status(200).json({ message: "fetched all nodes", nodes });
};

type partialsBaseNode = Partial<baseNode>;

export const updateNode: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const nodeId = req.params.id as string;
	const data = req.body as partialsBaseNode;

	if (req.file) {
		data.icon = await uploadFile(req.file);
	}

	const updatedNode = await db
		.update(nodesTable)
		.set(data)
		.where(eq(nodesTable.id, nodeId))
		.returning();

	return res
		.status(200)
		.json({ message: "node updated successfully", updatedNode });
};

export const deleteNode: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const nodeId = req.params.id as string;

	if (!nodeId) throw createHttpError.BadRequest("Invalid node id");

	const query = await db.delete(nodesTable).where(eq(nodesTable.id, nodeId));

	if (query.rowCount === 0) {
		throw createHttpError.NotFound("Node not found");
	}

	return res.status(200).json({ message: "node deleted successfully" });
};
