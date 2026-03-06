/* biome-ignore-all lint/suspicious/noArrayIndexKey : ignore index */
import type { NodeParameters, NodePropertyType } from "@nodebase/shared";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
	type Control,
	Controller,
	type UseFormRegister,
	useForm,
	useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { WorkflowCanvasNode } from "@/constants/nodes";
import { useDebounce } from "@/hooks/debouce";

// ─── Constants ────────────────────────────────────────────────────────────────

/** How long to wait after the last change before firing the API call (ms) */
const _DEBOUNCE_MS = 800;

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeEditorProps = {
	node: WorkflowCanvasNode;
};

type NodeFieldProps = {
	field: NodeParameters;
	register: UseFormRegister<Record<string, unknown>>;
	control: Control<Record<string, unknown>>;
	allValues: Record<string, unknown>;
};

function buildUpdatedParams(
	original: NodeParameters[],
	formValues: Record<string, unknown>,
): NodeParameters[] {
	return original.map((param) => ({
		...param,
		value: param.name in formValues ? formValues[param.name] : param.value,
	}));
}

/** True only when every required param has a non-empty value. */
function allRequiredFilled(
	params: NodeParameters[],
	formValues: Record<string, unknown>,
): boolean {
	return params
		.filter((p) => p.required)
		.every((p) => {
			const v = formValues[p.name];
			if (v === null || v === undefined || v === "") return false;
			if (Array.isArray(v)) return v.length > 0;
			return true;
		});
}

function FieldWrapper({
	field,
	children,
}: {
	field: NodeParameters;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5 py-2.5 px-1.5 my-2">
			<div className="flex items-center gap-1 ml-1.5">
				<Label
					htmlFor={field.name}
					className="text-sm font-medium leading-none text-muted-foreground"
				>
					{field.label}
				</Label>
				{field.required && (
					<span className="text-destructive text-xs leading-none">*</span>
				)}
			</div>
			{children}
			{field.description && (
				<p className="text-xs text-muted-foreground leading-snug">
					{field.description}
				</p>
			)}
		</div>
	);
}

function InputField({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				placeholder={field.placeholder ?? field.default ?? ""}
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
}

function NumberField({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				type="number"
				placeholder={field.placeholder ?? field.default ?? ""}
				{...register(field.name, {
					required: field.required,
					valueAsNumber: true,
				})}
			/>
		</FieldWrapper>
	);
}

function TextareaField({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) {
	return (
		<FieldWrapper field={field}>
			<Textarea
				id={field.name}
				placeholder={field.placeholder ?? field.default ?? ""}
				rows={3}
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
}

function BooleanField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				render={({ field: f }) => (
					<div className="flex items-center gap-2 h-9">
						<Checkbox
							id={field.name}
							checked={!!f.value}
							onCheckedChange={f.onChange}
						/>
						<label
							htmlFor={field.name}
							className="text-sm text-muted-foreground cursor-pointer"
						>
							{field.placeholder ?? "Enable"}
						</label>
					</div>
				)}
			/>
		</FieldWrapper>
	);
}

function CheckboxField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	const options = useMemo(() => {
		if (Array.isArray((field as any).options))
			return (field as any).options as string[];
		return (
			(field.default as string | undefined)
				?.split(",")
				.map((s) => s.trim())
				.filter(Boolean) ?? []
		);
	}, [field]);

	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				defaultValue={[]}
				render={({ field: f }) => {
					const selected: string[] = Array.isArray(f.value) ? f.value : [];
					const toggle = (opt: string) =>
						f.onChange(
							selected.includes(opt)
								? selected.filter((v) => v !== opt)
								: [...selected, opt],
						);
					return (
						<div className="flex flex-col gap-1.5">
							{options.map((opt) => (
								<div key={opt} className="flex items-center gap-2">
									<Checkbox
										id={`${field.name}-${opt}`}
										checked={selected.includes(opt)}
										onCheckedChange={() => toggle(opt)}
									/>
									<label
										htmlFor={`${field.name}-${opt}`}
										className="text-sm text-muted-foreground cursor-pointer"
									>
										{opt}
									</label>
								</div>
							))}
						</div>
					);
				}}
			/>
		</FieldWrapper>
	);
}

