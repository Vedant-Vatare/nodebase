ALTER TABLE "workflow_connections" ALTER COLUMN "source_port" SET DEFAULT 'default';--> statement-breakpoint
ALTER TABLE "workflow_connections" ALTER COLUMN "source_port" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_connections" ALTER COLUMN "target_port" SET DEFAULT 'default';--> statement-breakpoint
ALTER TABLE "workflow_connections" ALTER COLUMN "target_port" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "position_x" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "position_y" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "type" SET DATA TYPE "public"."nodesEnum" USING "type"::"public"."nodesEnum";--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "parameters" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "parameters" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "output_ports" SET DATA TYPE jsonb USING array_to_json(output_ports)::jsonb;
--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "output_ports" SET DEFAULT '[{"name":"default","label":"Default"}]'::jsonb;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "output_ports" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "input_ports" SET DATA TYPE jsonb USING array_to_json(input_ports)::jsonb;
--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "input_ports" SET DEFAULT '[{"name":"default","label":"Default"}]'::jsonb;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ALTER COLUMN "input_ports" SET NOT NULL;