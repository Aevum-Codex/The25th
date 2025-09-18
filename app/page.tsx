"use client";

import Feed from "@/components/home/feed";
import Landing from "@/components/home/landing";
import { LoginForm } from "@/components/auth/login-form";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/loader";

export default function Home() {
	const { data: session, status } = useSession();
	const loading = status === "loading";

	return (
		<main className="space-y-6 p-4">
			{loading && <Loader text="Preparing your experience" />}
			{!loading && session && (
				<div id="feed-container">
					<Feed />
				</div>
			)}
			{!loading && !session && (
				<div className="space-y-8" id="landing-container">
					<Landing />
					<div>
						<h2 className="text-lg font-semibold mb-2">Sign In</h2>
						<LoginForm />
					</div>
				</div>
			)}
		</main>
	);
}
