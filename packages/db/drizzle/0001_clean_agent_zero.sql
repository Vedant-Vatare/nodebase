CREATE TYPE "public"."WorkflowStatusEnum" AS ENUM('active', 'cancelled', 'executed', 'failed', 'running', 'stopped');--> statement-breakpoint
CREATE TYPE "public"."nodesEnum" AS ENUM('action', 'trigger');--> statement-breakpoint
CREATE TABLE "node_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflowId" uuid NOT NULL,
	"instance_id" uuid,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp NOT NULL,
	"output" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255),
	"description" text,
	"status" "WorkflowStatusEnum",
	"execution_count" integer DEFAULT 0 NOT NULL,
	"last_executed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_workflows_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "workflow_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"source_instance_id" uuid NOT NULL,
	"target_instance_id" uuid NOT NULL,
	"sourceOutput" varchar(255),
	"targetInput" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflowId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"status" "WorkflowStatusEnum" DEFAULT 'running' NOT NULL,
	"started_at" timestamp NOT NULL,
	"result" text
);
--> statement-breakpoint
CREATE TABLE "workflow_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	"instance_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"position_x" integer,
	"position_y" integer,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"task" varchar(255) NOT NULL,
	"type" varchar(255),
	"credentials" jsonb,
	"parameters" jsonb,
	"outputs" jsonb[],
	CONSTRAINT "workflow_nodes_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
ALTER TABLE "node_executions" ADD CONSTRAINT "node_executions_workflowId_user_workflows_id_fk" FOREIGN KEY ("workflowId") REFERENCES "public"."user_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_executions" ADD CONSTRAINT "node_executions_instance_id_workflow_nodes_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."workflow_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workflows" ADD CONSTRAINT "user_workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_connections" ADD CONSTRAINT "workflow_connections_workflow_id_user_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."user_workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_connections" ADD CONSTRAINT "workflow_connections_source_instance_id_workflow_nodes_instance_id_fk" FOREIGN KEY ("source_instance_id") REFERENCES "public"."workflow_nodes"("instance_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_connections" ADD CONSTRAINT "workflow_connections_target_instance_id_workflow_nodes_instance_id_fk" FOREIGN KEY ("target_instance_id") REFERENCES "public"."workflow_nodes"("instance_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflowId_user_workflows_id_fk" FOREIGN KEY ("workflowId") REFERENCES "public"."user_workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_workflow_id_user_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."user_workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "node_exec_workflowId_idx" ON "node_executions" USING btree ("workflowId");--> statement-breakpoint
CREATE INDEX "node_exec_workflowInstanceIds_idx" ON "node_executions" USING btree ("workflowId","instance_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "user_workflows" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_conn_workflowId_idx" ON "workflow_connections" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_exec_workflowId_idx" ON "workflow_executions" USING btree ("workflowId");--> statement-breakpoint
CREATE INDEX "workflow_instance_ids_idx" ON "workflow_nodes" USING btree ("workflow_id","instance_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_workflow_instance" ON "workflow_nodes" USING btree ("workflow_id","instance_id");