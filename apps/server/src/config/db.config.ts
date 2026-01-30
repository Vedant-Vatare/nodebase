import { createDb } from "@nodebase/db";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = createDb(pool);
export { pool };
