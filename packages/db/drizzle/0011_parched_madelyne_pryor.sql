ALTER TABLE "node_executions" RENAME COLUMN "workflowId" TO "workflow_id";--> statement-breakpoint
ALTER TABLE "node_executions" DROP CONSTRAINT "node_executions_workflowId_user_workflows_id_fk";
--> statement-breakpoint
DROP INDEX "node_exec_workflowId_idx";--> statement-breakpoint
DROP INDEX "node_exec_workflowInstanceIds_idx";--> statement-breakpoint
ALTER TABLE "node_executions" ALTER COLUMN "instance_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "node_executions" ALTER COLUMN "completed_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "node_executions" ADD CONSTRAINT "node_executions_workflow_id_user_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."user_workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "node_exec_workflowId_idx" ON "node_executions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "node_exec_workflowInstanceIds_idx" ON "node_executions" USING btree ("workflow_id","instance_id");