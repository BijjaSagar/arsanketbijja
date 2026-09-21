export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { mkdirSync } = await import("node:fs");
		const { join } = await import("node:path");
		mkdirSync(join(process.cwd(), "data"), { recursive: true });
		mkdirSync(join(process.cwd(), "public", "uploads", "projects"), { recursive: true });
		const { ensureCmsReady } = await import("./lib/cms");
		await ensureCmsReady();
	}
}
