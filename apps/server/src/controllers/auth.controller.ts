import { db, usersTable } from "@nodebase/db";
import type { userSignup } from "@nodebase/shared";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { isDBQueryError } from "@/utils/api.utils.js";
import { bcryptHash } from "@/utils/auth.utils.js";

export const Signup = async (req: Request, res: Response) => {
	try {
		const { password, name, email } = req.body as userSignup;
		const hashedPassword = await bcryptHash(password);

		const [user] = await db
			.insert(usersTable)
			.values({ name, email, password: hashedPassword })
			.returning();

		if (!user) {
			throw createHttpError(400, "Failed to create user");
		}

		return res.status(201).json({ message: "user signup success", user });
	} catch (e) {
		const queryError = isDBQueryError(e);

		if (queryError?.code === "23505") {
			throw createHttpError(400, "email already exists");
		}
		throw e;
	}
};
