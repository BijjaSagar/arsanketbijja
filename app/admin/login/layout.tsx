import { redirect } from "next/navigation";
import { getAdminEmailFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginLayout({ children }: { children: React.ReactNode }) {
	const email = await getAdminEmailFromCookies();
	if (email) {
		redirect("/admin");
	}
	return children;
}
