import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/cms";
import type { SiteContentData } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

function isSiteContent(value: unknown): value is SiteContentData {
	if (!value || typeof value !== "object") return false;
	const data = value as SiteContentData;
	return (
		typeof data.name === "string" &&
		typeof data.role === "string" &&
		typeof data.email === "string" &&
		typeof data.location === "string" &&
		typeof data.about === "string" &&
		typeof data.profileImage === "string" &&
		!!data.social &&
		!!data.stats &&
		Array.isArray(data.education) &&
		Array.isArray(data.experience) &&
		Array.isArray(data.skills)
	);
}

export async function GET() {
	const site = await getSiteContent();
	return NextResponse.json(site);
}

export async function PUT(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
	}

	if (!isSiteContent(body)) {
		return NextResponse.json({ error: "Invalid site content." }, { status: 400 });
	}

	const site = await updateSiteContent({
		...body,
		languages: Array.isArray(body.languages) ? body.languages : [],
		workshops: Array.isArray(body.workshops) ? body.workshops : [],
		competitions: Array.isArray(body.competitions) ? body.competitions : [],
		stats: {
			yearsExperience: Number(body.stats.yearsExperience) || 0,
			projectsCompleted: Number(body.stats.projectsCompleted) || 0,
			awards: Number(body.stats.awards) || 0,
			clients: Number(body.stats.clients) || 0,
		},
	});

	revalidatePath("/", "layout");
	revalidatePath("/about");
	return NextResponse.json(site);
}
