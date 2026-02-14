CREATE TABLE "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"task" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"parameters" jsonb NOT NULL,
	"credentials" jsonb,
	CONSTRAINT "nodes_name_unique" UNIQUE("name"),
	CONSTRAINT "nodes_task_unique" UNIQUE("task")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" text,
	"google_oauth_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_oauth_id_unique" UNIQUE("google_oauth_id")
);
