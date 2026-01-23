import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "./db/schema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool, casing: "snake_case" });

async function main() {
	const user: typeof usersTable.$inferInsert = {
		name: "John",
		email: "john@example.com",
	};

	await db.insert(usersTable).values(user);
	console.log("New user created!");

	const users = await db.select().from(usersTable);
	console.log("Getting all users from the database: ", users);

	await db
		.update(usersTable)
		.set({
			name: "edited name",
		})
		.where(eq(usersTable.email, user.email));
	console.log("User info updated!");

	await db.delete(usersTable).where(eq(usersTable.email, user.email));
	console.log("User deleted!");
}

main();
