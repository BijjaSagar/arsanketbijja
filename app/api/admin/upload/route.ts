import { NextResponse } from "next/server";
import { saveUploadedImage, type UploadKind } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
	}

	const files = form.getAll("file").filter((value): value is File => value instanceof File);
	const kind = (form.get("kind") === "profile" ? "profile" : "projects") as UploadKind;

	if (files.length === 0) {
		return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
	}

	try {
		const urls: string[] = [];
		for (const file of files) {
			urls.push(await saveUploadedImage(file, kind));
		}
		return NextResponse.json({ url: urls[0], urls });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Upload failed.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
