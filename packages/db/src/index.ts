import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

export function createDb(pool: Pool) {
	return drizzle({
		client: pool,
		casing: "snake_case",
	});
}

export * from "./db/schema";
