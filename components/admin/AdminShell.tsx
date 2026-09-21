"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const LINKS = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/site", label: "Site content" },
	{ href: "/admin/projects", label: "Projects" },
];

export default function AdminShell({
	email,
	children,
}: {
	email: string | null;
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [loggingOut, setLoggingOut] = useState(false);

	async function logout() {
		setLoggingOut(true);
		await fetch("/api/auth/logout", { method: "POST" });
		router.replace("/admin/login");
		router.refresh();
	}

	return (
		<div className="min-h-screen bg-black text-white md:cursor-auto">
			<div className="flex min-h-screen flex-col lg:flex-row">
				<aside className="border-b border-white/10 lg:border-b-0 lg:border-r lg:w-64 shrink-0">
					<div className="px-6 py-6 border-b border-white/10">
						<Logo
							href="/admin"
							compact
							ariaLabel="Sanket Bijja admin"
							markClassName="h-8"
						/>
						<p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Admin</p>
						{email ? <p className="mt-1 text-xs text-zinc-500 truncate">{email}</p> : null}
					</div>
					<nav className="flex flex-row lg:flex-col gap-1 p-3 overflow-x-auto">
						{LINKS.map((link) => {
							const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors",
										active ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-white/5",
									)}
								>
									{link.label}
								</Link>
							);
						})}
						<button
							onClick={logout}
							disabled={loggingOut}
							className="px-4 py-2 text-left text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
						>
							{loggingOut ? "Signing out…" : "Logout"}
						</button>
					</nav>
				</aside>
				<main className="flex-1 px-4 py-8 md:px-10 md:py-12 max-w-6xl w-full">{children}</main>
			</div>
		</div>
	);
}
