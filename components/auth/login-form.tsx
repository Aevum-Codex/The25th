"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const res = await signIn("credentials", {
			redirect: false,
			username,
			password,
		});
		setLoading(false);
		if (res?.error) setError("Invalid credentials");
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
			<div>
				<label className="block text-sm font-medium mb-1">
					Username
				</label>
				<Input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="username"
					required
					autoComplete="username"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">
					Password
				</label>
				<Input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••"
					type="password"
					required
					autoComplete="current-password"
				/>
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="flex gap-2">
				<Button type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Sign In"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => signIn("google")}
				>
					Google
				</Button>
			</div>
		</form>
	);
}
