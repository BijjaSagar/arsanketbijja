"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

type ProjectDetailProps = {
	project: Project;
	otherProjects: Project[];
};

export default function ProjectDetailClient({ project, otherProjects }: ProjectDetailProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const lightboxRef = useRef<HTMLDivElement>(null);
	const lightboxImgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Initial entrance animation
			gsap.fromTo(".animate-fade-up", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" });

			// Scroll animations for "More Projects"
			const cards = gsap.utils.toArray<HTMLElement>(".more-project-card");
			cards.forEach((card) => {
				gsap.fromTo(
					card,
					{ y: 50, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: {
							trigger: card,
							start: "top bottom-=50",
							toggleActions: "play none none reverse",
						},
					},
				);
			});
		}, containerRef);
		return () => ctx.revert();
	}, []);

	// Open lightbox with GSAP animation
	const openLightbox = (index: number) => {
		setLightboxIndex(index);
	};

	// Animate lightbox in after it mounts
	useEffect(() => {
		if (lightboxIndex !== null && lightboxRef.current && lightboxImgRef.current) {
			gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
			gsap.fromTo(lightboxImgRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
		}
	}, [lightboxIndex]);

	// Close lightbox with GSAP animation
	const closeLightbox = useCallback(() => {
		if (lightboxRef.current && lightboxImgRef.current) {
			gsap.to(lightboxImgRef.current, { scale: 0.85, opacity: 0, duration: 0.25, ease: "power2.in" });
			gsap.to(lightboxRef.current, {
				opacity: 0,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => setLightboxIndex(null),
			});
		} else {
			setLightboxIndex(null);
		}
	}, []);

	const goNext = useCallback(() => {
		if (lightboxIndex === null) return;
		setLightboxIndex((prev) => (prev! + 1) % project.images.length);
	}, [lightboxIndex, project.images.length]);

	const goPrev = useCallback(() => {
		if (lightboxIndex === null) return;
		setLightboxIndex((prev) => (prev! - 1 + project.images.length) % project.images.length);
	}, [lightboxIndex, project.images.length]);

	// Keyboard navigation
	useEffect(() => {
		if (lightboxIndex === null) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeLightbox();
			if (e.key === "ArrowRight") goNext();
			if (e.key === "ArrowLeft") goPrev();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [lightboxIndex, closeLightbox, goNext, goPrev]);

	// Prevent body scroll when lightbox is open
	useEffect(() => {
		if (lightboxIndex !== null) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [lightboxIndex]);

	return (
		<main
			ref={containerRef}
			className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-12 max-w-screen-2xl mx-auto"
		>
			{/* Navigation Back */}
			<div className="mb-12 animate-fade-up">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
				>
					<ArrowLeft size={16} /> Back to Index
				</Link>
			</div>

			{/* Project Header */}
			<header className="mb-20 border-b border-white/10 pb-12 animate-fade-up">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
					<div>
						<span className="block font-mono text-sm text-zinc-500 mb-4 uppercase tracking-[0.2em]">{project.category}</span>
						<h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none">{project.title}</h1>
					</div>
					<div className="text-right hidden md:block">
						<span className="font-mono text-sm text-zinc-500">Project ID: {project.id}</span>
					</div>
				</div>
			</header>

			{/* Masonry Gallery */}
			<div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 mb-40">
				{project.images.map((img, index) => {
					// Vary sizes for visual interest
					const isLarge = index % 5 === 0;
					const isMedium = index % 3 === 1;

					return (
						<div
							key={index}
							className={`group relative break-inside-avoid animate-fade-up cursor-pointer ${isLarge ? "lg:col-span-2" : ""}`}
							onClick={() => openLightbox(index)}
						>
							{/* Corner accents */}
							<div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/20 group-hover:border-white/60 transition-colors duration-500 z-10" />
							<div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/20 group-hover:border-white/60 transition-colors duration-500 z-10" />

							<div className={`relative w-full overflow-hidden bg-zinc-900 ${isLarge ? "aspect-[4/3]" : isMedium ? "aspect-square" : "aspect-[3/4]"}`}>
								<Image
									src={img}
									alt={`${project.title} image ${index + 1}`}
									fill
									className="object-cover transition-all duration-700 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									priority={index < 3}
								/>

								{/* Hover overlay */}
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
									<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-xs text-white uppercase tracking-widest bg-black/50 px-3 py-1">
										View
									</span>
								</div>

								{/* Figure number */}
								<div className="absolute bottom-3 left-3 font-mono text-xs text-white/60 group-hover:text-white/90 transition-colors">
									{index + 1}.{(index % 3) + 1}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Other Projects Section */}
			<section className="border-t border-white/10 pt-20">
				<div className="mb-12 animate-fade-up">
					<h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">More Projects</h2>
					<p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Explore other works</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
					{otherProjects.map((other) => (
						<Link
							href={`/projects/${other.id}`}
							key={other.id}
							className="more-project-card group relative aspect-4/5 bg-zinc-900 overflow-hidden border border-white/5 block"
						>
							<Image
								src={other.cover}
								alt={other.title}
								fill
								className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 grayscale group-hover:grayscale-0"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>

							<div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
								<span className="font-mono text-xs text-zinc-400 mb-2">{other.category.toUpperCase()}</span>
								<h3 className="text-xl font-bold leading-tight">{other.title}</h3>
							</div>

							{/* Corner Accents */}
							<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-white/10"></div>
							<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-white/10"></div>
						</Link>
					))}
				</div>
			</section>

			{/* Footer Navigation */}
			<div className="mt-32 border-t border-white/10 pt-12 flex justify-between items-center animate-fade-up">
				<Link
					href="/"
					className="text-zinc-500 hover:text-white transition-colors font-mono uppercase tracking-widest text-sm"
				>
					All Projects
				</Link>
			</div>

			{/* Lightbox Modal */}
			{lightboxIndex !== null && (
				<div
					ref={lightboxRef}
					className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
					onClick={(e) => {
						if (e.target === e.currentTarget) closeLightbox();
					}}
				>
					{/* Close Button */}
					<button
						onClick={closeLightbox}
						className="absolute top-5 right-5 z-10 text-white/70 hover:text-white transition-colors p-2 border border-white/20 hover:border-white/60 bg-black/50"
						aria-label="Close"
					>
						<X size={20} />
					</button>

					{/* Image Counter */}
					<div className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-sm text-white/60 z-10">
						{lightboxIndex + 1} / {project.images.length}
					</div>

					{/* Prev Button */}
					<button
						onClick={goPrev}
						className="absolute left-4 z-10 text-white/70 hover:text-white transition-colors p-3 border border-white/20 hover:border-white/60 bg-black/50"
						aria-label="Previous image"
					>
						<ArrowLeft size={20} />
					</button>

					{/* Image Container */}
					<div
						ref={lightboxImgRef}
						className="relative w-full h-full flex items-center justify-center px-20 py-16"
					>
						<div className="relative w-full h-full max-w-5xl">
							<Image
								src={project.images[lightboxIndex]}
								alt={`${project.title} image ${lightboxIndex + 1}`}
								fill
								className="object-contain"
								sizes="100vw"
								priority
							/>
						</div>
					</div>

					{/* Next Button */}
					<button
						onClick={goNext}
						className="absolute right-4 z-10 text-white/70 hover:text-white transition-colors p-3 border border-white/20 hover:border-white/60 bg-black/50"
						aria-label="Next image"
					>
						<ArrowRight size={20} />
					</button>
				</div>
			)}
		</main>
	);
}
