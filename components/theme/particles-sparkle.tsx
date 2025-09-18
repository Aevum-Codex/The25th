"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface SparkleProps {
	burst: number; // changes to trigger a new burst
	dark: boolean;
}

// Lightweight custom particle burst (avoids loading full tsparticles until needed)
export function ParticlesSparkle({ burst, dark }: SparkleProps) {
	const controls = useAnimation();
	const lastBurst = useRef<number>(0);

	useEffect(() => {
		if (burst === 0 || burst === lastBurst.current) return;
		lastBurst.current = burst;
		controls.start("visible").then(() => controls.start("hidden"));
	}, [burst, controls]);

	const particles = Array.from({ length: 12 });
	const color = dark ? "#f8f9ff" : "#f59e0b";

	return (
		<div className="pointer-events-none absolute inset-0">
			{particles.map((_, i) => {
				const angle = (i / particles.length) * Math.PI * 2;
				const distance = 16 + (i % 3) * 6;
				return (
					<motion.span
						key={i}
						initial="hidden"
						animate={controls}
						variants={{
							hidden: { opacity: 0, scale: 0 },
							visible: {
								opacity: [0, 1, 0],
								scale: [0, 1, 0.2],
								x: Math.cos(angle) * distance,
								y: Math.sin(angle) * distance,
								transition: { duration: 0.9, ease: "easeOut" },
							},
						}}
						className="absolute left-1/2 top-1/2 size-1 rounded-full"
						style={{ background: color }}
					/>
				);
			})}
		</div>
	);
}
