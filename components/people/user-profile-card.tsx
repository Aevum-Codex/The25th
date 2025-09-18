"use client";
import { LeanUser } from "@/lib/data/users";
import { motion } from "framer-motion";
import { ParticlesSparkle } from "@/components/theme/particles-sparkle";
import { useState } from "react";

export default function UserProfileCard({
	user,
	isSelf,
}: {
	user: LeanUser;
	isSelf: boolean;
}) {
	const [burst, setBurst] = useState(1);
	return (
		<motion.article
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 120, damping: 18 }}
			className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background/70 to-background/40 p-8 shadow-md backdrop-blur-xl"
			onMouseEnter={() => setBurst((b) => b + 1)}
		>
			<ParticlesSparkle burst={burst} dark={false} />
			<header className="relative z-10 mb-4 flex flex-col gap-2">
				<h1 className="text-balance bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
					{user.profile?.display_name || user.profile?.name}
				</h1>
				<p className="text-foreground/60 text-sm">
					@{user.username} · {user.user_type}
				</p>
			</header>
			<div className="relative z-10 grid gap-8 md:grid-cols-3">
				<section className="md:col-span-2 space-y-6">
					<div>
						<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/70">
							Bio
						</h2>
						<p className="prose prose-sm max-w-none text-foreground/80 dark:prose-invert">
							{user.profile?.bio || "No bio added yet."}
						</p>
					</div>
					<div>
						<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/70">
							Likes
						</h2>
						<div className="flex flex-wrap gap-2">
							{(user.profile?.likes || [])
								.slice(0, 20)
								.map((l) => (
									<span
										key={l}
										className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
									>
										{l}
									</span>
								))}
						</div>
					</div>
					<div>
						<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/70">
							Dislikes
						</h2>
						<div className="flex flex-wrap gap-2">
							{(user.profile?.dislikes || [])
								.slice(0, 20)
								.map((d) => (
									<span
										key={d}
										className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-700 dark:text-rose-300"
									>
										{d}
									</span>
								))}
						</div>
					</div>
				</section>
				<aside className="space-y-8">
					<div>
						<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/70">
							Info
						</h2>
						<ul className="text-xs leading-relaxed text-foreground/70">
							{user.profile?.email && (
								<li>Email: {user.profile.email}</li>
							)}
							{user.profile?.website && (
								<li>
									Website:{" "}
									<a
										href={user.profile.website}
										target="_blank"
										rel="noopener noreferrer"
										className="underline decoration-dotted underline-offset-2 hover:text-foreground"
									>
										{user.profile.website.replace(
											/^https?:\/\//,
											""
										)}
									</a>
								</li>
							)}
							<li>
								Joined: {user.created_at?.slice(0, 10) || "—"}
							</li>
						</ul>
					</div>
					{isSelf && (
						<div className="text-xs text-foreground/50">
							This is how others see your public profile.
						</div>
					)}
				</aside>
			</div>
		</motion.article>
	);
}
