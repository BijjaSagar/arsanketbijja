import { NextResponse } from "next/server";
import { deleteProject, getProjectById, slugExists, updateProject } from "@/lib/cms";
import { deleteUploadedFile } from "@/lib/uploads";
import { sanitizeSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
	const { id } = await context.params;
	const project = await getProjectById(id);
	if (!project) {
		return NextResponse.json({ error: "Project not found." }, { status: 404 });
	}
	return NextResponse.json(project);
}

export async function PUT(request: Request, context: RouteContext) {
	const { id } = await context.params;
	const existing = await getProjectById(id);
	if (!existing) {
		return NextResponse.json({ error: "Project not found." }, { status: 404 });
	}

	let body: {
		title?: string;
		slug?: string;
		category?: string;
		cover?: string;
		description?: string;
		published?: boolean;
		images?: string[];
		sortOrder?: number;
	};

	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
	}

	const title = body.title?.trim() ?? "";
	if (!title) {
		return NextResponse.json({ error: "Title is required." }, { status: 400 });
	}

	const slug = sanitizeSlug(body.slug?.trim() || title);
	if (!slug) {
		return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
	}

	if (await slugExists(slug, id)) {
		return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
	}

	const images = Array.isArray(body.images) ? body.images.filter(Boolean) : existing.images;
	const removed = existing.images.filter((url) => !images.includes(url));
	const cover = body.cover?.trim() || existing.cover;
	if (existing.cover && existing.cover !== cover) {
		removed.push(existing.cover);
	}

	const project = await updateProject(id, {
		slug,
		title,
		category: body.category?.trim() || existing.category,
		cover,
		description: body.description?.trim() ?? existing.description,
		published: body.published !== false,
		images,
		sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : existing.sortOrder,
	});

	await Promise.all(removed.filter((url) => !images.includes(url) && url !== cover).map((url) => deleteUploadedFile(url)));

	revalidatePath("/", "layout");
	revalidatePath(`/projects/${existing.slug}`);
	revalidatePath(`/projects/${slug}`);
	return NextResponse.json(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
	const { id } = await context.params;
	const existing = await getProjectById(id);
	if (!existing) {
		return NextResponse.json({ error: "Project not found." }, { status: 404 });
	}

	await deleteProject(id);
	await Promise.all([existing.cover, ...existing.images].map((url) => deleteUploadedFile(url)));

	revalidatePath("/", "layout");
	revalidatePath(`/projects/${existing.slug}`);
	return NextResponse.json({ ok: true });
}
