import { PROJECTS } from "./data";
import { DEFAULT_SITE_CONTENT } from "./default-content";
import { prisma } from "./prisma";
import { hashPassword } from "./password";
import type { CmsProject, PublicProject, SiteContentData } from "./types";
import type { SiteContent, Project, ProjectImage } from "@prisma/client";

let readyPromise: Promise<void> | null = null;

function parseJson<T>(value: string, fallback: T): T {
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

function mapSite(row: SiteContent): SiteContentData {
	return {
		name: row.name,
		role: row.role,
		email: row.email,
		location: row.location,
		about: row.about,
		profileImage: row.profileImage,
		social: {
			issuu: row.socialIssuu,
			instagram: row.socialInstagram,
			linkedin: row.socialLinkedin,
		},
		stats: {
			yearsExperience: row.yearsExperience,
			projectsCompleted: row.projectsCompleted,
			awards: row.awards,
			clients: row.clients,
		},
		education: parseJson(row.education, DEFAULT_SITE_CONTENT.education),
		experience: parseJson(row.experience, DEFAULT_SITE_CONTENT.experience),
		skills: parseJson(row.skills, DEFAULT_SITE_CONTENT.skills),
		languages: parseJson(row.languages, DEFAULT_SITE_CONTENT.languages),
		workshops: parseJson(row.workshops, DEFAULT_SITE_CONTENT.workshops),
		competitions: parseJson(row.competitions, DEFAULT_SITE_CONTENT.competitions),
	};
}

type ProjectWithImages = Project & { images: ProjectImage[] };

function mapProject(row: ProjectWithImages): CmsProject {
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		category: row.category,
		cover: row.cover,
		description: row.description,
		sortOrder: row.sortOrder,
		published: row.published,
		images: [...row.images].sort((a, b) => a.sortOrder - b.sortOrder).map((image) => image.url),
	};
}

export function toPublicProject(project: CmsProject): PublicProject {
	return {
		id: project.slug,
		title: project.title,
		category: project.category,
		cover: project.cover,
		images: project.images,
		description: project.description || undefined,
	};
}

async function upsertAdminFromEnv() {
	const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
	const password = process.env.ADMIN_PASSWORD;
	if (!email || !password) return;

	const passwordHash = await hashPassword(password);
	await prisma.adminUser.upsert({
		where: { email },
		update: { passwordHash },
		create: { email, passwordHash },
	});
}

async function seedSiteIfEmpty() {
	const existing = await prisma.siteContent.findUnique({ where: { id: "site" } });
	if (existing) return;

	const site = DEFAULT_SITE_CONTENT;
	await prisma.siteContent.create({
		data: {
			id: "site",
			name: site.name,
			role: site.role,
			email: site.email,
			location: site.location,
			about: site.about,
			profileImage: site.profileImage,
			socialIssuu: site.social.issuu,
			socialInstagram: site.social.instagram,
			socialLinkedin: site.social.linkedin,
			yearsExperience: site.stats.yearsExperience,
			projectsCompleted: site.stats.projectsCompleted,
			awards: site.stats.awards,
			clients: site.stats.clients,
			education: JSON.stringify(site.education),
			experience: JSON.stringify(site.experience),
			skills: JSON.stringify(site.skills),
			languages: JSON.stringify(site.languages),
			workshops: JSON.stringify(site.workshops),
			competitions: JSON.stringify(site.competitions),
		},
	});
}

async function seedProjectsIfEmpty() {
	const count = await prisma.project.count();
	if (count > 0) return;

	for (const [index, project] of PROJECTS.entries()) {
		await prisma.project.create({
			data: {
				slug: project.id,
				title: project.title,
				category: project.category,
				cover: project.cover,
				description: "",
				sortOrder: index,
				published: true,
				images: {
					create: project.images.map((url, imageIndex) => ({
						url,
						sortOrder: imageIndex,
					})),
				},
			},
		});
	}
}

async function doEnsure() {
	await seedSiteIfEmpty();
	await seedProjectsIfEmpty();
	await upsertAdminFromEnv();
}

export async function ensureCmsReady() {
	if (!readyPromise) {
		readyPromise = doEnsure().catch((error) => {
			readyPromise = null;
			throw error;
		});
	}
	return readyPromise;
}

export async function getSiteContent(): Promise<SiteContentData> {
	try {
		await ensureCmsReady();
		const row = await prisma.siteContent.findUnique({ where: { id: "site" } });
		if (!row) return DEFAULT_SITE_CONTENT;
		return mapSite(row);
	} catch (error) {
		console.error("Failed to load site content from CMS, using fallback.", error);
		return DEFAULT_SITE_CONTENT;
	}
}

