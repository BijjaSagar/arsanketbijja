"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsProject } from "@/lib/types";

export default function ProjectsTable({ projects }: { projects: CmsProject[] }) {
	const router = useRouter();
	const [pendingId, setPendingId] = useState<string | null>(null);

	async function remove(project: CmsProject) {
		if (!confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
		setPendingId(project.id);
		const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
		setPendingId(null);
		if (!response.ok) {
			const data = (await response.json()) as { error?: string };
			alert(data.error || "Could not delete project.");
			return;
		}
		router.refresh();
	}

	if (projects.length === 0) {
		return <p className="text-zinc-500">No projects yet.</p>;
	}

	return (
		<div className="overflow-x-auto border border-white/10">
			<table className="w-full text-left text-sm">
				<thead className="bg-zinc-950 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
					<tr>
						<th className="px-4 py-3 font-normal">Cover</th>
						<th className="px-4 py-3 font-normal">Title</th>
						<th className="px-4 py-3 font-normal">Category</th>
						<th className="px-4 py-3 font-normal">Status</th>
						<th className="px-4 py-3 font-normal text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.id} className="border-t border-white/10">
							<td className="px-4 py-3">
								<div className="relative w-16 h-20 bg-zinc-900 overflow-hidden">
									{project.cover ? (
										<Image src={project.cover} alt="" fill className="object-cover" sizes="64px" />
									) : null}
								</div>
							</td>
							<td className="px-4 py-3">
								<div className="font-medium">{project.title}</div>
								<div className="text-xs text-zinc-500 font-mono">{project.slug}</div>
							</td>
							<td className="px-4 py-3 text-zinc-400">{project.category}</td>
							<td className="px-4 py-3">
								<span className={project.published ? "text-white" : "text-zinc-500"}>{project.published ? "Published" : "Draft"}</span>
							</td>
							<td className="px-4 py-3 text-right whitespace-nowrap">
								<Link href={`/admin/projects/${project.id}`} className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 mr-4">
									Edit
								</Link>
								<button
									onClick={() => void remove(project)}
									disabled={pendingId === project.id}
									className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-red-400 disabled:opacity-50"
								>
									{pendingId === project.id ? "Deleting…" : "Delete"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
