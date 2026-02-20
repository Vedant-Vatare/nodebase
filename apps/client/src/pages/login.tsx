import { zodResolver } from "@hookform/resolvers/zod";
import { type userLogin, userLoginSchema } from "@nodebase/shared";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import GoogleIcon from "@/assets/icons/google.svg?react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginQuery } from "@/queries/auth";

export const Login = () => {
	return (
		<div className="bg-muted flex items-center justify-center min-h-screen w-screen px-4">
			<LoginForm />
		</div>
	);
};

const LoginForm = () => {
	const { mutate } = useLoginQuery();
	const form = useForm<userLogin>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(userLoginSchema),
	});

	const onSubmit: SubmitHandler<userLogin> = (data) => mutate(data);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<div className="w-full max-w-md">
			<Form {...form}>
				<form
					className="bg-card border border-border space-y-5 p-6 rounded-2xl shadow-sm"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="space-y-1 mb-2">
						<h1 className="font-bold text-2xl text-foreground">Welcome back</h1>
						<p className="text-muted-foreground text-sm">
							Sign in to your account to continue
						</p>
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full flex items-center gap-2 h-10 hover:text-foreground/80"
					>
						<GoogleIcon width={32} height={32} fill="currentColor" />
						<span>Continue with Google</span>
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-card px-3 text-muted-foreground">Or</span>
						</div>
					</div>

					<div className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											className="bg-muted"
											placeholder="you@example.com"
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>Password</FormLabel>
										<a
											className="text-primary text-xs font-medium hover:underline"
											href="/auth/forgot-password"
										>
											Forgot password?
										</a>
									</div>
									<FormControl>
										<div className="relative">
											<Input
												className="bg-muted pr-10"
												placeholder="Enter your password"
												type={showPassword ? "text" : "password"}
												{...field}
											/>
											<div className="absolute right-1 top-1/2 -translate-y-1/2">
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? <EyeIcon /> : <EyeClosedIcon />}
												</Button>
											</div>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button className="w-full h-10" type="submit">
						Sign In
					</Button>

					<p className="text-center text-muted-foreground text-sm pt-1">
						Don't have an account?{" "}
						<a
							className="text-primary font-medium hover:underline"
							href="/auth/signup"
						>
							Sign up
						</a>
					</p>
				</form>
			</Form>
		</div>
	);
};

export default LoginForm;
