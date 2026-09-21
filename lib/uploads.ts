import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
};

export type UploadKind = "profile" | "projects";

function uploadsRoot() {
	return path.join(process.cwd(), "public", "uploads");
}

export async function saveUploadedImage(file: File, kind: UploadKind = "projects") {
	if (!file || file.size === 0) {
		throw new Error("No file uploaded.");
	}
	if (file.size > MAX_BYTES) {
		throw new Error("Image must be 10MB or smaller.");
	}

	const extFromType = ALLOWED_TYPES[file.type];
	const nameExt = path.extname(file.name).replace(".", "").toLowerCase();
	const normalizedExt = nameExt === "jpeg" ? "jpg" : nameExt;
	const ext = extFromType ?? (["jpg", "png", "webp", "gif"].includes(normalizedExt) ? normalizedExt : null);

	if (!ext) {
		throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
	}

	const folder = kind === "profile" ? "" : "projects";
	const dir = folder ? path.join(uploadsRoot(), folder) : uploadsRoot();
	await fs.mkdir(dir, { recursive: true });

	const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
	const filepath = path.join(dir, filename);
	const buffer = Buffer.from(await file.arrayBuffer());
	await fs.writeFile(filepath, buffer);

	return folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
}

export async function deleteUploadedFile(url: string) {
	if (!url.startsWith("/uploads/")) return;
	const relative = url.replace(/^\/uploads\//, "");
	const filepath = path.join(uploadsRoot(), relative);
	const resolved = path.resolve(filepath);
	if (!resolved.startsWith(path.resolve(uploadsRoot()))) return;
	try {
		await fs.unlink(resolved);
	} catch {
		// File may already be gone.
	}
}
