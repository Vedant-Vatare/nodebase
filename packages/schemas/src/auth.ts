import z from "zod";

export const signupSchema = z.object({
	fullname: z.string(),
	email: z.email({ error: "invalid email address" }),
	password: z
		.string()
		.min(8, "Must be at least 8 characters")
		.regex(/[A-Z]/, "password must contain at least one uppercase letter")
		.regex(/[a-z]/, "password must contain at least one lowercase letter")
		.regex(/[0-9]/, "password must contain at least one number"),
});

export type SignupType = z.infer<typeof signupSchema>;
