import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";
import { getPublishedProjects, getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
	const [site, projects] = await Promise.all([getSiteContent(), getPublishedProjects()]);

	return (
		<main className="min-h-screen bg-black text-white selection:bg-white selection:text-black math-grid">
			<Hero name={site.name} role={site.role} />
			<StatsBar stats={site.stats} />
			<About site={site} />
			<ProjectGrid projects={projects} />
			<Footer site={site} />
		</main>
	);
}
