import type { BaseNode, Override, OverrideNodeParams } from "./node.js";

export type SetvariableNode = Override<
	BaseNode,
	{
		name: "Set variable";
		task: "control.condition";
		type: "transform";
		description: "run something based on condition";
		parameters: Array<
			| OverrideNodeParams<{
					name: "var_name";
					type: "input";
					value: string;
					required: true;
			  }>
			| OverrideNodeParams<{
					name: "var_value";
					type: "input";
					value: string | number | boolean | Record<string, unknown>;
					required: true;
			  }>
		>;
	}
>;
