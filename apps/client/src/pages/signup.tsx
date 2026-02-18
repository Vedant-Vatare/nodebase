import { zodResolver } from "@hookform/resolvers/zod";
import { type userSignup, userSignupSchema } from "@nodebase/shared";
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

export const Signup = () => {
	return (
		<div className="bg-muted flex items-center justify-center min-h-screen px-4">
			<SignupForm />
		</div>
	);
};

const SignupForm = () => {
	const form = useForm<userSignup>({
		defaultValues: {},
		resolver: zodResolver(userSignupSchema),
	});

	const onSubmit: SubmitHandler<userSignup> = (data) => console.log(data);

	return (
		<div className="w-full max-w-md">
			<Form {...form}>
				<form
					className="bg-card border border-border space-y-5 p-6 rounded-2xl shadow-sm"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="space-y-1 mb-2">
						<h1 className="font-bold text-2xl text-foreground">
							Create an account
						</h1>
						<p className="text-muted-foreground text-sm">
							Start automating your tasks today
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											className="bg-background"
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											className="bg-background"
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											className="bg-background"
											placeholder="Create a strong password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button className="w-full h-10" type="submit">
						Create Account
					</Button>

					<p className="text-center text-muted-foreground text-sm pt-1">
						Already have an account?{" "}
						<a
							className="text-primary font-medium hover:underline"
							href="auth/login"
						>
							Sign in
						</a>
					</p>
				</form>
			</Form>
		</div>
	);
};

export default SignupForm;
