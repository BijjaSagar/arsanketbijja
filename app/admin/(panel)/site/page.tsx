import { getSiteContent } from "@/lib/cms";
import SiteForm from "@/components/admin/SiteForm";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
	const site = await getSiteContent();

	return (
		<div className="space-y-8">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Profile</p>
				<h1 className="mt-2 text-4xl font-bold tracking-tighter">Site content</h1>
				<p className="mt-3 text-zinc-400">Bio, contact, stats, education, experience, and skills used across the public site.</p>
			</div>
			<SiteForm initial={site} />
		</div>
	);
}
