import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/carousel";
import Particles from "@tsparticles/react";

export default function Landing({ className }: React.ComponentProps<"div">) {
	const imageGenerationAPI = "https://picsum.photos/800/600"; // Higher resolution for better quality
	const imageCount = 6; // Number of images to display in the carousel
	const imageLinks = [];
	const bgImage = `https://picsum.photos/1920/1080?blur&random=${Math.floor(Math.random() * 1000)}`; // Random blurred background image
	for (let i = 0; i < imageCount; i++) {
		imageLinks.push(`${imageGenerationAPI}?random=${i}&sig=${i}`);
	}

	// Neon glow particle configuration (distinct from loader)
	const particlesOptions = {
		background: { color: { value: "transparent" } },
		fpsLimit: 60,
		interactivity: {
			events: {
				onHover: { enable: true, mode: "bubble" },
				onClick: { enable: true, mode: "push" },
				resize: { enable: true },
			},
			modes: {
				bubble: {
					distance: 140,
					duration: 2,
					opacity: 0.95,
					size: 8,
				},
				push: { quantity: 3 },
			},
		},
		particles: {
			number: { value: 55, density: { enable: true } },
			color: {
				value: [
					"#60a5fa",
					"#818cf8",
					"#c084fc",
					"#f472b6",
					"#fb7185",
					"#fbbf24",
				] as string[],
			},
			shape: { type: "circle" },
			opacity: {
				value: 0.55,
				animation: { enable: true, speed: 0.6, sync: false },
			},
			size: {
				value: { min: 2, max: 6 },
				animation: { enable: true, speed: 2, sync: false },
			},
			links: { enable: false },
			move: {
				enable: true,
				speed: 0.9,
				// direction omitted to satisfy type narrowing (default random/none)
				random: true,
				straight: false,
				// outModes left default for type compatibility
			},
		},
		detectRetina: true,
	};

	return (
		<div
			data-slot="landing"
			className={cn(
				"relative text-foreground h-min-[1vh] flex flex-col gap-4 border border-white/20 p-2 md:p-6 lg:p-12 shadow-2xl overflow-hidden rounded-xl",
				className
			)}
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			{/* Particles Background */}
			<Particles
				id="tsparticles"
				className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-80"
				style={{ filter: "blur(1.2px) brightness(1.3) saturate(1.5)" }}
				options={particlesOptions}
			/>

			{/* Main blur overlay covering entire component */}
			<div
				className="absolute inset-0 rounded-xl z-5"
				style={{
					backdropFilter: "blur(24px) saturate(150%)",
					background: `
						linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%),
						radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 60%),
						radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 60%),
						rgba(0,0,0,0.1)
					`,
					boxShadow: `
						0 8px 32px rgba(0,0,0,0.15),
						inset 0 1px 0 rgba(255,255,255,0.25),
						inset 0 -1px 0 rgba(255,255,255,0.15)
					`,
				}}
			/>

			{/* Glass frame for carousel */}
			<div className="relative p-2 md:p-4 lg:p-6 z-20">
				{/* Clear viewing window for carousel */}
				<div className="relative bg-background/98 rounded-xl p-2 md:p-4 lg:p-6 ring-1 ring-white/40 shadow-2xl backdrop-blur-none">
					{/* Inner shadow for depth */}
					<div className="absolute inset-0 rounded-xl shadow-inner bg-gradient-to-br from-transparent via-transparent to-black/5" />
					<Carousel
						images={imageLinks}
						autoPlay={true}
						autoPlayInterval={4000}
						showDots={true}
						showControls={true}
						aspectRatio="video"
						className="relative w-full shadow-xl ring-1 ring-black/10 rounded-lg overflow-hidden z-10"
					/>
				</div>
			</div>

			{/* Glass frame for text */}
			<div className="relative p-2 md:p-4 lg:p-6 pb-2 z-20">
				{/* Clear viewing window for text */}
				<div
					id="splash"
					className="relative text-center bg-background/98 rounded-xl p-2 md:p-4 lg:p-6 ring-1 ring-white/40 shadow-2xl backdrop-blur-none"
				>
					{/* Inner shadow for depth */}
					<div className="absolute inset-0 rounded-xl shadow-inner bg-gradient-to-br from-transparent via-transparent to-black/5" />
					<div className="relative z-10">
						<div className="flex items-center justify-center gap-3 mb-6">
							<div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
							<span className="text-sm font-medium text-primary tracking-[0.3em] uppercase">
								WE ARE
							</span>
							<div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
						</div>

						<h1 className="text-6xl font-black mb-3 tracking-tight">
							<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
								The
							</span>
							<span className="text-8xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent ml-3">
								25th
							</span>
						</h1>

						<h2 className="text-2xl font-bold mb-6 text-muted-foreground/80 tracking-wide">
							Put Your Best Foot{" "}
							<span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
								Forward
							</span>
						</h2>

						<p className="text-lg text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
							Join us as we take a stroll down memory lane. Each
							image tells a story of our incredible journey
							through time.
						</p>

						<div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground/60">
							<div className="w-2 h-2 rounded-full bg-primary/60"></div>
							<span className="tracking-wider">EST</span>
							<div className="w-2 h-2 rounded-full bg-primary/60"></div>
							<span className="tracking-wider">2004</span>
							<div className="w-2 h-2 rounded-full bg-primary/60"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
