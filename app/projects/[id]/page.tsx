import { getPublishedProjects, getProjectBySlug, toPublicProject } from "@/lib/cms";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const project = await getProjectBySlug(id);

	if (!project) {
		notFound();
	}

	const otherProjects = (await getPublishedProjects()).filter((item) => item.id !== project.slug);

	return (
		<ProjectDetailClient
			project={toPublicProject(project)}
			otherProjects={otherProjects}
		/>
	);
}
