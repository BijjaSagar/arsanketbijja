import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
	href?: string | null;
	compact?: boolean;
	priority?: boolean;
	className?: string;
	markClassName?: string;
	wordmarkClassName?: string;
	ariaLabel?: string;
};

export default function Logo({
	href = "/",
	compact = false,
	priority = false,
	className,
	markClassName,
	wordmarkClassName,
	ariaLabel = "Sanket Bijja, home",
}: LogoProps) {
	const inner = (
		<span className={cn("inline-flex items-center gap-3", className)}>
			<Image
				src="/logo-mark.png"
				alt=""
				width={256}
				height={256}
				className={cn("h-9 w-auto object-contain md:h-10", markClassName)}
				priority={priority}
			/>
			{compact ? null : (
				<Image
					src="/logo-wordmark.png"
					alt=""
					width={478}
					height={56}
					className={cn("hidden h-3.5 w-auto object-contain sm:block md:h-4", wordmarkClassName)}
				/>
			)}
		</span>
	);

	if (!href) return inner;

	return (
		<Link
			href={href}
			aria-label={ariaLabel}
			className="inline-flex"
		>
			{inner}
		</Link>
	);
}
