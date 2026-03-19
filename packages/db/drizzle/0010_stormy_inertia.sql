ALTER TABLE "workflow_executions" RENAME COLUMN "workflowId" TO "workflow_id";--> statement-breakpoint
ALTER TABLE "workflow_executions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "workflow_executions" DROP CONSTRAINT "workflow_executions_workflowId_user_workflows_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow_executions" DROP CONSTRAINT "workflow_executions_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX "workflow_exec_workflowId_idx";--> statement-breakpoint
ALTER TABLE "workflow_executions" ALTER COLUMN "started_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_user_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."user_workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_exec_workflowId_idx" ON "workflow_executions" USING btree ("workflow_id");