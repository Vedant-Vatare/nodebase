import { createFileRoute } from "@tanstack/react-router";
import { WorkflowEditorPage } from "@/pages/workflowEditor";

export const Route = createFileRoute("/_mainLayout/workflow/$workflowId")({
	component: WorkflowEditorPage,
});
