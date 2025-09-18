"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface LoaderProps {
	text?: string;
	show?: boolean;
	fullscreen?: boolean;
}

export function Loader({
	text = "Loading",
	show = true,
	fullscreen = false,
}: LoaderProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		}).then(() => setReady(true));
	}, []);

	if (!show) return null;

	return (
		<div
			className={`relative overflow-hidden flex flex-col items-center justify-center gap-6 ${
				fullscreen ? "fixed inset-0 z-40" : "h-56 w-full"
			}`}
		>
			{ready && (
				<Particles
					id="loader-particles"
					className="absolute inset-0"
					options={{
						background: { color: { value: "transparent" } },
						fullScreen: { enable: false },
						particles: {
							number: { value: 45 },
							color: { value: ["#6366f1", "#06b6d4", "#f472b6"] },
							shape: { type: "circle" },
							opacity: { value: 0.5 },
							size: { value: { min: 2, max: 5 } },
							move: {
								enable: true,
								speed: 1.2,
								outModes: { default: "out" },
							},
							links: {
								enable: true,
								distance: 130,
								opacity: 0.25,
								color: "#6366f1",
								width: 1,
							},
						},
						interactivity: {
							events: {
								onHover: { enable: true, mode: "repulse" },
							},
							modes: { repulse: { distance: 120 } },
						},
					}}
				/>
			)}
			<AnimatePresence mode="wait">
				<motion.div
					key="logo"
					initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
					animate={{ scale: 1, opacity: 1, rotate: 0 }}
					exit={{ scale: 0.6, opacity: 0, rotate: 5 }}
					transition={{ type: "spring", stiffness: 180, damping: 18 }}
					className="relative z-10 flex flex-col items-center"
				>
					<motion.div
						className="w-20 h-20 rounded-full border-4 border-indigo-400/40 flex items-center justify-center backdrop-blur-sm bg-white/5 shadow-lg"
						animate={{ rotate: 360 }}
						transition={{
							repeat: Infinity,
							duration: 8,
							ease: "linear",
						}}
					>
						<motion.div
							className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-400 to-pink-400"
							animate={{ y: [0, -6, 0] }}
							transition={{
								repeat: Infinity,
								duration: 2.4,
								ease: "easeInOut",
							}}
						/>
					</motion.div>
					<motion.p
						className="mt-4 text-sm font-medium tracking-wide text-indigo-200"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 }}
					>
						{text}
						<motion.span
							className="inline-block w-4 text-center"
							animate={{ opacity: [0.2, 1, 0.2] }}
							transition={{ repeat: Infinity, duration: 1.4 }}
						>
							...
						</motion.span>
					</motion.p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
