import type { BaseNode, OverrideNodeParams } from "./node.js";

export type HTTPNode = BaseNode & {
	name: "HTTP Request";
	task: "http.request";
	type: "action";
	parameters: Array<
		| OverrideNodeParams<{
				label: "URL";
				name: "url";
				type: "input";
				value: string;
				required: true;
		  }>
		| OverrideNodeParams<{
				label: "Method";
				name: "method";
				type: "dropdown";
				value: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
				options: [
					{ label: "GET"; value: "GET" },
					{ label: "POST"; value: "POST" },
					{ label: "PUT"; value: "PUT" },
					{ label: "DELETE"; value: "DELETE" },
					{ label: "PATCH"; value: "PATCH" },
					{ label: "OPTIONS"; value: "OPTIONS" },
					{ label: "HEAD"; value: "HEAD" },
				];
				default: "GET";
				required: true;
		  }>
		| OverrideNodeParams<{
				label: "Headers";
				name: "headers";
				type: "key-value";
				value: Record<string, string>;
				multiValued: true;
		  }>
		| OverrideNodeParams<{
				label: "request body";
				name: "body";
				type: "input";
				value: string;
				dependsOn: [
					{
						parameter: "method";
						values: ["POST", "PUT", "DELETE", "PATCH", "HEAD", "options"];
					},
				];
		  }>
	>;
};