export async function updateSiteContent(data: SiteContentData) {
	await ensureCmsReady();
	const row = await prisma.siteContent.upsert({
		where: { id: "site" },
		update: {
			name: data.name,
			role: data.role,
			email: data.email,
			location: data.location,
			about: data.about,
			profileImage: data.profileImage,
			socialIssuu: data.social.issuu,
			socialInstagram: data.social.instagram,
			socialLinkedin: data.social.linkedin,
			yearsExperience: data.stats.yearsExperience,
			projectsCompleted: data.stats.projectsCompleted,
			awards: data.stats.awards,
			clients: data.stats.clients,
			education: JSON.stringify(data.education),
			experience: JSON.stringify(data.experience),
			skills: JSON.stringify(data.skills),
			languages: JSON.stringify(data.languages),
			workshops: JSON.stringify(data.workshops),
			competitions: JSON.stringify(data.competitions),
		},
		create: {
			id: "site",
			name: data.name,
			role: data.role,
			email: data.email,
			location: data.location,
			about: data.about,
			profileImage: data.profileImage,
			socialIssuu: data.social.issuu,
			socialInstagram: data.social.instagram,
			socialLinkedin: data.social.linkedin,
			yearsExperience: data.stats.yearsExperience,
			projectsCompleted: data.stats.projectsCompleted,
			awards: data.stats.awards,
			clients: data.stats.clients,
			education: JSON.stringify(data.education),
			experience: JSON.stringify(data.experience),
			skills: JSON.stringify(data.skills),
			languages: JSON.stringify(data.languages),
			workshops: JSON.stringify(data.workshops),
			competitions: JSON.stringify(data.competitions),
		},
	});
	return mapSite(row);
}

export async function getAllProjects(): Promise<CmsProject[]> {
	try {
		await ensureCmsReady();
		const rows = await prisma.project.findMany({
			include: { images: true },
			orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
		});
		return rows.map(mapProject);
	} catch (error) {
		console.error("Failed to load projects from CMS, using fallback.", error);
		return PROJECTS.map((project, index) => ({
			id: project.id,
			slug: project.id,
			title: project.title,
			category: project.category,
			cover: project.cover,
			description: "",
			sortOrder: index,
			published: true,
			images: project.images,
		}));
	}
}

export async function getPublishedProjects(): Promise<PublicProject[]> {
	const projects = await getAllProjects();
	return projects.filter((project) => project.published).map(toPublicProject);
}

export async function getProjectBySlug(slug: string, includeUnpublished = false): Promise<CmsProject | null> {
	try {
		await ensureCmsReady();
		const row = await prisma.project.findUnique({
			where: { slug },
			include: { images: true },
		});
		if (!row) return null;
		if (!includeUnpublished && !row.published) return null;
		return mapProject(row);
	} catch (error) {
		console.error("Failed to load project from CMS, using fallback.", error);
		const fallback = PROJECTS.find((project) => project.id === slug);
		if (!fallback) return null;
		return {
			id: fallback.id,
			slug: fallback.id,
			title: fallback.title,
			category: fallback.category,
			cover: fallback.cover,
			description: "",
			sortOrder: 0,
			published: true,
			images: fallback.images,
		};
	}
}

export async function getProjectById(id: string): Promise<CmsProject | null> {
	await ensureCmsReady();
	const row = await prisma.project.findUnique({
		where: { id },
		include: { images: true },
	});
	return row ? mapProject(row) : null;
}

export async function createProject(input: {
	slug: string;
	title: string;
	category: string;
	cover: string;
	description: string;
	published: boolean;
	images: string[];
	sortOrder?: number;
}) {
	await ensureCmsReady();
	const maxSort = await prisma.project.aggregate({ _max: { sortOrder: true } });
	const sortOrder = input.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;

	const row = await prisma.project.create({
		data: {
			slug: input.slug,
			title: input.title,
			category: input.category,
			cover: input.cover,
			description: input.description,
			published: input.published,
			sortOrder,
			images: {
				create: input.images.map((url, index) => ({ url, sortOrder: index })),
			},
		},
		include: { images: true },
	});
	return mapProject(row);
}

export async function updateProject(
	id: string,
	input: {
		slug: string;
		title: string;
		category: string;
		cover: string;
		description: string;
		published: boolean;
		images: string[];
		sortOrder?: number;
	},
) {
	await ensureCmsReady();
	await prisma.projectImage.deleteMany({ where: { projectId: id } });
	const row = await prisma.project.update({
		where: { id },
		data: {
			slug: input.slug,
			title: input.title,
			category: input.category,
			cover: input.cover,
			description: input.description,
			published: input.published,
			...(typeof input.sortOrder === "number" ? { sortOrder: input.sortOrder } : {}),
			images: {
				create: input.images.map((url, index) => ({ url, sortOrder: index })),
			},
		},
		include: { images: true },
	});
	return mapProject(row);
}

export async function deleteProject(id: string) {
	await ensureCmsReady();
	await prisma.project.delete({ where: { id } });
}

export async function getDashboardCounts() {
	await ensureCmsReady();
	const [projects, published] = await Promise.all([
		prisma.project.count(),
		prisma.project.count({ where: { published: true } }),
	]);
	return { projects, published };
}

export async function findAdminByEmail(email: string) {
	await ensureCmsReady();
	return prisma.adminUser.findUnique({
		where: { email: email.trim().toLowerCase() },
	});
}

export async function slugExists(slug: string, excludeId?: string) {
	await ensureCmsReady();
	const existing = await prisma.project.findUnique({ where: { slug } });
	if (!existing) return false;
	if (excludeId && existing.id === excludeId) return false;
	return true;
}
