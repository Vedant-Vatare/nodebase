import type { BaseNode, OverrideNodeParams } from "./node.js";

export type ClickNode = BaseNode & {
	name: "click";
	task: "event.click";
	type: "trigger";
};

export type WaitingNode = BaseNode & {
	name: "waiting node";
	task: "event.wait";
	type: "trigger" | "action";
	parameters: Array<
		| OverrideNodeParams<{
				label: "Start on";
				name: "start";
				input: "dropdown";
				value: "time_period" | "date_time";
				options: [
					{ name: "after time period"; value: "time_period" },
					{ name: "on specific date & time"; value: "date_time" },
				];
				default: "time_period";
				required: true;
		  }>
		| OverrideNodeParams<{
				label: "Wait time";
				name: "wait_time_period";
				input: "number";
				value: number;
				default: "10";
				required: true;
				dependsOn: [{ parameter: "start"; values: ["time_period"] }];
		  }>
		| OverrideNodeParams<{
				label: "time unit";
				name: "time_unit";
				input: "dropdown";
				value: "seconds" | "minutes" | "hours" | "days";
				options: [
					{ name: "Seconds"; value: "seconds" },
					{ name: "Minute"; value: "minutes" },
					{ name: "Hours"; value: "hours" },
					{ name: "Days"; value: "days" },
				];
				default: "seconds";
				required: true;
				dependsOn: [{ parameter: "start"; values: ["time_period"] }];
		  }>
		| OverrideNodeParams<{
				label: "At specific time";
				name: "date_time";
				input: "date-time";
				value: string;
				required: true;
				dependsOn: [{ parameter: "start"; values: ["date_time"] }];
		  }>
	>;
};
export type CronJobNode = BaseNode & {
	name: "schedule trigger";
	task: "trigger.cron";
	type: "trigger" | "action";
	parameters: Array<
		| OverrideNodeParams<{
				label: "minutes";
				name: "minutes";
				type: "number";
				value: number;
				default: "0";
		  }>
		| OverrideNodeParams<{
				label: "Hour";
				name: "hour";
				type: "number";
				value: number;
				default: "0";
		  }>
		| OverrideNodeParams<{
				label: "day of the month";
				name: "day_of_the_month";
				type: "number";
				value: number;
				default: "0";
		  }>
		| OverrideNodeParams<{
				label: "Month";
				name: "month";
				type: "number";
				value: number;
				default: "0";
		  }>
	>;
};