function RadioField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	const options = useMemo(() => {
		if (Array.isArray((field as any).options))
			return (field as any).options as string[];
		return (
			(field.default as string | undefined)
				?.split(",")
				.map((s) => s.trim())
				.filter(Boolean) ?? []
		);
	}, [field]);

	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				render={({ field: f }) => (
					<RadioGroup
						value={f.value as string}
						onValueChange={f.onChange}
						className="flex flex-col gap-1.5"
					>
						{options.map((opt) => (
							<div key={opt} className="flex items-center gap-2">
								<RadioGroupItem value={opt} id={`${field.name}-${opt}`} />
								<label
									htmlFor={`${field.name}-${opt}`}
									className="text-sm text-muted-foreground cursor-pointer"
								>
									{opt}
								</label>
							</div>
						))}
					</RadioGroup>
				)}
			/>
		</FieldWrapper>
	);
}

/**
 * Dropdown options resolution order:
 *   1. field.options[]          — explicit enum array added by backend
 *   2. field.default            — comma-separated option list ("eq,neq,gt,lt")
 *   3. field.value as string[]  — value is itself the options array
 *   4. [field.value]            — scalar current value as sole option (graceful fallback)
 *
 * The *selected* value is always the RHF state, initialised from param.value.
 */
function DropdownField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	console.log(field);

	const options = useMemo<string[]>(() => {
		if (Array.isArray((field as any).options)) {
			return (field as any).options as string[];
		}

		if (typeof field.default === "string" && field.default.includes(",")) {
			return field.default
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
		}

		if (Array.isArray(field.value) && field.value.length > 0) {
			return field.value as string[];
		}

		if (
			field.value !== undefined &&
			field.value !== null &&
			field.value !== ""
		) {
			return [String(field.value)];
		}
		return [];
	}, [field]);

	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				render={({ field: f }) => (
					<Select value={(f.value as string) ?? ""} onValueChange={f.onChange}>
						<SelectTrigger id={field.name}>
							<SelectValue placeholder={field.placeholder ?? "Select…"} />
						</SelectTrigger>
						<SelectContent>
							{options.length === 0 ? (
								<div className="px-2 py-1.5 text-xs text-muted-foreground italic">
									No options available
								</div>
							) : (
								options.map((opt) => (
									<SelectItem key={opt} value={opt}>
										{opt}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				)}
			/>
		</FieldWrapper>
	);
}

function DateField({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				type="date"
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
}

function DateTimeField({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				type="datetime-local"
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
}

function ArrayField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				defaultValue={[]}
				render={({ field: f }) => {
					const items: string[] = Array.isArray(f.value) ? f.value : [""];
					const update = (idx: number, val: string) => {
						const next = [...items];
						next[idx] = val;
						f.onChange(next);
					};
					const remove = (idx: number) =>
						f.onChange(items.filter((_, i) => i !== idx));
					const add = () => f.onChange([...items, ""]);

					return (
						<div className="flex flex-col gap-1.5">
							{items.map((item, idx) => (
								<div key={idx} className="flex items-center gap-1.5">
									<Input
										value={item}
										placeholder={field.placeholder ?? `Item ${idx + 1}`}
										onChange={(e) => update(idx, e.target.value)}
										className="flex-1"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
										onClick={() => remove(idx)}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full h-7 text-xs gap-1"
								onClick={add}
							>
								<Plus className="h-3 w-3" />
								Add item
							</Button>
						</div>
					);
				}}
			/>
		</FieldWrapper>
	);
}

function KeyValueField({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) {
	type KVPair = { key: string; value: string };

	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				defaultValue={[]}
				render={({ field: f }) => {
					const pairs: KVPair[] = Array.isArray(f.value) ? f.value : [];

					const update = (idx: number, part: Partial<KVPair>) => {
						f.onChange(
							pairs.map((p, i) => (i === idx ? { ...p, ...part } : p)),
						);
					};
					const remove = (idx: number) =>
						f.onChange(pairs.filter((_, i) => i !== idx));
					const add = () => f.onChange([...pairs, { key: "", value: "" }]);

					return (
						<div className="flex flex-col gap-1.5">
							{pairs.length > 0 && (
								<div className="grid grid-cols-[1fr_12px_1fr_32px] gap-1.5">
									<span className="text-[10px] text-muted-foreground px-1">
										Key
									</span>
									<span />
									<span className="text-[10px] text-muted-foreground px-1">
										Value
									</span>
									<span />
								</div>
							)}
							{pairs.map((pair, idx) => (
								<div key={idx} className="flex items-center gap-1.5">
									<Input
										value={pair.key}
										placeholder="key"
										onChange={(e) => update(idx, { key: e.target.value })}
										className="flex-1 font-mono text-xs h-8"
									/>
									<span className="text-muted-foreground text-xs shrink-0">
										→
									</span>
									<Input
										value={pair.value}
										placeholder="value"
										onChange={(e) => update(idx, { value: e.target.value })}
										className="flex-1 font-mono text-xs h-8"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
										onClick={() => remove(idx)}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full h-7 text-xs gap-1"
								onClick={add}
							>
								<Plus className="h-3 w-3" />
								Add pair
							</Button>
						</div>
					);
				}}
			/>
		</FieldWrapper>
	);
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

export const NodeField = memo(function NodeField({
	field,
	register,
	control,
	allValues,
}: NodeFieldProps) {
	const visible = useIsVisible(field, allValues);
	if (!visible) return null;

	const shared = { field, register, control };

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
});

export const NodeEditor = memo(function NodeEditor({ node }: NodeEditorProps) {
	const { icon: Icon, color, background } = node.data.ui;

	// Flat default values derived from parameters
	const defaultValues = useMemo(() => {
		const vals: Record<string, unknown> = {};
		node.data.parameters.forEach((param) => {
			vals[param.name] =
				param.value !== "" && param.value !== null && param.value !== undefined
					? param.value
					: (param.default ?? "");
		});
		return vals;
	}, [node.data.parameters.forEach]);

	const { register, control, formState } = useForm<Record<string, unknown>>({
		defaultValues,
		mode: "onChange",
	});

	const watchedValues = useWatch({ control }) as Record<string, unknown>;

	const doSave = useCallback(
		async (values: Record<string, unknown>) => {
			if (!allRequiredFilled(node.data.parameters, values)) return;
			const _updatedParams = buildUpdatedParams(node.data.parameters, values);
		},
		[node],
	);

	const debouncedSave = useDebounce(doSave);

	useEffect(() => {
		if (formState.isDirty) {
			debouncedSave(watchedValues);
		}
	}, [watchedValues, formState.isDirty, debouncedSave]);

	const requiredUnfilled =
		formState.isDirty &&
		!allRequiredFilled(node.data.parameters, watchedValues);

	return (
		<div className="flex flex-col min-w-70 max-w-90  bg-background shadow-sm">
			{/* Header */}
			<div className="flex gap-3 py-2 my-2 items-center bg-muted p-1">
				<Icon
					className="h-6 w-6 p-1 rounded-sm shrink-0"
					style={{
						color: color ?? "currentColor",
						background: background ?? "#21212A",
					}}
				/>
				<span className="capitalize">{node.data.name}</span>

				<div className="ml-auto flex items-center gap-1.5 min-w-0">
					{formState.isSubmitting ? (
						<Loader2 className="h-3 w-3 animate-spin text-white/50" />
					) : requiredUnfilled ? (
						<span className="text-[10px] text-amber-400/70 truncate">
							required fields missing
						</span>
					) : formState.isDirty ? (
						<span className="text-[10px] text-white/40">saving…</span>
					) : null}
				</div>
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
							allValues={watchedValues}
						/>
					))
				)}
			</div>
		</div>
	);
});
