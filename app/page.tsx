"use client";

import Feed from "@/components/home/feed";
import Landing from "@/components/home/landing";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
	// Dummy auth state for demonstration purposes
	const [authenticated, setAuthenticated] = useState(false);

	return (
		<main>
			<h1 className="text-2xl font-bold">The 25th <Button variant={authenticated ? "default" : "outline"} id="dummy-auth-toggle" onClick={() => setAuthenticated(!authenticated)}>{authenticated ? "Logout" : "Login"}</Button></h1>
			{authenticated ? (
				<div id="feed-container">
					<Feed />
				</div>
			) : (
				<div id="landing-container w-full">
					<Landing />
				</div>
			)}
		</main>
	);
}
