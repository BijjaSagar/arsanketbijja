import Link from "next/link";
import { getDashboardCounts, getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
	const [counts, site] = await Promise.all([getDashboardCounts(), getSiteContent()]);

	const cards = [
		{ label: "Projects", value: counts.projects, href: "/admin/projects" },
		{ label: "Published", value: counts.published, href: "/admin/projects" },
		{ label: "Years", value: site.stats.yearsExperience, href: "/admin/site" },
		{ label: "Clients", value: site.stats.clients, href: "/admin/site" },
	];

	return (
		<div className="space-y-10">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Overview</p>
				<h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tighter">Dashboard</h1>
				<p className="mt-3 text-zinc-400 max-w-xl">Edit site content and projects. Changes appear on the live portfolio immediately.</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{cards.map((card) => (
					<Link
						key={card.label}
						href={card.href}
						className="border border-white/10 bg-zinc-950 p-6 hover:border-white/40 transition-colors"
					>
						<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
						<p className="mt-3 text-4xl font-bold tracking-tighter">{card.value}</p>
					</Link>
				))}
			</div>

			<div className="flex flex-wrap gap-4">
				<Link
					href="/admin/site"
					className="px-5 py-3 border border-white text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
				>
					Edit profile
				</Link>
				<Link
					href="/admin/projects/new"
					className="px-5 py-3 border border-white/20 text-xs font-mono uppercase tracking-widest hover:border-white transition-colors"
				>
					Add project
				</Link>
				<Link
					href="/"
					target="_blank"
					className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
				>
					View site
				</Link>
			</div>
		</div>
	);
}
