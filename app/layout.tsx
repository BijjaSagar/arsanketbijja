import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sanket Bijja | Junior Architect",
	description: "Portfolio of Sanket Vittal Bijja - Architecture, Design, and Creativity.",
};

import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-white selection:text-black cursor-none`}>
				<ScrollProgress />
				<Cursor />
				<Header />
				<SmoothScroll>{children}</SmoothScroll>
			</body>
		</html>
	);
}
