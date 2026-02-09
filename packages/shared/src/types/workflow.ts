export type WorkflowStatus =
	| "active"
	| "stopped"
	| "running"
	| "executed"
	| "failed";

export type CreateWorkflow = {
	name: string;
	description: string;
	status: "active";
	executionCount: 0;
};

export type WorkflowNode = {
	instanceId: string; // unique id for node in workflow
	nodeId: string;
	position: { x: number; y: number };
	settings: Record<string, unknown>;
};

// stores the next node and the defines its output
export type WorkflowConnection = {
	id: string;
	sourceNodeInstanceId: string;
	targetNodeInstanceId: string;
	sourceOutputName: string;
	targetInputName: string;
};
