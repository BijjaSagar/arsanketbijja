"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!barRef.current) return;

		const ctx = gsap.context(() => {
			gsap.to(barRef.current, {
				scaleX: 1,
				ease: "none",
				scrollTrigger: {
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			});
		});

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={barRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				height: "3px",
				backgroundColor: "white",
				transformOrigin: "left",
				transform: "scaleX(0)",
				zIndex: 9999,
				pointerEvents: "none",
			}}
		/>
	);
}
