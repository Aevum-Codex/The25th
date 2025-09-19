"use client";
import { LeanUser } from "@/lib/data/users";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PeopleSparkleCard({ user }: { user: LeanUser }) {
	// Generate stable values based on username to avoid hydration mismatches
	const usernameHash = user.username
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);

	// Generate a stable background color based on username for avatar placeholder
	const avatarBg = `hsl(${usernameHash % 360}, 45%, 75%)`;

	// Generate stable animation values based on username hash
	const scaleFactor = (usernameHash % 400) / 100 - 2; // Range: -1 to 1
	const stableRotation = (usernameHash % 100) / 25 - 2; // Range: -2 to 2
	const stableDuration = 2 + (usernameHash % 50) / 50; // Range: 3 to 5
	const stableDelay = (usernameHash % 40) / 20; // Range: 0 to 2

	const floatingAnimation = {
		y: [0, -4 * scaleFactor, 0],
		x: [0, -4 * scaleFactor, 0],
		rotate: [-0.5 * scaleFactor, 0.5, -0.5 * scaleFactor],
		transition: {
			duration: stableDuration,
			repeat: Infinity,
			ease: "easeInOut" as const,
			delay: stableDelay,
		},
	};

	return (
		<Link href={`/people/name/${user.username}`} className="block">
			<motion.div
				initial={{ opacity: 0, y: 12, rotate: stableRotation }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				animate={floatingAnimation}
				whileHover={{
					scale: 1.05,
					rotate: 0,
					y: -8,
					transition: { duration: 0.2 },
				}}
				whileTap={{ scale: 0.95 }}
				className="group relative mx-auto w-full max-w-[200px] cursor-pointer"
			>
				{/* Polaroid card */}
				<div className="relative overflow-hidden rounded-lg border bg-card p-3 shadow-lg transition-all duration-300 group-hover:border-border group-hover:shadow-xl">
					{/* Photo section */}
					<div className="relative mb-3 aspect-square overflow-hidden rounded border border-border/30 bg-gradient-to-br from-muted/50 to-muted">
						{user.profile?.avatar?.url ? (
							<Image
								src={user.profile.avatar.url}
								alt={
									user.profile?.display_name ||
									user.profile?.name ||
									user.username
								}
								fill
								className="object-cover"
							/>
						) : (
							<div
								className="flex h-full w-full items-center justify-center text-2xl font-bold text-white shadow-inner"
								style={{ backgroundColor: avatarBg }}
							>
								{(user.profile?.display_name ||
									user.profile?.name ||
									user.username)?.[0]?.toUpperCase()}
							</div>
						)}

						{/* User type badge */}
						<div className="absolute right-1 top-1">
							<span className="rounded border border-border/20 bg-primary px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
								{user.user_type}
							</span>
						</div>
					</div>

					{/* Polaroid caption area */}
					<div className="space-y-2">
						<h3 className="text-center text-sm font-semibold text-card-foreground">
							{user.profile?.display_name ||
								user.profile?.name ||
								user.username}
						</h3>

						{user.profile?.bio && (
							<p className="line-clamp-2 text-center text-xs text-muted-foreground">
								{user.profile.bio}
							</p>
						)}

						{/* Likes as small dots */}
						{user.profile?.likes &&
							user.profile.likes.length > 0 && (
								<div className="flex justify-center gap-1">
									{user.profile.likes
										.slice(0, 3)
										.map((like) => (
											<div
												key={like}
												className="h-1.5 w-1.5 rounded-full bg-amber-400"
												title={like}
											/>
										))}
									{user.profile.likes.length > 3 && (
										<div
											className="h-1.5 w-1.5 rounded-full bg-gray-400"
											title={`+${user.profile.likes.length - 3} more`}
										/>
									)}
								</div>
							)}
					</div>
				</div>

				{/* Subtle shadow beneath for floating effect */}
				<div className="absolute -bottom-2 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-black/10 blur-sm transition-all duration-300 group-hover:w-20 group-hover:bg-black/20" />
			</motion.div>
		</Link>
	);
}
