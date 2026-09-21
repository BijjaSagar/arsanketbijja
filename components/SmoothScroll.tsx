"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
	return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const enabled = !pathname.startsWith("/admin");
	const [lenis, setLenis] = useState<Lenis | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const instance = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			gestureOrientation: "vertical",
			smoothWheel: true,
			syncTouch: false,
			touchMultiplier: 2,
		});

		setLenis(instance);

		let rafId = 0;
		function raf(time: number) {
			instance.raf(time);
			rafId = requestAnimationFrame(raf);
		}

		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			instance.destroy();
			setLenis(null);
		};
	}, [enabled]);

	if (!enabled) return <>{children}</>;

	return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
