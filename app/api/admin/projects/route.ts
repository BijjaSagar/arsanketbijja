import { NextResponse } from "next/server";
import { createProject, getAllProjects, slugExists } from "@/lib/cms";
import { sanitizeSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function GET() {
	const projects = await getAllProjects();
	return NextResponse.json(projects);
}

export async function POST(request: Request) {
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

	if (await slugExists(slug)) {
		return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
	}

	const project = await createProject({
		slug,
		title,
		category: body.category?.trim() || "Residential",
		cover: body.cover?.trim() || "",
		description: body.description?.trim() || "",
		published: body.published !== false,
		images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
		sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : undefined,
	});

	revalidatePath("/", "layout");
	revalidatePath(`/projects/${slug}`);
	return NextResponse.json(project, { status: 201 });
}
