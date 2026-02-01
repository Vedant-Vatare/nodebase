import { DrizzleQueryError } from "@nodebase/db";
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import { DatabaseError } from "pg";
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
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req, res, next)).catch((error) => {
			next(error);
		});
	};

export const isDBQueryError = (error: unknown): DatabaseError | null => {
	if (
		error instanceof DrizzleQueryError &&
		error.cause instanceof DatabaseError
	) {
		return error.cause;
	} else {
		return null;
	}
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const dbErrorMap = {
		"23505": { status: 409, message: "Duplicate entry exists" },
		"23503": { status: 400, message: "Referenced resource not found" },
		"23502": { status: 400, message: "Required field is missing" },
		"23514": { status: 400, message: "Check constraint violation" },
		"42703": { status: 500, message: "Database schema error" },
		"42P01": { status: 500, message: "Database table not found" },
	} as const;

	const dbError = isDBQueryError(err);

	if (dbError) {
		const errorCode = dbError.code as keyof typeof dbErrorMap;
		const mappedError = dbErrorMap[errorCode];

		if (mappedError) {
			return res.status(mappedError.status).json({
				message: mappedError.message,
			});
		}
	}

	const statusCode =
		"statusCode" in err && typeof err.statusCode === "number"
			? err.statusCode
			: 500;

	const message = err instanceof Error ? err.message : "something went wrong";

	return res.status(statusCode).json({ message });
};
