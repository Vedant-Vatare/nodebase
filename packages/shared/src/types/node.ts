export type nodeTypes =
	| "action"
	| "trigger"
	| "transform"
	| "cron"
	| "helper"
	| "webhook";

export type nodeCredentials = {
	name: string;
	required: boolean;
};

export type nodePropertyType =
	| "input"
	| "number"
	| "dropdown"
	| "radio"
	| "boolean"
	| "date";

export type nodeParameters = {
	label: string;
	name: string;
	description?: string;
	type: nodePropertyType;
	values: string[];
	default: string;
};

export type baseNode = {
	name: string;
	task: string;
	description: string;
	icon: string;
	type: nodeTypes;
	credentials?: nodeCredentials[];
	parameters: nodeParameters[];
};
