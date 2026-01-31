import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import { flattenError, type ZodObject } from "zod";

type requestField = "body" | "params" | "query";

export const validateRequest = (
	schema: ZodObject,
	field: requestField,
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!field) {
			return res.status(500).json({
				error: "InternalServerError",
				message: "request field not assigned",
			});
		}

		const zodResponse = schema.safeParse(req[field]);

		if (!zodResponse.success) {
			return res.status(400).json({
				message: "Invalid data",
				errors: flattenError(zodResponse.error),
			});
		}

		next();
	};
};

export const asyncHandler =
	(handler: RequestHandler) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res, next);
		} catch (error) {
			next(error);
		}
	};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const dbErrorMap = {
		"23505": { status: 409, message: "Duplicate entry exists" },
		"23503": { status: 400, message: "Referenced resource not found" },
		"23502": { status: 400, message: "Required field is missing" },
	} as const;

	if (err?.code && err.code in dbErrorMap) {
		const dbError = dbErrorMap[err.code as keyof typeof dbErrorMap];
		return res.status(dbError.status).json({
			message: dbError.message,
		});
	}

	console.log("Error", err);
	const statusCode = err?.statusCode || 500;
	const message = err?.message || "something went wrong";

	return res.status(statusCode).json({ message });
};
