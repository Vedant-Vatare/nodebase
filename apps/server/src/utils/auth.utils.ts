import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const bcryptHash = async (data: string) => {
	return bcrypt.hash(data, 12);
};

export const bcryptCompareHash = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

type jwt_Payload = {
	userId: string;
};

export const createJWT = async (data: jwt_Payload) => {
	return jwt.sign(data, process.env.JWT_secret as string, {
		algorithm: "HS256",
		expiresIn: "14d",
	});
};

export const verifyJWT = async (token: string) => {
	return jwt.verify(token, process.env.JWT_secret as string);
};
