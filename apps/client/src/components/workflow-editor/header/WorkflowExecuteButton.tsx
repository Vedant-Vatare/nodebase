import { Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { useExecuteWorkflow } from "@/queries/userWorkflows";
import { useWorkflowStore } from "@/store/workflow/useWorkflowStore";

const getTriggerExecutionType = (
	task: string,
): "trigger" | "webhook" | "schedule" => {
	if (task.includes("webhook")) return "webhook";
	if (task.includes("cron") || task.includes("schedule")) return "schedule";
	return "trigger";
};

export const WorkflowExecuteButton = () => {
	const triggerNodes = useWorkflowStore((s) => s.triggerNodes);
	const isSelectingTriggerForExecution = useWorkflowStore(
		(s) => s.isSelectingTriggerForExecution,
	);
	const setIsSelectingTriggerForExecution = useWorkflowStore(
		(s) => s.setIsSelectingTriggerForExecution,
	);
	const requestExecutionTriggerFocus = useWorkflowStore(
		(s) => s.requestExecutionTriggerFocus,
	);
	const { mutate: executeWorkflow } = useExecuteWorkflow();

	const handleExecute = () => {
		if (triggerNodes.length === 0) {
			toast.info("Add a trigger node in canvas to execute workflow.");
			return;
		}

		if (triggerNodes.length === 1) {
			const trigger = triggerNodes[0];
			if (!trigger) return;
			executeWorkflow({
				workflowId: trigger.workflowId,
				triggerNodeId: trigger.id,
				triggerType: getTriggerExecutionType(trigger.task),
			});
			setIsSelectingTriggerForExecution(false);
			return;
		}

		setIsSelectingTriggerForExecution(!isSelectingTriggerForExecution);
		requestExecutionTriggerFocus();
	};

	return (
		<ShineBorder
			className="rounded-md"
			borderWidth={2}
			duration={3.5}
			color="hsl(var(--primary))"
			disabled={isSelectingTriggerForExecution}
		>
			<Button
				size="sm"
				className="min-w-32 gap-2 rounded-md bg-primary text-primary-foreground"
				onClick={handleExecute}
				type="button"
			>
				<Play className="size-4" />
				Execute
			</Button>
		</ShineBorder>
	);
};
