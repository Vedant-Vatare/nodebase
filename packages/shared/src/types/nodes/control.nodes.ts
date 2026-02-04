import type { BaseNode, Override, OverrideNodeParams } from "./node.js";

export const ComparisonOperators = [
	{ name: "equals", value: "eq" },
	{ name: "not equals", value: "neq" },
	{ name: "greater than", value: "gt" },
	{ name: "lesser than", value: "lt" },
	{ name: "greater than or equal ", value: "gte" },
	{ name: "lesser than or equal", value: "lte" },
	{ name: "contains", value: "con" },
	{ name: "is empty", value: "emt" },
] as const;

export type ComparisonOperatorValue =
	(typeof ComparisonOperators)[number]["value"];

export type ConditionalNode = Override<
	BaseNode,
	{
		name: "conditional node";
		type: "control";
		task: "control.condition";
		description: "run something based on condition";
		parameters: Array<
			| OverrideNodeParams<{
					name: "left_operand";
					type: "input";
					value: string | number | boolean;
					required: true;
			  }>
			| OverrideNodeParams<{
					name: "right_operand";
					type: "input";
					value: string | number | boolean;
					required: true;
			  }>
			| OverrideNodeParams<{
					name: "operator";
					type: "dropdown";
					options: typeof ComparisonOperators;
					value: (typeof ComparisonOperators)[number]["value"];
					required: true;
			  }>
		>;
		outputs: [
			{
				name: "true";
				value: unknown;
			},
			{
				name: "false";
				value: unknown;
			},
		];
	}
>;
