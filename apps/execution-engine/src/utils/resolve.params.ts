import { getNodeOutput } from "@/services/executionStore.js";

const EXPRESSION_REGEX = /\{\{\s*nodes\.(\w+)\.(.+?)\s*\}\}/g;

import type { NodeParameters } from "@nodebase/shared";

export async function resolveNodeParams(
	params: NodeParameters[],
	workflowId: string,
): Promise<NodeParameters[]> {
	return Promise.all(
		params.map(async (param) => ({
			...param,
			value: await resolveValue(param.value, workflowId),
		})),
	);
}

async function resolveValue(
	value: unknown,
	workflowId: string,
): Promise<unknown> {
	if (typeof value === "string") return resolveString(value, workflowId);
	if (Array.isArray(value))
		return Promise.all(value.map((v) => resolveValue(v, workflowId)));
	if (value !== null && typeof value === "object") {
		const entries = await Promise.all(
			Object.entries(value as Record<string, unknown>).map(async ([k, v]) => [
				k,
				await resolveValue(v, workflowId),
			]),
		);
		return Object.fromEntries(entries);
	}
	return value;
}

async function resolveString(
	str: string,
	workflowId: string,
): Promise<unknown> {
	const matches = [...str.matchAll(EXPRESSION_REGEX)];
	if (matches.length === 0) return str;

	const isWhole = str.match(/^\{\{\s*nodes\.(\w+)\.(.+?)\s*\}\}$/);
	if (isWhole) {
		const [, nodeName, path] = isWhole;
		if (!nodeName || !path) return str;
		const output = await getNodeOutput(workflowId, nodeName);
		return getNestedValue(output, path);
	}

	let result = str;
	for (const match of matches) {
		const [full, nodeName, path] = match;
		if (!full || !nodeName || !path) continue;
		const output = await getNodeOutput(workflowId, nodeName);
		const val = getNestedValue(output, path);
		result = result.replace(full, val === undefined ? "" : String(val));
	}
	return result;
}

function getNestedValue(obj: unknown, path: string): unknown {
	return path.split(".").reduce<unknown>((acc, key) => {
		if (acc === null || acc === undefined) return undefined;
		return (acc as Record<string, unknown>)[key];
	}, obj);
}
