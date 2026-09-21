import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/cms";
import ProjectEditor from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const project = await getProjectById(id);
	if (!project) notFound();

	return (
		<div className="space-y-8">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Work</p>
				<h1 className="mt-2 text-4xl font-bold tracking-tighter">Edit project</h1>
			</div>
			<ProjectEditor project={project} />
		</div>
	);
}
