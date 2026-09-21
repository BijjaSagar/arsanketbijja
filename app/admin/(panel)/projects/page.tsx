import Link from "next/link";
import { getAllProjects } from "@/lib/cms";
import ProjectsTable from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
	const projects = await getAllProjects();

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Work</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tighter">Projects</h1>
				</div>
				<Link
					href="/admin/projects/new"
					className="px-5 py-3 bg-white text-black text-xs font-mono uppercase tracking-widest hover:bg-zinc-200 w-fit"
				>
					New project
				</Link>
			</div>
			<ProjectsTable projects={projects} />
		</div>
	);
}
