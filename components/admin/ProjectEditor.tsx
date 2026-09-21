"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import type { CmsProject } from "@/lib/types";
import { sanitizeSlug } from "@/lib/utils";

const CATEGORIES = ["Residential", "Commercial", "Other"];

type Draft = {
	title: string;
	slug: string;
	category: string;
	customCategory: string;
	cover: string;
	description: string;
	published: boolean;
	sortOrder: number;
	images: string[];
};

function toDraft(project?: CmsProject | null): Draft {
	const category = project?.category || "Residential";
	const known = CATEGORIES.includes(category);
	return {
		title: project?.title ?? "",
		slug: project?.slug ?? "",
		category: known ? category : "Other",
		customCategory: known ? "" : category,
		cover: project?.cover ?? "",
		description: project?.description ?? "",
		published: project?.published ?? true,
		sortOrder: project?.sortOrder ?? 0,
		images: project?.images ?? [],
	};
}

export default function ProjectEditor({ project }: { project?: CmsProject | null }) {
	const router = useRouter();
	const isNew = !project;
	const [draft, setDraft] = useState<Draft>(() => toDraft(project));
	const [slugTouched, setSlugTouched] = useState(!isNew);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");

	const resolvedCategory = draft.category === "Other" ? draft.customCategory.trim() || "Other" : draft.category;

	const payload = useMemo(
		() => ({
			title: draft.title.trim(),
			slug: sanitizeSlug(draft.slug || draft.title),
			category: resolvedCategory,
			cover: draft.cover,
			description: draft.description,
			published: draft.published,
			sortOrder: draft.sortOrder,
			images: draft.images,
		}),
		[draft, resolvedCategory],
	);

	function set<K extends keyof Draft>(key: K, value: Draft[K]) {
		setDraft((current) => ({ ...current, [key]: value }));
	}

	async function uploadFiles(files: FileList | File[], asCover = false) {
		setUploading(true);
		setError("");
		try {
			const form = new FormData();
			for (const file of Array.from(files)) {
				form.append("file", file);
			}
			form.append("kind", "projects");
			const response = await fetch("/api/admin/upload", { method: "POST", body: form });
			const data = (await response.json()) as { url?: string; urls?: string[]; error?: string };
			if (!response.ok) {
				throw new Error(data.error || "Upload failed.");
			}
			const urls = data.urls?.length ? data.urls : data.url ? [data.url] : [];
			if (asCover && urls[0]) {
				set("cover", urls[0]);
			} else if (urls.length) {
				setDraft((current) => ({
					...current,
					images: [...current.images, ...urls],
					cover: current.cover || urls[0],
				}));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed.");
		} finally {
			setUploading(false);
		}
	}

	function moveImage(index: number, direction: -1 | 1) {
		const next = index + direction;
		if (next < 0 || next >= draft.images.length) return;
		const images = [...draft.images];
		const [item] = images.splice(index, 1);
		images.splice(next, 0, item);
		set("images", images);
	}

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		setSaving(true);
		setError("");
		try {
			const response = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${project.id}`, {
				method: isNew ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Could not save project.");
			}
			router.push("/admin/projects");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save project.");
			setSaving(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<label className="block">
					<Label>Title</Label>
					<input
						className={inputClass}
						value={draft.title}
						onChange={(e) => {
							const title = e.target.value;
							setDraft((current) => ({
								...current,
								title,
								slug: slugTouched ? current.slug : sanitizeSlug(title),
							}));
						}}
						required
					/>
				</label>
				<label className="block">
					<Label>Slug</Label>
					<input
						className={inputClass}
						value={draft.slug}
						onChange={(e) => {
							setSlugTouched(true);
							set("slug", e.target.value);
						}}
					/>
				</label>
				<label className="block">
					<Label>Category</Label>
					<select className={inputClass} value={draft.category} onChange={(e) => set("category", e.target.value)}>
						{CATEGORIES.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</label>
				{draft.category === "Other" ? (
					<label className="block">
						<Label>Custom category</Label>
						<input className={inputClass} value={draft.customCategory} onChange={(e) => set("customCategory", e.target.value)} />
					</label>
				) : null}
				<label className="block">
					<Label>Sort order</Label>
					<input
						type="number"
						className={inputClass}
						value={draft.sortOrder}
						onChange={(e) => set("sortOrder", Number(e.target.value))}
					/>
				</label>
				<label className="flex items-center gap-3 pt-6">
					<input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
					<span className="font-mono text-xs uppercase tracking-widest">Published</span>
				</label>
			</div>

			<label className="block">
				<Label>Description</Label>
				<textarea className={inputClass} rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
			</label>

			<section>
				<Label>Cover</Label>
				<div className="mt-3 flex flex-wrap items-end gap-6">
					<div className="relative w-32 h-40 bg-zinc-900 border border-white/10 overflow-hidden">
						{draft.cover ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={draft.cover} alt="" className="w-full h-full object-cover" />
						) : null}
					</div>
					<label className="text-xs font-mono uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-white cursor-pointer">
						{uploading ? "Uploading…" : "Upload cover"}
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							className="hidden"
							onChange={(e) => {
								const files = e.target.files;
								if (files?.length) void uploadFiles(files, true);
								e.target.value = "";
							}}
						/>
					</label>
				</div>
			</section>

			<section>
				<div className="flex items-center justify-between gap-4">
					<Label>Gallery</Label>
					<label className="text-xs font-mono uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-white cursor-pointer">
						{uploading ? "Uploading…" : "Add images"}
						<input
							type="file"
							multiple
							accept="image/jpeg,image/png,image/webp,image/gif"
							className="hidden"
							onChange={(e) => {
								const files = e.target.files;
								if (files?.length) void uploadFiles(files);
								e.target.value = "";
							}}
						/>
					</label>
				</div>
				<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
					{draft.images.map((url, index) => (
						<div key={`${url}-${index}`} className="border border-white/10 bg-zinc-950">
							<div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={url} alt="" className="w-full h-full object-cover" />
							</div>
							<div className="flex items-center justify-between px-2 py-2">
								<div className="flex gap-1">
									<button type="button" onClick={() => moveImage(index, -1)} className="p-1 text-zinc-400 hover:text-white" aria-label="Move up">
										<ArrowUp size={14} />
									</button>
									<button type="button" onClick={() => moveImage(index, 1)} className="p-1 text-zinc-400 hover:text-white" aria-label="Move down">
										<ArrowDown size={14} />
									</button>
								</div>
								<button
									type="button"
									onClick={() => set("images", draft.images.filter((_, i) => i !== index))}
									className="p-1 text-zinc-400 hover:text-red-400"
									aria-label="Remove image"
								>
									<X size={14} />
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{error ? <p className="text-sm text-red-400">{error}</p> : null}

			<div className="flex gap-4">
				<button type="submit" disabled={saving} className="px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-60">
					{saving ? "Saving…" : isNew ? "Create project" : "Save project"}
				</button>
			</div>
		</form>
	);
}

const inputClass = "mt-2 w-full bg-black border border-white/15 px-3 py-2 text-sm outline-none focus:border-white";

function Label({ children }: { children: React.ReactNode }) {
	return <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{children}</span>;
}
