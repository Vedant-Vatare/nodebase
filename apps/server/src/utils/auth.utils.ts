import bcrypt from "bcryptjs";

export const bcryptHash = async (data: string) => {
	return bcrypt.hash(data, 12);
};
