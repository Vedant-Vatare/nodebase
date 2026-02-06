import type {
	NodeCredentials,
	NodeParameters,
	WorkflowConnection,
	WorkflowNode,
} from "@nodebase/shared";
import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const nodeTypeEnum = pgEnum("nodesEnum", ["action", "trigger"]);
export const WorkflowStatusEnum = pgEnum("WorkflowStatusEnum", [
	"active",
	"stopped",
	"running",
	"executed",
	"failed",
]);

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
});

export const workflowsTable = pgTable("workflows", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => usersTable.id)
		.notNull(),
	name: varchar({ length: 255 }).unique(),
	description: text(),
	status: WorkflowStatusEnum().$default(() => "active"),
	nodes: jsonb().$type<WorkflowNode[]>(),
	connections: jsonb().$type<WorkflowConnection[]>(),
	executionCount: integer("execution_count").notNull().default(0),
	lastExecutedAt: timestamp("last_executed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
