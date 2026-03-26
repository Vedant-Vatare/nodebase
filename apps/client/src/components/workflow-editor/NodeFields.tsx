/* biome-ignore-all lint/suspicious/noArrayIndexKey : ignore index */
import type { NodeParameters } from "@nodebase/shared";
import { Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
	type Control,
	Controller,
	type UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type NodeFieldProps = {
	field: NodeParameters;
	register: UseFormRegister<Record<string, unknown>>;
	control: Control<Record<string, unknown>>;
	allValues: Record<string, unknown>;
};
export type OptionItem = { label: string; value: unknown };

const FieldWrapper = ({
	field,
	children,
}: {
	field: NodeParameters;
	children: React.ReactNode;
}) => {
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
};

export const InputField = ({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) => {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				placeholder={field.placeholder ?? field.default ?? ""}
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
};

export const NumberField = ({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) => {
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
};

export const TextareaField = ({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) => {
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
};

export const BooleanField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
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
};

export const CheckboxField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
	const options = useMemo(() => {
		if (Array.isArray(field.options))
			return field.options.map((o: OptionItem) => String(o.value));
		return (
			field.default
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
};

export const RadioField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
	const options = useMemo(() => {
		if (Array.isArray(field.options))
			return field.options.map((o: OptionItem) => String(o.value));
		return (
			field.default
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
};

export const DropdownField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
	const options = (field.options as { label: string; value: string }[]) ?? [];

	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				render={({ field: f }) => (
					<Select value={(f.value as string) ?? ""} onValueChange={f.onChange}>
						<SelectTrigger id={field.name}>
							<SelectValue
								placeholder={field.placeholder ?? "Select an option"}
							/>
						</SelectTrigger>
						<SelectContent>
							{options.length === 0 ? (
								<div className="px-2 py-1.5 text-xs text-muted-foreground italic">
									No options available
								</div>
							) : (
								options.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				)}
			/>
		</FieldWrapper>
	);
};

export const DateField = ({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) => {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				type="date"
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
};

export const DateTimeField = ({
	field,
	register,
}: Pick<NodeFieldProps, "field" | "register">) => {
	return (
		<FieldWrapper field={field}>
			<Input
				id={field.name}
				type="datetime-local"
				{...register(field.name, { required: field.required })}
			/>
		</FieldWrapper>
	);
};

export const ArrayField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
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
};

type KVPair = { key: string; value: string };

const recordToPairs = (record: Record<string, string>): KVPair[] => {
	const entries = Object.entries(record);
	return entries.length > 0
		? [
				...entries.map(([key, value]) => ({ key, value })),
				{ key: "", value: "" },
			]
		: [{ key: "", value: "" }];
};

const pairsToRecord = (pairs: KVPair[]): Record<string, string> =>
	Object.fromEntries(
		pairs.filter((p) => p.key !== "").map((p) => [p.key, p.value]),
	);

const KeyValueEditor = ({
	value,
	onChange,
}: {
	value: Record<string, string>;
	onChange: (val: Record<string, string>) => void;
}) => {
	const [pairs, setPairs] = useState<KVPair[]>(() =>
		value && typeof value === "object" && !Array.isArray(value)
			? recordToPairs(value)
			: [{ key: "", value: "" }],
	);

	const update = (idx: number, part: Partial<KVPair>) => {
		const next = pairs.map((p, i) => (i === idx ? { ...p, ...part } : p));
		const isLast = idx === pairs.length - 1;
		const updated = next[idx];
		if (isLast && (updated?.key !== "" || updated?.value !== "")) {
			next.push({ key: "", value: "" });
		}
		setPairs(next);
		onChange(pairsToRecord(next));
	};

	const remove = (idx: number) => {
		const next = pairs.filter((_, i) => i !== idx);
		setPairs(next);
		onChange(pairsToRecord(next));
	};

	return (
		<div className="flex flex-col gap-1 group/kvrow">
			{pairs.map((pair, idx) => (
				<div key={idx} className="flex items-center gap-1.5">
					<div className="flex flex-1 rounded-sm border border-border overflow-hidden focus-within:border-foreground/40 transition-colors">
						<Input
							value={pair.key}
							placeholder="key"
							onChange={(e) => update(idx, { key: e.target.value })}
							className="flex-1 font-mono text-xs h-8 rounded-none border-0 shadow-none focus-visible:ring-0"
						/>
						<div className="w-px bg-border self-stretch shrink-0" />
						<Input
							value={pair.value}
							placeholder="value"
							onChange={(e) => update(idx, { value: e.target.value })}
							className="flex-1 font-mono text-xs h-8 rounded-none border-0 shadow-none focus-visible:ring-0"
						/>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={`p-1 h-max w-max shrink-0 text-muted-foreground hover:text-destructive transition-opacity ${
							idx < pairs.length - 1
								? "opacity-0 group-hover/kvrow:opacity-100"
								: "opacity-0 pointer-events-none"
						}`}
						onClick={() => remove(idx)}
					>
						<X className="h-3.5 w-3.5" />
					</Button>
				</div>
			))}
		</div>
	);
};

export const KeyValueField = ({
	field,
	control,
}: Pick<NodeFieldProps, "field" | "control">) => {
	return (
		<FieldWrapper field={field}>
			<Controller
				name={field.name}
				control={control}
				defaultValue={{}}
				render={({ field: f }) => (
					<KeyValueEditor
						value={(f.value as Record<string, string>) ?? {}}
						onChange={f.onChange}
					/>
				)}
			/>
		</FieldWrapper>
	);
};
