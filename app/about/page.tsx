import { getSiteContent } from "@/lib/cms";
import AboutPageClient from "./AboutPageClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
	const site = await getSiteContent();
	return <AboutPageClient site={site} />;
}
