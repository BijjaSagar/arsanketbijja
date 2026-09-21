"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { EducationItem, ExperienceItem, SiteContentData } from "@/lib/types";

function linesToList(value: string) {
	return value
		.split("\n")
		.map((item) => item.trim())
		.filter(Boolean);
}

export default function SiteForm({ initial }: { initial: SiteContentData }) {
	const router = useRouter();
	const [site, setSite] = useState(initial);
	const [education, setEducation] = useState<EducationItem[]>(initial.education);
	const [experience, setExperience] = useState<ExperienceItem[]>(
		initial.experience.map((item) => ({ ...item, details: item.details ?? [] })),
	);
	const [skillsText, setSkillsText] = useState(initial.skills.join("\n"));
	const [languagesText, setLanguagesText] = useState(initial.languages.join("\n"));
	const [workshopsText, setWorkshopsText] = useState(initial.workshops.join("\n"));
	const [competitionsText, setCompetitionsText] = useState(initial.competitions.join("\n"));
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);

	function update<K extends keyof SiteContentData>(key: K, value: SiteContentData[K]) {
		setSite((current) => ({ ...current, [key]: value }));
	}

	async function uploadProfile(file: File) {
		setUploading(true);
		setError("");
		try {
			const form = new FormData();
			form.append("file", file);
			form.append("kind", "profile");
			const response = await fetch("/api/admin/upload", { method: "POST", body: form });
			const data = (await response.json()) as { url?: string; error?: string };
			if (!response.ok || !data.url) {
				throw new Error(data.error || "Upload failed.");
			}
			update("profileImage", data.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed.");
		} finally {
			setUploading(false);
		}
	}

	async function onSubmit(event: FormEvent) {
		event.preventDefault();
		setSaving(true);
		setError("");
		setStatus("");
		const payload: SiteContentData = {
			...site,
			education,
			experience: experience.map((item) => ({
				...item,
				details: (item.details || []).map((detail) => detail.trim()).filter(Boolean),
			})),
			skills: linesToList(skillsText),
			languages: linesToList(languagesText),
			workshops: linesToList(workshopsText),
			competitions: linesToList(competitionsText),
		};

		try {
			const response = await fetch("/api/admin/site", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Could not save.");
			}
			setStatus("Saved.");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-12">
			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Field label="Name" value={site.name} onChange={(value) => update("name", value)} />
				<Field label="Role" value={site.role} onChange={(value) => update("role", value)} />
				<Field label="Email" value={site.email} onChange={(value) => update("email", value)} />
				<Field label="Location" value={site.location} onChange={(value) => update("location", value)} />
			</section>

			<label className="block">
				<Label>About</Label>
				<textarea
					value={site.about}
					onChange={(e) => update("about", e.target.value)}
					rows={8}
					className={inputClass}
				/>
			</label>

			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Field label="Issuu" value={site.social.issuu} onChange={(value) => update("social", { ...site.social, issuu: value })} />
				<Field label="Instagram" value={site.social.instagram} onChange={(value) => update("social", { ...site.social, instagram: value })} />
				<Field label="LinkedIn" value={site.social.linkedin} onChange={(value) => update("social", { ...site.social, linkedin: value })} />
			</section>

			<section>
				<Label>Profile photo</Label>
				<div className="mt-3 flex items-end gap-6">
					<div className="relative w-28 h-36 bg-zinc-900 border border-white/10 overflow-hidden">
						{site.profileImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={site.profileImage} alt="Profile" className="w-full h-full object-cover" />
						) : null}
					</div>
					<label className="text-xs font-mono uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-white cursor-pointer">
						{uploading ? "Uploading…" : "Replace image"}
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) void uploadProfile(file);
								e.target.value = "";
							}}
						/>
					</label>
				</div>
			</section>

			<section className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<NumberField
					label="Years experience"
					value={site.stats.yearsExperience}
					onChange={(value) => update("stats", { ...site.stats, yearsExperience: value })}
				/>
				<NumberField
					label="Projects completed"
					value={site.stats.projectsCompleted}
					onChange={(value) => update("stats", { ...site.stats, projectsCompleted: value })}
				/>
				<NumberField label="Awards" value={site.stats.awards} onChange={(value) => update("stats", { ...site.stats, awards: value })} />
				<NumberField label="Clients" value={site.stats.clients} onChange={(value) => update("stats", { ...site.stats, clients: value })} />
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Education</Label>
					<button
						type="button"
						className={ghostButton}
						onClick={() => setEducation((rows) => [...rows, { year: "", degree: "", school: "" }])}
					>
						Add
					</button>
				</div>
				{education.map((row, index) => (
					<div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 border border-white/10 p-4">
						<input className={`${inputClass} md:col-span-2`} placeholder="Year" value={row.year} onChange={(e) => setEducation(patchAt(education, index, { ...row, year: e.target.value }))} />
						<input className={`${inputClass} md:col-span-4`} placeholder="Degree" value={row.degree} onChange={(e) => setEducation(patchAt(education, index, { ...row, degree: e.target.value }))} />
						<input className={`${inputClass} md:col-span-5`} placeholder="School" value={row.school} onChange={(e) => setEducation(patchAt(education, index, { ...row, school: e.target.value }))} />
						<button type="button" className="md:col-span-1 text-xs text-zinc-500 hover:text-white" onClick={() => setEducation(education.filter((_, i) => i !== index))}>
							Remove
						</button>
					</div>
				))}
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Experience</Label>
					<button
						type="button"
						className={ghostButton}
						onClick={() => setExperience((rows) => [...rows, { role: "", company: "", period: "", details: [] }])}
					>
						Add
					</button>
				</div>
				{experience.map((row, index) => (
					<div key={index} className="space-y-3 border border-white/10 p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<input className={inputClass} placeholder="Role" value={row.role} onChange={(e) => setExperience(patchAt(experience, index, { ...row, role: e.target.value }))} />
							<input className={inputClass} placeholder="Company" value={row.company} onChange={(e) => setExperience(patchAt(experience, index, { ...row, company: e.target.value }))} />
							<input className={inputClass} placeholder="Period" value={row.period} onChange={(e) => setExperience(patchAt(experience, index, { ...row, period: e.target.value }))} />
						</div>
						<textarea
							className={inputClass}
							rows={3}
							placeholder="Details, one per line"
							value={(row.details || []).join("\n")}
							onChange={(e) => setExperience(patchAt(experience, index, { ...row, details: linesToList(e.target.value) }))}
						/>
						<button type="button" className="text-xs text-zinc-500 hover:text-white" onClick={() => setExperience(experience.filter((_, i) => i !== index))}>
							Remove
						</button>
					</div>
				))}
			</section>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ListArea label="Skills" value={skillsText} onChange={setSkillsText} />
				<ListArea label="Languages" value={languagesText} onChange={setLanguagesText} />
				<ListArea label="Workshops" value={workshopsText} onChange={setWorkshopsText} />
				<ListArea label="Competitions" value={competitionsText} onChange={setCompetitionsText} />
			</div>

			{error ? <p className="text-sm text-red-400">{error}</p> : null}
			{status ? <p className="text-sm text-zinc-400">{status}</p> : null}

			<button type="submit" disabled={saving} className="px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-60">
				{saving ? "Saving…" : "Save site content"}
			</button>
		</form>
	);
}

const inputClass = "w-full bg-black border border-white/15 px-3 py-2 text-sm outline-none focus:border-white";
const ghostButton = "text-[10px] font-mono uppercase tracking-widest border border-white/20 px-3 py-1 hover:border-white";

function Label({ children }: { children: React.ReactNode }) {
	return <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{children}</span>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
	return (
		<label className="block">
			<Label>{label}</Label>
			<input className={`${inputClass} mt-2`} value={value} onChange={(e) => onChange(e.target.value)} />
		</label>
	);
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
	return (
		<label className="block">
			<Label>{label}</Label>
			<input
				type="number"
				min={0}
				className={`${inputClass} mt-2`}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
		</label>
	);
}

function ListArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
	return (
		<label className="block">
			<Label>{label} (one per line)</Label>
			<textarea className={`${inputClass} mt-2`} rows={8} value={value} onChange={(e) => onChange(e.target.value)} />
		</label>
	);
}

function patchAt<T>(list: T[], index: number, next: T) {
	return list.map((item, i) => (i === index ? next : item));
}
