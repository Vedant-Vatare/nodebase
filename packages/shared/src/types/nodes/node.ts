export type Override<T, U> = Omit<T, keyof U> & U;

export type OverrideNodeParams<U> = Override<NodeParameters, U>;
export type OverrideNodeCredentials<U> = Override<NodeCredentials, U>;

export type NodeTypes =
	| "action"
	| "trigger"
	| "control-flow"
	| "transform"
	| "utility"
	| "helper";

export type NodeCredentials = {
	name: string;
	type: "OAuth" | "API Keys" | "Bearer_Token" | "username_password";
	value: string;
	required: boolean;
};

export type NodePropertyType =
	| "input"
	| "number"
	| "dropdown"
	| "checkbox"
	| "radio"
	| "textarea"
	| "boolean"
	| "key"
	| "key-value"
	| "array"
	| "date"
	| "date-time";

type parameterDepends = {
	parameter: string;
	values: [];
};

export type NodeParameters = {
	label: string;
	name: string;
	description?: string;
	placeholder?: string;
	type: NodePropertyType;
	value: unknown;
	default?: unknown;
	required?: boolean;
	multiValued?: boolean; // can have more than 1 values for given parameter
	dependsOn?: parameterDepends[]; // ref to another property and value of a parameter
};

export type BaseNode = {
	name: string;
	task: string;
	description: string;
	icon: string;
	type: NodeTypes;
	credentials?: NodeCredentials[];
	parameters: NodeParameters[];
};
