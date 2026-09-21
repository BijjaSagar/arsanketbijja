import ProjectEditor from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
	return (
		<div className="space-y-8">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Work</p>
				<h1 className="mt-2 text-4xl font-bold tracking-tighter">New project</h1>
			</div>
			<ProjectEditor />
		</div>
	);
}
