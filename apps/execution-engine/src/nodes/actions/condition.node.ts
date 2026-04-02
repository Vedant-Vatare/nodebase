import type { ConditionNode, NodeExecutorOutput } from "@/types/nodes.js";
import { getResolvedParams } from "@/utils/node.executor.utils.js";

function isSameType(a: unknown, b: unknown) {
	if (a === null || b === null) {
		return a === b;
	}

	if (Array.isArray(a) || Array.isArray(b)) {
		return Array.isArray(a) && Array.isArray(b);
	}

	return typeof a === typeof b;
}

function toSafeNumber(val: unknown): number | null {
	if (typeof val === "number") return val;

	if (typeof val === "string" && val.trim() !== "") {
		const n = Number(val);
		return Number.isNaN(n) ? null : n;
	}

	return null;
}

export const conditionNodeExecutor = async (
	node: ConditionNode,
	workflowId: string,
): Promise<NodeExecutorOutput & { output: boolean }> => {
	const params = await getResolvedParams(node, workflowId);
	const operator = params.operator.value;
	const leftValue = params.left_operand.value;
	const rightValue = params.right_operand.value;

	if (operator === "eq") {
		if (!isSameType(leftValue, rightValue)) {
			return { success: true, output: false };
		}
		return { success: true, output: leftValue === rightValue };
	}

	if (operator === "neq") {
		if (!isSameType(leftValue, rightValue)) {
			return { success: true, output: true };
		}
		return { success: true, output: leftValue !== rightValue };
	}

	if (["gt", "lt", "gte", "lte"].includes(operator)) {
		const l = toSafeNumber(leftValue);
		const r = toSafeNumber(rightValue);

		if (l === null || r === null) {
			return { success: true, output: false };
		}

		if (operator === "gt") return { success: true, output: l > r };
		if (operator === "lt") return { success: true, output: l < r };
		if (operator === "gte") return { success: true, output: l >= r };
		if (operator === "lte") return { success: true, output: l <= r };
	}

	if (operator === "con") {
		let data = leftValue;

		if (typeof data === "string") {
			try {
				data = JSON.parse(data);
			} catch {
				return { success: true, output: false };
			}
		}

		const output =
			(Array.isArray(data) && data.includes(rightValue)) ||
			(data !== null &&
				typeof rightValue !== "boolean" &&
				typeof data === "object" &&
				Object.hasOwn(data, rightValue));

		return { success: true, output };
	}

	if (operator === "emt") {
		let output = false;

		if (leftValue == null) output = true;
		else if (typeof leftValue === "string") output = leftValue.length === 0;
		else if (Array.isArray(leftValue)) output = leftValue.length === 0;
		else if (typeof leftValue === "object")
			output = Object.keys(leftValue).length === 0;

		return { success: true, output };
	}

	return { success: false, message: "invalid operator", output: false };
};
