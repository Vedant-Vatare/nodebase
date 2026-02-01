import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const bcryptHash = async (data: string) => {
	return bcrypt.hash(data, 12);
};

export const createJWT = async (
	data: string | Record<string, string> | Buffer,
) => {
	return jwt.sign(data, process.env.JWT_secret as string, {
		algorithm: "HS256",
		expiresIn: "14d",
	});
};

export const verifyJWT = async (token: string) => {
	return jwt.verify(token, process.env.JWT_secret as string);
};
