"use client";

import { PERSONAL_INFO } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-fade-up",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto math-grid" ref={containerRef}>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Header / Intro */}
        <div className="lg:col-span-8 animate-fade-up">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
                About Me
            </h1>
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-300">
                {PERSONAL_INFO.about}
            </p>
             <div className="pt-10">
                <a 
                    href="/cv.pdf" 
                    target="_blank"
                    className="inline-flex items-center gap-3 px-6 py-3 border border-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
                >
                    Download CV <ArrowRight size={16} />
                </a>
              </div>
        </div>

        {/* Image Section */}
        <div className="lg:col-span-4 animate-fade-up relative aspect-[3/4] w-full border border-white/10 bg-zinc-900 overflow-hidden">
             {/* Using the personal image found in public/personal/me.png */}
             <Image 
                src="/personal/me.png" 
                alt="Sanket Bijja"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
             />
              {/* Decorative Lines */}
             <div className="absolute top-4 right-4 w-2 h-2 bg-white mix-blend-difference" />
             <div className="absolute bottom-4 left-4 w-2 h-2 bg-white mix-blend-difference" />
        </div>
        
        <div className="col-span-full h-px bg-white/10 my-8 animate-fade-up" />

        {/* Detailed Info Columns */}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-16 animate-fade-up">
           
            {/* Education & Experience */}
            <div className="space-y-16">
                 {/* Education */}
                <div>
                    <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Education</h3>
                    <ul className="space-y-8">
                        {PERSONAL_INFO.education.map((edu, i) => (
                            <li key={i} className="flex flex-col gap-1">
                                <h4 className="font-bold text-xl">{edu.degree}</h4>
                                <div className="flex justify-between items-center text-zinc-400 font-mono text-sm">
                                    <span>{edu.school}</span>
                                    <span>{edu.year}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Experience */}
                <div>
                    <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Experience</h3>
                    <ul className="space-y-10">
                        {PERSONAL_INFO.experience.map((exp, i) => (
                            <li key={i} className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-xl">{exp.role}</h4>
                                    <div className="flex justify-between items-center text-zinc-400 font-mono text-sm">
                                        <span>{exp.company}</span>
                                        <span>{exp.period}</span>
                                    </div>
                                </div>
                                {exp.details && (
                                    <ul className="list-disc list-inside text-sm text-zinc-500 pl-2 space-y-1 pt-2">
                                        {exp.details.map((detail, idx) => (
                                            <li key={idx}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Skills & Connect */}
            <div className="space-y-16">
                 {/* Skills */}
                <div>
                    <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Software & Skills</h3>
                    <div className="flex flex-wrap gap-3">
                        {PERSONAL_INFO.skills.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/30 transition-colors text-sm tracking-wide">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                 {/* Contact */}
                 <div>
                    <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-6 border-b border-white/10 pb-2">Connect</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-zinc-500 mb-1">Email</span>
                            <a href={`mailto:${PERSONAL_INFO.email}`} className="text-xl hover:underline decoration-1 underline-offset-4">{PERSONAL_INFO.email}</a>
                        </div>
                        <div className="flex flex-col">
                             <span className="text-sm text-zinc-500 mb-1">Socials</span>
                             <div className="flex gap-6">
                                <a href={PERSONAL_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
                                <a href={PERSONAL_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="text-lg text-zinc-400 hover:text-white transition-colors">Instagram</a>
                                <a href={PERSONAL_INFO.social.issuu} target="_blank" rel="noopener noreferrer" className="text-lg text-zinc-400 hover:text-white transition-colors">Issuu</a>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </main>
  );
}

