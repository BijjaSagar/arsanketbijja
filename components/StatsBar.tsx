"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
	{ value: 4, suffix: "+", label: "Years of Experience" },
	{ value: 9, suffix: "+", label: "Projects Completed" },
	{ value: 5, suffix: "+", label: "Awards & Competitions" },
	{ value: 8, suffix: "+", label: "Clients Served" },
];

export default function StatsBar() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

	useEffect(() => {
		if (!sectionRef.current) return;

		const ctx = gsap.context(() => {
			STATS.forEach((stat, i) => {
				const el = numbersRef.current[i];
				if (!el) return;

				const obj = { val: 0 };

				gsap.to(obj, {
					val: stat.value,
					duration: 2,
					ease: "power2.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 80%",
						once: true,
					},
					onUpdate: () => {
						el.textContent = Math.floor(obj.val) + stat.suffix;
					},
					onComplete: () => {
						el.textContent = stat.value + stat.suffix;
					},
				});
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={sectionRef} className="bg-zinc-950 border-y border-white/10 py-16 px-4 md:px-12">
			<div className="max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
					{STATS.map((stat, i) => (
						<div
							key={stat.label}
							className="flex flex-col items-center justify-center py-8 px-6 gap-2 text-center group"
						>
							<span
								ref={(el) => { numbersRef.current[i] = el; }}
								className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white"
							>
								0{stat.suffix}
							</span>
							<span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mt-2">
								{stat.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
