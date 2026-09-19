import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";
import StatsBar from "@/components/StatsBar";

export default function Home() {
	return (
		<main className="min-h-screen bg-black text-white selection:bg-white selection:text-black math-grid">
			<Hero />
			<StatsBar />
			<About />
			<ProjectGrid />
			<Footer />
		</main>
	);
}
