"use client";
import { LeanUser } from "@/lib/data/users";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ParticlesSparkle } from "@/components/theme/particles-sparkle";

export default function PeopleSparkleCard({ user }: { user: LeanUser }) {
	const controls = useAnimation();
	const [burst, setBurst] = useState(0);
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
			onHoverStart={() => setBurst((b) => b + 1)}
			className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-background/80 to-background/40 p-4 backdrop-blur transition-colors hover:from-amber-500/10 hover:to-pink-500/10"
		>
			<ParticlesSparkle burst={burst} dark={false} />
			<div className="relative z-10 flex flex-col gap-2">
				<Link
					href={`/people/name/${user.username}`}
					className="text-sm font-semibold tracking-wide text-foreground/90"
				>
					{user.profile?.display_name || user.profile?.name}
				</Link>
				<p className="line-clamp-3 text-xs text-foreground/60">
					{user.profile?.bio || "No bio yet."}
				</p>
				<div className="mt-1 flex flex-wrap gap-1">
					{user.profile?.likes?.slice(0, 4).map((l) => (
						<span
							key={l}
							className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
						>
							{l}
						</span>
					))}
				</div>
			</div>
			<motion.span
				initial={false}
				animate={controls}
				className="absolute right-2 top-2 text-[10px] uppercase tracking-wider text-foreground/40"
			>
				{user.user_type}
			</motion.span>
		</motion.div>
	);
}
