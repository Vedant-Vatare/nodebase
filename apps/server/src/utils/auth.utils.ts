import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) throw createHttpError.Unauthorized();

	const userCredentials = await verifyJWT(token);
	res.locals.userId = userCredentials.userId;
	next();
};

export const bcryptHash = async (data: string) => {
	return bcrypt.hash(data, 12);
};

export const bcryptCompareHash = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

interface jwt_Payload extends jwt.JwtPayload {
	userId: string;
}

export const createJWT = async (data: jwt_Payload) => {
	return jwt.sign(data, process.env.JWT_secret as string, {
		algorithm: "HS256",
		expiresIn: "14d",
	});
};

export const verifyJWT = async (token: string) => {
	try {
		return jwt.verify(token, process.env.JWT_secret as string) as jwt_Payload;
	} catch (e: unknown) {
		if (e instanceof jwt.TokenExpiredError) {
			throw new Error("Token expired");
		}
		if (e instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid JWT Token");
		}
		throw createHttpError.Unauthorized("failed to verify token");
	}
};
