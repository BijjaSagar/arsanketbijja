"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export default function Header() {
	const pathname = usePathname();
	if (pathname.startsWith("/admin")) return null;

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
	];

	return (
		<header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-12 pointer-events-none">
			<div className="pointer-events-auto">
				<Logo priority />
			</div>

			<nav className="pointer-events-auto flex gap-6 mix-blend-difference text-white md:gap-10">
				{links.map((link) => (
					<Link
						key={link.href}
						className={cn("text-sm font-mono uppercase tracking-widest hover:underline underline-offset-4 decoration-1", pathname === link.href ? "underline" : "")}
						href={link.href}
					>
						{link.label}
					</Link>
				))}
			</nav>
		</header>
	);
}
