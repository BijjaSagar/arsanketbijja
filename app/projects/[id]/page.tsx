import { PROJECTS } from "@/lib/data";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
	return PROJECTS.map((project) => ({
		id: project.id,
	}));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const project = PROJECTS.find((p) => p.id === id);

	if (!project) {
		notFound();
	}

	// Filter other projects to show at the bottom
	const otherProjects = PROJECTS.filter((p) => p.id !== id);

	return (
		<ProjectDetailClient
			project={project}
			otherProjects={otherProjects}
		/>
	);
}
