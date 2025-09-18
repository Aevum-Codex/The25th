"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn, LogOut, Users, Home, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPANDED_HEIGHT = 96;
const SHRUNK_HEIGHT = 56;
const SHRINK_SCROLL = 120; // px scroll before shrink locks

export function Navbar() {
	const { data: session } = useSession();
	const [scrolled, setScrolled] = useState(false);
	const [stuck, setStuck] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		function onScroll() {
			const y = window.scrollY;
			setScrolled(y > 8);
			setStuck(y > SHRINK_SCROLL);
		}
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const authenticated = !!session;

	const height = stuck
		? SHRUNK_HEIGHT
		: scrolled
			? EXPANDED_HEIGHT - 20
			: EXPANDED_HEIGHT;

	return (
		<>
			<motion.header
				initial={false}
				animate={{
					height,
					backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
					backgroundColor: scrolled
						? "hsl(var(--background) / 0.8)"
						: "hsl(var(--background) / 0.5)",
				}}
				transition={{ type: "spring", stiffness: 180, damping: 24 }}
				className={cn(
					"fixed top-0 left-0 right-0 z-40 border-b border-border/50 flex items-center",
					"transition-colors",
					stuck && "shadow-lg"
				)}
			>
				<div className="mx-auto w-full max-w-6xl px-6 flex items-center justify-between gap-6">
					<div className="flex items-center gap-6 min-w-0">
						<Link
							href="/"
							className="font-bold text-xl tracking-tight flex items-center gap-2 group"
						>
							<span
								className="brand-outline-text group-hover:from-primary/80 group-hover:to-primary transition-colors"
								aria-label="The 25th"
							>
								The 25th
							</span>
						</Link>
						{/* Expanded nav links (hide when stuck) */}
						<AnimatePresence initial={false}>
							{!stuck && (
								<motion.nav
									key="expanded-links"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -8 }}
									className="flex items-center gap-2 text-sm"
								>
									<Link
										href="/people"
										className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
									>
										<Users className="size-4" /> People
									</Link>
								</motion.nav>
							)}
						</AnimatePresence>
					</div>
					<div className="flex items-center gap-3">
						{/* Expanded actions */}
						{!stuck && (
							<div className="hidden sm:flex items-center gap-2">
								<ModeToggle />
								{authenticated ? (
									<>
										<Link
											href="/me"
											className="hidden md:inline-flex"
										>
											<Button
												variant="ghost"
												size="sm"
												className="gap-1"
											>
												<User className="size-4" />{" "}
												Profile
											</Button>
										</Link>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												signOut({ callbackUrl: "/" })
											}
											className="gap-1"
										>
											<LogOut className="size-4" /> Logout
										</Button>
									</>
								) : (
									<Button
										variant="default"
										size="sm"
										onClick={() => signIn()}
										className="gap-1"
									>
										<LogIn className="size-4" /> Login
									</Button>
								)}
							</div>
						)}
						{/* Compact menu when stuck */}
						{stuck && (
							<DropdownMenu
								open={menuOpen}
								onOpenChange={setMenuOpen}
							>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label="Menu"
									>
										<Menu className="size-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="min-w-48"
								>
									<DropdownMenuItem asChild>
										<Link
											href="/"
											className="flex items-center gap-2"
										>
											<Home className="size-4" /> Home
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											href="/people"
											className="flex items-center gap-2"
										>
											<Users className="size-4" /> People
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<div className="px-2 py-1.5 flex items-center justify-between gap-3">
										<span className="text-xs font-medium tracking-wide text-muted-foreground">
											Theme
										</span>
										<ModeToggle />
									</div>
									<DropdownMenuSeparator />
									{authenticated ? (
										<>
											<DropdownMenuItem asChild>
												<Link
													href="/me"
													className="flex items-center gap-2"
												>
													<User className="size-4" />{" "}
													Profile
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault();
													signOut({
														callbackUrl: "/",
													});
												}}
												className="text-destructive"
											>
												<LogOut className="size-4" />{" "}
												Logout
											</DropdownMenuItem>
										</>
									) : (
										<DropdownMenuItem
											onSelect={(e) => {
												e.preventDefault();
												signIn();
											}}
											className="text-primary"
										>
											<LogIn className="size-4" /> Login
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						{/* Removed hidden ModeToggle; direct control embedded in dropdown */}
					</div>
				</div>
			</motion.header>
			{/* Spacer to avoid content jump */}
			<div style={{ height }} aria-hidden />
		</>
	);
}
