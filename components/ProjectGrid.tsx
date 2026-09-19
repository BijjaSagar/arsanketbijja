"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/data";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type FilterCategory = "All" | "Residential" | "Commercial";

const CATEGORIES: FilterCategory[] = ["All", "Residential", "Commercial"];

export default function ProjectGrid() {
	const gridRef = useRef<HTMLDivElement>(null);
	const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

	const filteredProjects = activeFilter === "All"
		? PROJECTS
		: PROJECTS.filter((p) => p.category === activeFilter);

	const getCategoryCount = (cat: FilterCategory) =>
		cat === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length;

	useEffect(() => {
		if (!gridRef.current) return;

		const projects = gsap.utils.toArray<HTMLElement>(".project-card");
		projects.forEach((project) => {
			gsap.fromTo(
				project,
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: project,
						start: "top bottom-=100",
						toggleActions: "play none none reverse",
					},
				},
			);
		});
	}, []);

	// Animate cards on filter change
	const handleFilterChange = (cat: FilterCategory) => {
		if (cat === activeFilter) return;

		const cards = gridRef.current?.querySelectorAll<HTMLElement>(".project-card");
		if (cards) {
			gsap.to(Array.from(cards), {
				opacity: 0,
				scale: 0.92,
				duration: 0.25,
				ease: "power2.in",
				stagger: 0.03,
				onComplete: () => {
					setActiveFilter(cat);
				},
			});
		} else {
			setActiveFilter(cat);
		}
	};

	// Animate in when filteredProjects changes
	useEffect(() => {
		if (!gridRef.current) return;
		const cards = gridRef.current.querySelectorAll<HTMLElement>(".project-card");
		if (cards.length > 0) {
			gsap.fromTo(
				Array.from(cards),
				{ opacity: 0, scale: 0.92, y: 20 },
				{ opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 }
			);
		}
	}, [activeFilter]);

	return (
		<section className="py-32 px-4 md:px-12 max-w-screen-2xl mx-auto">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-8 gap-6">
				<h2 className="text-4xl md:text-6xl font-bold">Selected Works</h2>
				<span className="font-mono text-sm opacity-50">2022 — 2025</span>
			</div>

			{/* Filter Tabs */}
			<div className="flex items-center gap-2 mb-12 flex-wrap">
				{CATEGORIES.map((cat) => (
					<button
						key={cat}
						onClick={() => handleFilterChange(cat)}
						className={`px-5 py-2 font-mono text-xs tracking-widest uppercase border transition-all duration-300 ${
							activeFilter === cat
								? "bg-white text-black border-white"
								: "bg-transparent text-white/60 border-white/20 hover:border-white/60 hover:text-white"
						}`}
					>
						{cat} ({getCategoryCount(cat)})
					</button>
				))}
			</div>

			<div
				ref={gridRef}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
			>
				{filteredProjects.map((project) => (
					<Link
						href={`/projects/${project.id}`}
						key={project.id}
						className="project-card group relative aspect-4/5 bg-zinc-900 overflow-hidden border border-white/5 block"
					>
						<Image
							src={project.cover}
							alt={project.title}
							fill
							className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 grayscale group-hover:grayscale-0"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>

						<div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
							<span className="font-mono text-xs text-zinc-400 mb-2">{project.category.toUpperCase()}</span>
							<h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
						</div>

						{/* Corner Accents for that 'tech/blueprint' feel */}
						<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-white/10"></div>
						<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-white/10"></div>
					</Link>
				))}
			</div>
		</section>
	);
}
