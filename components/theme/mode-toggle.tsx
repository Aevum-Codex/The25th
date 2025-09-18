"use client";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

// Lazy load particles only after first interaction to keep TTI fast
const Particles = dynamic(
	() => import("./particles-sparkle").then((m) => m.ParticlesSparkle),
	{ ssr: false, loading: () => null }
);

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [burst, setBurst] = useState(0);
	const isDark = theme === "dark";

	useEffect(() => setMounted(true), []);

	const toggle = useCallback(() => {
		const next = isDark ? "light" : "dark";
		setTheme(next);
		try {
			// Persist also to cookie for SSR on subsequent requests
			document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
		} catch {}
		setBurst((b) => b + 1); // trigger particle burst
	}, [isDark, setTheme]);

	if (!mounted)
		return (
			<Button
				id="mode-toggle"
				size="icon"
				variant="ghost"
				aria-label="Toggle theme"
				className="relative"
			>
				<Sun className="size-5" />
			</Button>
		);

	return (
		<div className="relative">
			<Button
				id="mode-toggle"
				onClick={toggle}
				size="icon"
				variant="ghost"
				aria-label="Toggle theme"
				className="relative overflow-hidden"
			>
				<AnimatePresence mode="wait" initial={false}>
					{isDark ? (
						<motion.span
							key="moon"
							initial={{ y: -16, opacity: 0, rotate: -45 }}
							animate={{ y: 0, opacity: 1, rotate: 0 }}
							exit={{ y: 16, opacity: 0, rotate: 45 }}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 20,
							}}
							className="absolute inset-0 flex items-center justify-center"
						>
							<Moon className="size-5" />
						</motion.span>
					) : (
						<motion.span
							key="sun"
							initial={{ y: 16, opacity: 0, rotate: 45 }}
							animate={{ y: 0, opacity: 1, rotate: 0 }}
							exit={{ y: -16, opacity: 0, rotate: -45 }}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 20,
							}}
							className="absolute inset-0 flex items-center justify-center text-amber-500"
						>
							<Sun className="size-5" />
						</motion.span>
					)}
				</AnimatePresence>
			</Button>
			<Particles burst={burst} dark={isDark} />
		</div>
	);
}
