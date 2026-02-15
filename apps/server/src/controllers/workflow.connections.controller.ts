import { db, eq, workflowConnectionsTable } from "@nodebase/db";
import type {
	partialWorkflowConnection,
	WorkflowConnection,
} from "@nodebase/shared";
import type { Request, Response } from "express";
import createHttpError from "http-errors";

export const addWorkflowConnection = async (req: Request, res: Response) => {
	const workflowConnection = req.body as WorkflowConnection;

	const [newWorkflowConnection] = await db
		.insert(workflowConnectionsTable)
		.values(workflowConnection)
		.returning();

	return res.status(201).json({
		message: "node connections created",
		workflowConnection: newWorkflowConnection,
	});
};

export const getAllConnectionsInWorkflow = async (
	req: Request,
	res: Response,
) => {
	const workflowId = req.params.workflowId as string;

	if (!workflowId) {
		throw createHttpError.BadRequest("invalid workflow id");
	}

	const workflowConnections = await db
		.select()
		.from(workflowConnectionsTable)
		.where(eq(workflowConnectionsTable.workflowId, workflowId));

	return res.status(200).json({
		message: "workflow connections fetched successfully",
		workflowConnections,
	});
};

export const updateNodeConnection = async (req: Request, res: Response) => {
	const worflowConnection = req.body as partialWorkflowConnection;

	const [updatedConnection] = await db
		.update(workflowConnectionsTable)
		.set(worflowConnection)
		.where(eq(workflowConnectionsTable.id, worflowConnection.id))
		.returning();

	return res.status(200).json({
		message: "node connection updated",
		updatedNodeConnection: updatedConnection,
	});
};

export const removeNodeConnection = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	if (!id) {
		throw createHttpError.BadRequest("invalid workflow id");
	}
	const query = await db
		.delete(workflowConnectionsTable)
		.where(eq(workflowConnectionsTable.id, id));

	if (query.rowCount === 0) {
		throw createHttpError.NotFound("node connection does not exist");
	}

	return res.status(200).json({ message: "node connection deleted" });
};
