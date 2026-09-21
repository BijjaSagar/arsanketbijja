import { redirect } from "next/navigation";
import { getAdminEmailFromCookies } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
	const email = await getAdminEmailFromCookies();
	if (!email) {
		redirect("/admin/login");
	}

	return <AdminShell email={email}>{children}</AdminShell>;
}
