ALTER TABLE "workflow_connections" RENAME COLUMN "sourceOutput" TO "source_output";--> statement-breakpoint
ALTER TABLE "workflow_connections" RENAME COLUMN "targetInput" TO "target_input";--> statement-breakpoint
ALTER TABLE "workflow_nodes" RENAME COLUMN "outputs" TO "outputPorts";--> statement-breakpoint
ALTER TABLE "workflow_nodes" ADD COLUMN "inputPorts" jsonb[];