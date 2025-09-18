"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Image from "next/image";

interface CarouselProps {
	images: string[];
	autoPlay?: boolean;
	autoPlayInterval?: number;
	showDots?: boolean;
	showControls?: boolean;
	className?: string;
	imageClassName?: string;
	aspectRatio?: "square" | "video" | "wide" | string;
}

export function Carousel({
	images,
	autoPlay = true,
	autoPlayInterval = 5000,
	showDots = true,
	showControls = true,
	className,
	imageClassName,
	aspectRatio = "video",
}: CarouselProps) {
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [isPlaying, setIsPlaying] = React.useState(autoPlay);
	const [isHovered, setIsHovered] = React.useState(false);
	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

	const nextSlide = React.useCallback(() => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	}, [images.length]);

	const prevSlide = React.useCallback(() => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length
		);
	}, [images.length]);

	const goToSlide = React.useCallback((index: number) => {
		setCurrentIndex(index);
	}, []);

	const togglePlayPause = React.useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	// Auto-play functionality
	React.useEffect(() => {
		if (isPlaying && !isHovered && images.length > 1) {
			intervalRef.current = setInterval(nextSlide, autoPlayInterval);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isPlaying, isHovered, nextSlide, autoPlayInterval, images.length]);

	// Keyboard navigation
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				prevSlide();
			} else if (event.key === "ArrowRight") {
				nextSlide();
			} else if (event.key === " ") {
				event.preventDefault();
				togglePlayPause();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [nextSlide, prevSlide, togglePlayPause]);

	const aspectRatioClass = React.useMemo(() => {
		switch (aspectRatio) {
			case "square":
				return "aspect-square";
			case "video":
				return "aspect-video";
			case "wide":
				return "aspect-[21/9]";
			default:
				return aspectRatio;
		}
	}, [aspectRatio]);

	return (
		<div
			className={cn(
				"relative group overflow-hidden rounded-xl bg-muted",
				aspectRatioClass,
				className
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Main Image Container */}
			<div className="relative w-full h-full">
				<AnimatePresence initial={false}>
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, scale: 1.05 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
						transition={{
							duration: 0.8,
							ease: [0.4, 0, 0.2, 1],
							opacity: { duration: 0.6 },
						}}
						className="absolute inset-0"
					>
						{/* 16:9 Ratio*/}
						<Image
							src={images[currentIndex]}
							alt={`Slide ${currentIndex + 1}`}
							width={720}
							height={555}
							className={cn(
								"w-full h-full object-cover",
								imageClassName
							)}
							loading="lazy"
						/>
						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation Controls */}
			{showControls && images.length > 1 && (
				<>
					<Button
						variant="ghost"
						size="icon"
						className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0"
						onClick={prevSlide}
						aria-label="Previous slide"
					>
						<ChevronLeft className="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
						onClick={nextSlide}
						aria-label="Next slide"
					>
						<ChevronRight className="h-6 w-6" />
					</Button>

					{/* Play/Pause Button */}
					{autoPlay && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
							onClick={togglePlayPause}
							aria-label={
								isPlaying ? "Pause slideshow" : "Play slideshow"
							}
						>
							{isPlaying ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</Button>
					)}
				</>
			)}

			{/* Dot Indicators */}
			{showDots && images.length > 1 && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
					{images.map((_, index) => (
						<button
							key={index}
							className={cn(
								"relative w-3 h-3 rounded-full transition-all duration-300 hover:scale-110",
								index === currentIndex
									? "bg-white shadow-lg"
									: "bg-white/50 hover:bg-white/70"
							)}
							onClick={() => goToSlide(index)}
							aria-label={`Go to slide ${index + 1}`}
						>
							{/* Progress ring for current slide */}
							{index === currentIndex &&
								isPlaying &&
								!isHovered && (
									<motion.div
										className="absolute inset-0 rounded-full border-2 border-white/30"
										initial={{ pathLength: 0 }}
										animate={{ pathLength: 1 }}
										transition={{
											duration: autoPlayInterval / 1000,
											ease: "linear",
										}}
										style={{
											background:
												"conic-gradient(from 0deg, white 0%, white var(--progress, 0%), transparent var(--progress, 0%))",
										}}
									/>
								)}
						</button>
					))}
				</div>
			)}

			{/* Progress Bar */}
			{isPlaying && !isHovered && images.length > 1 && (
				<motion.div
					className="absolute bottom-0 left-0 h-1 bg-white/70"
					initial={{ width: "0%" }}
					animate={{ width: "100%" }}
					transition={{
						duration: autoPlayInterval / 1000,
						ease: "linear",
					}}
					key={currentIndex}
				/>
			)}

			{/* Slide Counter */}
			{images.length > 1 && (
				<div className="absolute top-4 left-4 bg-black/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{currentIndex + 1} / {images.length}
				</div>
			)}
		</div>
	);
}

export default Carousel;
