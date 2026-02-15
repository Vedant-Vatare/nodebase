import {
	clickNodeSchema,
	conditionalNodeSchema,
	cronJobNodeSchema,
	httpNodeSchema,
	type PartialWorkflowNode,
	setVariableNodeSchema,
	waitingNodeSchema,
	workflowNodeSchema,
} from "@nodebase/shared";
import type { NextFunction, Request, Response } from "express";
import { flattenError, type z } from "zod";
export const nodeSchemaRegistry = new Map<string, z.ZodObject>([
	["action.http", httpNodeSchema],
	["control.condition", conditionalNodeSchema],
	["event.click", clickNodeSchema],
	["event.wait", waitingNodeSchema],
	["trigger.cron", cronJobNodeSchema],
	["action.set_variable", setVariableNodeSchema],
]);

type NodeValidationResult =
	| { success: true; data: Record<string, unknown> }
	| {
			success: false;
			error: {
				fieldErrors: Record<string, string[] | undefined>;
				formErrors: string[];
			};
	  };

type NodeValidationOptions = {
	partial?: boolean;
};

export const validateNodeSchema = (
	node: unknown,
	options: NodeValidationOptions = {},
): NodeValidationResult => {
	if (!node || typeof node !== "object") {
		throw new Error("Node data must be an object");
	}

	const nodeData = node as { task?: string };

	if (!nodeData.task) {
		throw new Error("Missing 'task' field in node data");
	}

	const schema = nodeSchemaRegistry.get(nodeData.task);

	if (!schema) {
		throw new Error(`No schema found for task: ${nodeData.task}`);
	}
	const extendedSchema = schema.merge(workflowNodeSchema);

	const validationSchema = options.partial
		? extendedSchema.partial()
		: extendedSchema;

	const zodResult = validationSchema.safeParse(node);
	if (!zodResult.success) {
		return { success: false, error: flattenError(zodResult.error) };
	}

	return { success: true, data: zodResult.data };
};

export const validateNodeMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const validationResult = validateNodeSchema(req.body.node);

	if (validationResult.success) {
		next();
	} else {
		return res.status(400).json({
			error: "ValidationError",
			message: "Invalid data",
			errors: validationResult.error,
		});
	}
};
export const validatePartialNodeMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const validationResult = validateNodeSchema(req.body.node, { partial: true });
	if (validationResult.success) {
		req.body.validatedNode = validationResult.data as PartialWorkflowNode;
		next();
	} else {
		return res.status(400).json({
			error: "ValidationError",
			message: "Invalid data",
			errors: validationResult.error,
		});
	}
};
