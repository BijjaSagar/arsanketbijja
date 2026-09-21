export const metadata = {
	robots: { index: false, follow: false },
	title: "Admin | Sanket Bijja",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	return <div data-admin-root>{children}</div>;
}
