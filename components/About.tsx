import { PERSONAL_INFO } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function About() {
	return (
		<section className="py-32 px-4 md:px-12 max-w-screen-2xl mx-auto bg-zinc-950/50 border-y border-white/10">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
				{/* Left Column: Bio */}
				<div className="space-y-8">
					<h2 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500">Profile</h2>
					<p className="text-lg md:text-2xl leading-relaxed font-light text-zinc-300 text-justify">{PERSONAL_INFO.about}</p>

					<div className="pt-8">
						<a
							href="/cv.pdf"
							target="_blank"
							className="inline-flex items-center gap-3 px-6 py-3 border border-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
						>
							Download CV <ArrowRight size={16} />
						</a>
					</div>
				</div>

				{/* Right Column: Details */}
				<div className="space-y-12">
					{/* Education */}
					<div>
						<h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Education</h3>
						<ul className="space-y-6">
							{PERSONAL_INFO.education.map((edu, i) => (
								<li
									key={i}
									className="flex flex-col md:flex-row justify-between md:items-start gap-2"
								>
									<div className="flex-1">
										<h4 className="font-bold text-lg">{edu.degree}</h4>
										<p className="text-zinc-400">{edu.school}</p>
									</div>
									<span className="font-mono text-sm text-zinc-500">{edu.year}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Experience */}
					<div>
						<h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Experience</h3>
						<ul className="space-y-8">
							{PERSONAL_INFO.experience.map((exp, i) => (
								<li
									key={i}
									className="space-y-2"
								>
									<div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
										<div>
											<h4 className="font-bold text-lg">{exp.role}</h4>
											<p className="text-zinc-400">{exp.company}</p>
										</div>
										<span className="font-mono text-sm text-zinc-500">{exp.period}</span>
									</div>
									{exp.details && (
										<ul className="list-disc list-inside text-sm text-zinc-500 pl-2 space-y-1">
											{exp.details.map((detail, idx) => (
												<li key={idx}>{detail}</li>
											))}
										</ul>
									)}
								</li>
							))}
						</ul>
					</div>

					{/* Skills */}
					<div>
						<h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Software & Skills</h3>
						<div className="flex flex-wrap gap-3">
							{PERSONAL_INFO.skills.map((skill, i) => (
								<span
									key={i}
									className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs tracking-wide"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
