import { PERSONAL_INFO } from "@/lib/data";

export default function Footer() {
	return (
		<footer className="relative bg-black text-white border-t border-white/10 overflow-hidden">
			{/* Architectural Ruler / Scale marks */}
			<div className="absolute top-0 left-0 w-full h-4 opacity-30 pointer-events-none">
				<div
					className="w-full h-full"
					style={{
						backgroundImage: "linear-gradient(to right, white 1px, transparent 1px)",
						backgroundSize: "20px 100%",
					}}
				/>
				<div
					className="absolute top-0 left-0 w-full h-2"
					style={{
						backgroundImage: "linear-gradient(to right, white 1px, transparent 1px)",
						backgroundSize: "10px 100%",
					}}
				/>
			</div>

			<div className="py-20 px-4 md:px-12 max-w-screen-2xl mx-auto relative z-10">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
					<div className="space-y-4">
						<h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Let&#39;s Connect</h2>
						<p className="text-zinc-200 max-w-md font-mono text-sm">
							{"// Based in"} {PERSONAL_INFO.location}
							<br />
							{"// Open for opportunities and collaborations"}
						</p>
					</div>

					<div className="flex flex-col gap-6 text-right">
						<a
							href={`mailto:${PERSONAL_INFO.email}`}
							className="text-xl md:text-2xl text-white hover:text-zinc-300 transition-colors font-light"
						>
							{PERSONAL_INFO.email}
						</a>

						<div className="flex gap-8 justify-end">
							{Object.entries(PERSONAL_INFO.social).map(([key, url]) => (
								<a
									key={key}
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-zinc-200 hover:text-white transition-colors uppercase text-xs tracking-widest"
								>
									{key}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-end md:items-center text-sm text-white font-mono uppercase tracking-wider gap-4">
					<div className="flex flex-col gap-2">
						<span className="font-bold">
							© {new Date().getFullYear()} {PERSONAL_INFO.name}
						</span>
						<span title="Attribution-NonCommercial-ShareAlike">CC BY-NC-SA 4.0</span>
					</div>

					<div className="flex flex-col items-end gap-2 text-right">
						<span className="text-zinc-400">Architecture / Design / Visualization</span>
						<span className="flex items-center gap-2">
							Designed and Developed by{" "}
							<a
								href="https://aryank.space"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white font-bold hover:text-zinc-300 transition-colors underline underline-offset-4"
							>
								BLANK
							</a>
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
