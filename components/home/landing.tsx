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
	
	return (
		<div
			data-slot="landing"
			className={cn(
				"relative text-foreground h-min-[1vh] flex flex-col gap-4 border border-white/20 p-2 md:p-6 lg:p-12 shadow-2xl overflow-hidden",
				className
			)}
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat"
			}}
		>
			{/* Particles Background */}
			<Particles
				id="tsparticles"
				className="absolute inset-0 z-0"
				options={{
					background: {
						color: {
							value: "transparent",
						},
					},
					fpsLimit: 60,
					interactivity: {
						events: {
							onClick: {
								enable: true,
								mode: "push",
							},
							onHover: {
								enable: true,
								mode: "repulse",
							},
							resize: {
								enable: true,
							},
						},
						modes: {
							push: {
								quantity: 2,
							},
							repulse: {
								distance: 80,
								duration: 0.4,
							},
						},
					},
					particles: {
						color: {
							value: ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
						},
						links: {
							color: "#ffffff",
							distance: 120,
							enable: true,
							opacity: 0.1,
							width: 1,
						},
						move: {
							direction: "none",
							enable: true,
							outModes: {
								default: "bounce",
							},
							random: false,
							speed: 0.8,
							straight: false,
						},
						number: {
							density: {
								enable: true,
							},
							value: 25,
						},
						opacity: {
							value: 0.3,
							animation: {
								enable: true,
								speed: 0.5,
								sync: false,
							},
						},
						shape: {
							type: "circle",
						},
						size: {
							value: { min: 1, max: 3 },
							animation: {
								enable: true,
								speed: 1,
								sync: false,
							},
						},
					},
					detectRetina: true,
				}}
			/>

			{/* Main blur overlay covering entire component */}
			<div 
				className="absolute inset-0 rounded-xl"
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
					`
				}}
			/>
			
			{/* Glass frame for carousel */}
			<div className="relative p-2 md:p-4 lg:p-6 z-10">
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
			<div className="relative p-2 md:p-4 lg:p-6 pb-2 z-10">
				{/* Clear viewing window for text */}
				<div id="splash" className="relative text-center bg-background/98 rounded-xl p-2 md:p-4 lg:p-6 ring-1 ring-white/40 shadow-2xl backdrop-blur-none">
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
							Join us as we take a stroll down memory lane.
							Each image tells a story of our incredible journey through time.
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
	)
}