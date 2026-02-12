import type { NodeCredentials, NodeParameters } from "@nodebase/shared";
import {
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const nodeTypeEnum = pgEnum("nodesEnum", ["action", "trigger"]);
export const WorkflowStatusEnum = pgEnum("WorkflowStatusEnum", [
	"active",
	"cancelled",
	"executed",
	"failed",
	"running",
	"stopped",
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

export const userWorkflowsTable = pgTable(
	"user_workflows",
	{
		id: uuid().defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.references(() => usersTable.id)
			.notNull(),
		name: varchar({ length: 255 }).unique(),
		description: text(),
		status: WorkflowStatusEnum().$default(() => "active"),
		executionCount: integer("execution_count").notNull().default(0),
		lastExecutedAt: timestamp("last_executed_at"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [index("user_id_idx").on(t.userId)],
);

export const workflowNodesTable = pgTable(
	"workflow_nodes",
	{
		id: uuid().defaultRandom().primaryKey(),
		workflowId: uuid("workflow_id")
			.references(() => userWorkflowsTable.id, { onDelete: "cascade" })
			.notNull(),
		nodeId: uuid("node_id")
			.references(() => nodesTable.id)
			.notNull(),
		instanceId: uuid("instance_id").defaultRandom().notNull().unique(),
		positionX: integer("position_x"),
		positionY: integer("position_y"),
		name: varchar({ length: 255 }).notNull(),
		description: varchar({ length: 255 }),
		task: varchar({ length: 255 }).notNull(),
		type: varchar({ length: 255 }),
		credentials: jsonb().$type<NodeCredentials>(),
		parameters: jsonb().$type<NodeParameters[]>(),
		outputs: jsonb().$type<{ name: string; value: unknown }>().array(),
	},
	(t) => [
		index("workflow_instance_ids_idx").on(t.workflowId, t.instanceId),
		uniqueIndex("unique_workflow_instance").on(t.workflowId, t.instanceId),
	],
);

export const workflowConnectionsTable = pgTable(
	"workflow_connections",
	{
		id: uuid().defaultRandom().primaryKey(),
		workflowId: uuid("workflow_id")
			.references(() => userWorkflowsTable.id, { onDelete: "cascade" })
			.notNull(),
		sourceInstanceId: uuid("source_instance_id")
			.references(() => workflowNodesTable.instanceId)
			.notNull(),
		targetInstanceId: uuid("target_instance_id")
			.references(() => workflowNodesTable.instanceId)
			.notNull(),
		sourceOutput: varchar({ length: 255 }),
		targetInput: varchar({ length: 255 }),
	},
	(t) => [index("workflow_id_idx").on(t.workflowId)],
);

export const workflowExecutionTable = pgTable(
	"workflow_executions",
	{
		id: uuid().defaultRandom().primaryKey(),
		workflowId: uuid()
			.references(() => userWorkflowsTable.id)
			.notNull(),
		userId: uuid()
			.references(() => usersTable.id)
			.notNull(),
		status: WorkflowStatusEnum().default("running").notNull(),
		executedAt: timestamp("started_at").defaultNow().notNull(),
		completedAt: timestamp("started_at").notNull(),
		result: text(),
	},
	(t) => [index("workflow_id_idx").on(t.workflowId)],
);

export const nodeExecutionTable = pgTable(
	"node_executions",
	{
		id: uuid().defaultRandom().primaryKey(),
		workflowId: uuid()
			.references(() => userWorkflowsTable.id)
			.notNull(),
		instanceId: uuid("instance_id").references(() => workflowNodesTable.id),
		executedAt: timestamp("executed_at").defaultNow().notNull(),
		completedAt: timestamp("completed_at").notNull(),
		output: jsonb().$type<unknown>(),
	},
	(t) => [
		index("workflowId_idx").on(t.workflowId),
		index("workflow_instance_ids_idx").on(t.workflowId, t.instanceId),
	],
);
