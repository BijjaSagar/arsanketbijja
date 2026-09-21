"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = (await response.json()) as { error?: string };
			if (!response.ok) {
				setError(data.error || "Could not sign in.");
				return;
			}
			router.replace("/admin");
			router.refresh();
		} catch {
			setError("Could not sign in.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="min-h-screen bg-black text-white flex items-center justify-center px-6 md:cursor-auto">
			<div className="w-full max-w-md border border-white/10 bg-zinc-950 p-8 md:p-10">
				<p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Admin</p>
				<h1 className="mt-3 text-3xl font-bold tracking-tighter">Sign in</h1>
				<p className="mt-2 text-sm text-zinc-500">Sanket Bijja portfolio CMS</p>

				<form onSubmit={onSubmit} className="mt-8 space-y-5">
					<label className="block">
						<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Email</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="username"
							className="mt-2 w-full bg-black border border-white/15 px-4 py-3 text-sm outline-none focus:border-white"
						/>
					</label>
					<label className="block">
						<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Password</span>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="current-password"
							className="mt-2 w-full bg-black border border-white/15 px-4 py-3 text-sm outline-none focus:border-white"
						/>
					</label>
					{error ? <p className="text-sm text-red-400">{error}</p> : null}
					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 bg-white text-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-60"
					>
						{loading ? "Signing in…" : "Enter"}
					</button>
				</form>
			</div>
		</main>
	);
}
