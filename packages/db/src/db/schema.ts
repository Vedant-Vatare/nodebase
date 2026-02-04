import type { NodeCredentials, NodeParameters } from "@nodebase/shared";
import {
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const nodeTypeEnum = pgEnum("nodesEnum", ["action", "trigger"]);

export const usersTable = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	email: varchar({ length: 255 }).notNull().unique(),
	name: varchar({ length: 255 }).notNull(),
	password: text(),
	googleOauthId: varchar("google_oauth_id", { length: 255 }).unique(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const nodesTable = pgTable("nodes", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).unique().notNull(),
	task: varchar({ length: 255 }).unique().notNull(),
	description: text().notNull(),
	icon: text().notNull(),
	parameters: jsonb().$type<NodeParameters[]>().notNull(),
	credentials: jsonb().$type<NodeCredentials[]>(),
	settings: jsonb(),
});
