/* biome-ignore-all lint/suspicious/noArrayIndexKey : ignore index */

import { CheckmarkSquare02Icon, Edit04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { NodeParameters, NodePropertyType } from "@nodebase/shared";
import { Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { WorkflowCanvasNode } from "@/constants/nodes";
import { useDebounce } from "@/hooks/debouce";
import { useUpdateWorkflowNode } from "@/queries/userWorkflows";
import { Button } from "../ui/button";
import {
	ArrayField,
	BooleanField,
	CheckboxField,
	DateField,
	DateTimeField,
	DropdownField,
	InputField,
	KeyValueField,
	type NodeFieldProps,
	NumberField,
	RadioField,
	TextareaField,
} from "./NodeFields";

type NodeEditorProps = {
	node: WorkflowCanvasNode;
};

function allRequiredFilled(
	params: NodeParameters[],
	formValues: Record<string, unknown>,
): boolean {
	return params
		.filter((p) => p.required)
		.filter((p) => {
			if (!p.dependsOn || p.dependsOn.length === 0) return true;
			return p.dependsOn.every((dep) => {
				const depValue = formValues[dep.parameter];
				return dep.values.includes(depValue);
			});
		})
		.every((p) => {
			const v = formValues[p.name];
			if (
				v === null ||
				v === undefined ||
				v === "" ||
				(typeof v === "number" && Number.isNaN(v))
			)
				return false;
			if (Array.isArray(v)) return v.length > 0;
			return true;
		});
}

function useIsVisible(
	field: NodeParameters,
	allValues: Record<string, unknown>,
): boolean {
	if (!field.dependsOn?.length) return true;
	return field.dependsOn.every(({ parameter, values }) =>
		values.includes(allValues[parameter]),
	);
}

export const NodeField = ({
	field,
	register,
	control,
	allValues,
	currentNodeId,
}: NodeFieldProps & { allValues: Record<string, unknown> }) => {
	const visible = useIsVisible(field, allValues);
	if (!visible) return null;

	const shared = { field, register, control, currentNodeId };

	switch (field.type as NodePropertyType) {
		case "input":
			return <InputField {...shared} />;
		case "number":
			return <NumberField {...shared} />;
		case "textarea":
			return <TextareaField {...shared} />;
		case "boolean":
			return <BooleanField {...shared} />;
		case "checkbox":
			return <CheckboxField {...shared} />;
		case "radio":
			return <RadioField {...shared} />;
		case "dropdown":
			return <DropdownField {...shared} />;
		case "date":
			return <DateField {...shared} />;
		case "date-time":
			return <DateTimeField {...shared} />;
		case "array":
			return <ArrayField {...shared} />;
		case "key-value":
			return <KeyValueField {...shared} />;
		default:
			return <InputField {...shared} />;
	}
};

export const NodeEditor = memo(({ node }: NodeEditorProps) => {
	const { icon: Icon, color, background } = node.data.ui;
	const { mutate: updateNode } = useUpdateWorkflowNode();
	const [isEditingName, setIsEditingName] = useState(false);
	const { mutate: updateName } = useUpdateWorkflowNode();
	const nodeNameRef = useRef<HTMLElement | null>(null);

	const defaultValues = useMemo(() => {
		const vals: Record<string, unknown> = {};
		for (const param of node.data.parameters) {
			vals[param.name] =
				param.value !== "" && param.value !== null && param.value !== undefined
					? param.value
					: (param.default ?? "");
		}
		return vals;
	}, [node.data.parameters]);

	const editNodeName = () => {
		if (!nodeNameRef.current) return;
		setIsEditingName(true);

		nodeNameRef.current.contentEditable = "true";
		nodeNameRef.current.focus();
		const range = document.createRange();
		const sel = window.getSelection();
		range.selectNodeContents(nodeNameRef.current);
		range.collapse(false);
		sel?.removeAllRanges();
		sel?.addRange(range);
	};

	const saveNodeName = () => {
		if (!nodeNameRef.current) return;
		node.data.name = nodeNameRef.current?.innerText;
		updateName({
			id: node.id,
			task: node.data.task,
			name: node.data.name,
		});
		setIsEditingName(false);
	};

	const { register, control, watch } = useForm<Record<string, unknown>>({
		defaultValues,
		mode: "onChange",
	});

	const [editorStatus, setEditorStatus] = useState<
		"idle" | "saving" | "missing"
	>("idle");

	const userHasEdited = useRef(false);

	const doSave = useCallback(
		(values: Record<string, unknown>) => {
			if (!allRequiredFilled(node.data.parameters, values)) {
				setEditorStatus("missing");
				return;
			}

			const updatedParams = node.data.parameters.map((param) => ({
				...param,
				value: values[param.name] ?? param.value ?? "",
			}));

			setEditorStatus("saving");
			updateNode(
				{
					id: node.id,
					task: node.data.task,
					parameters: updatedParams,
				},
				{
					onSettled: () => setEditorStatus("idle"),
				},
			);
		},
		[node, updateNode],
	);

	const debouncedSave = useDebounce(doSave, () => node.id);

	useEffect(() => {
		const subscription = watch((values) => {
			if (!userHasEdited.current) {
				userHasEdited.current = true;
				return;
			}
			debouncedSave(values as Record<string, unknown>);
		});
		return () => subscription.unsubscribe();
	}, [watch, debouncedSave]);

	const allValues = useWatch({ control }) as Record<string, unknown>;

	return (
		<div className="flex flex-col  w-full bg-background shadow-sm">
			<div className="flex gap-3 py-2 my-2 items-center bg-muted p-1">
				<Icon
					className="h-6 w-6 p-1 rounded-sm shrink-0"
					style={{
						color: color ?? "currentColor",
						background: background ?? "#21212A",
					}}
				/>
				<span ref={nodeNameRef} className="capitalize outline-none">
					{node.data.name}
				</span>
				<div className="ml-auto mr-1 cursor-pointer opacity-75">
					{isEditingName ? (
						<Button
							onClick={saveNodeName}
							variant={"secondary"}
							size={"icon-sm"}
						>
							<HugeiconsIcon icon={CheckmarkSquare02Icon} size={14} />
						</Button>
					) : (
						<Button onClick={editNodeName} variant={"ghost"} size={"icon-sm"}>
							<HugeiconsIcon icon={Edit04Icon} size={14} />
						</Button>
					)}
				</div>
			</div>
			<div className="flex text-xs pl-1.5 items-center gap-1.5 min-w-0 h-1 mb-3">
				{editorStatus === "saving" ? (
					<span className="text-white/40 flex items-center gap-1">
						<Loader2 className="h-3 w-3 animate-spin" />
						Saving…
					</span>
				) : editorStatus === "missing" ? (
					<span className="text-amber-400/70 truncate">
						Required fields missing
					</span>
				) : null}
			</div>

			<div className="flex flex-col">
				{node.data.parameters.length === 0 ? (
					<p className="px-3 py-4 text-xs text-muted-foreground text-center italic">
						No parameters to configure.
					</p>
				) : (
					node.data.parameters.map((param) => (
						<NodeField
							key={param.name}
							field={param}
							register={register}
							control={control}
							allValues={allValues}
							currentNodeId={node.id}
						/>
					))
				)}
			</div>
		</div>
	);
});
