import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShineBorderProps = {
	children: ReactNode;
	className?: string;
	borderWidth?: number;
	duration?: number;
	color?: string;
	disabled?: boolean;
};

export const ShineBorder = ({
	children,
	className,
	borderWidth = 2,
	duration = 3.5,
	color = "hsl(var(--primary))",
	disabled = false,
}: ShineBorderProps) => {
	return (
		<>
			<style>{`
        @keyframes rotating-beam {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-rotating-beam {
          animation: rotating-beam var(--duration, 4s) linear infinite;
        }
      `}</style>
			<div
				className={cn(
					"relative overflow-hidden rounded-md border p-(--bw)",
					className,
				)}
				style={{ "--bw": `${borderWidth}px` } as React.CSSProperties}
			>
				<div className="absolute inset-0 pointer-events-none z-0">
					<div
						className={cn(
							"absolute left-1/2 top-1/2 h-[200%] w-[200%] origin-center",
							!disabled && "animate-rotating-beam",
						)}
						style={
							{
								background: `conic-gradient(from 90deg, transparent 0%, transparent 60%, ${color} 100%)`,
								"--duration": `${duration}s`,
							} as React.CSSProperties
						}
					/>
				</div>

				<div className="pointer-events-none absolute inset-0 rounded-md border border-border/50" />

				<div className="relative z-10 h-full rounded-[calc(0.375rem-var(--bw))] bg-card">
					{children}
				</div>
			</div>
		</>
	);
};
