import type { usersTable } from "@nodebase/db";
import type z from "zod";
import type { userSignupSchema } from "@/schemas/auth.js";

export type userSignup = z.infer<typeof userSignupSchema>;
export type InsertUser = typeof usersTable.$inferInsert;
