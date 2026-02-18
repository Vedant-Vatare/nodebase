import z from "zod";

export const userSignupSchema = z.object({
	name: z.string({ error: "Invalid name field" }),
	email: z.email({ error: "Invalid email field" }),
	password: z
		.string()
		.min(8, { error: "password must be at least 8 characters long" })
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
			error: "Must contain uppercase, lowercase, and a number",
		}),
});

export const userLoginSchema = z.object({
	email: z.email({ error: "Invalid email field" }),
	password: z
		.string()
		.min(8, { error: "password must be at least 8 characters long" })
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/),
});
