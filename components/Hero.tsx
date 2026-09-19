"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PERSONAL_INFO } from "@/lib/data";

export default function Hero() {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!svgRef.current || !textRef.current) return;

		const tl = gsap.timeline();

		// Text entrance
		tl.fromTo(textRef.current.children, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" });

		// Symmetry Animation
		const circles = svgRef.current.querySelectorAll("circle");
		const lines = svgRef.current.querySelectorAll("line");

		tl.fromTo(circles, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.8, duration: 1.5, stagger: 0.1, ease: "elastic.out(1, 0.5)" }, "-=0.5");

		tl.fromTo(lines, { opacity: 0 }, { opacity: 0.5, duration: 1, stagger: 0.05 }, "-=1");

		// Continuous rotation
		gsap.to(svgRef.current, {
			rotation: 360,
			duration: 60,
			repeat: -1,
			ease: "none",
		});

		// Interactive distortion (simple parallax)
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth - 0.5) * 20;
			const y = (clientY / window.innerHeight - 0.5) * 20;

			gsap.to(svgRef.current, {
				x: x,
				y: y,
				duration: 1,
				ease: "power2.out",
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<section
			ref={containerRef}
			className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/10"
		>
			{/* Mathematical / Symmetry Background */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<svg
					ref={svgRef}
					viewBox="0 0 800 800"
					className="w-[150vmin] h-[150vmin] stroke-white fill-none"
					style={{ strokeWidth: 1 }}
				>
					{/* Concentric Circles */}
					{[100, 200, 300, 350].map((r, i) => (
						<circle
							key={`c-${i}`}
							cx="400"
							cy="400"
							r={r}
						/>
					))}

					{/* Geometric Lines */}
					{[0, 30, 60, 90, 120, 150].map((deg, i) => (
						<g
							key={`l-${i}`}
							transform={`rotate(${deg} 400 400)`}
						>
							<line
								x1="400"
								y1="50"
								x2="400"
								y2="750"
							/>
							<rect
								x="350"
								y="350"
								width="100"
								height="100"
								transform="rotate(45 400 400)"
							/>
						</g>
					))}
				</svg>
			</div>

			<div
				ref={textRef}
				className="relative z-10 text-center text-white"
			>
				<h2 className="text-sm md:text-base font-mono tracking-[0.5em] mb-4 uppercase opacity-70">Portfolio</h2>
				<h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-6">
					{PERSONAL_INFO.name.split(" ").map((word, i) => (
						<span
							key={i}
							className="block"
						>
							{word}
						</span>
					))}
				</h1>
				<p className="text-xl md:text-2xl font-light tracking-widest opacity-80">{PERSONAL_INFO.role}</p>
			</div>
		</section>
	);
}
