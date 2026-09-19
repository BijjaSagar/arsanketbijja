"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
	const pathname = usePathname();

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		// We can add more if needed, e.g., Projects index if we had one separate from home
	];

	return (
		<header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference text-white pointer-events-none">
			<div className="pointer-events-auto">
				<Link
					href="/"
					className="text-xl font-bold tracking-tighter uppercase"
				>
					Sanket Bijja
				</Link>
			</div>

			<nav className="pointer-events-auto flex gap-6 md:gap-10">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn("text-sm font-mono uppercase tracking-widest hover:underline underline-offset-4 decoration-1", pathname === link.href ? "underline" : "")}
					>
						{link.label}
					</Link>
				))}
			</nav>
		</header>
	);
}
