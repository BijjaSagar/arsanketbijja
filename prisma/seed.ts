import { ensureCmsReady } from "../lib/cms";

async function main() {
	await ensureCmsReady();
	console.log("CMS database seeded.");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		const { prisma } = await import("../lib/prisma");
		await prisma.$disconnect();
	});
