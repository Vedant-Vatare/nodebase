export const QUEUE_NAME = "workflow-node" as const;

export interface JobPayloadMap {
	"execute-node": {
		nodeId: string;
		workflowId: string;
		payload: Record<string, unknown>;
	};
}
