import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { cookies } from "next/headers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The 25th",
	description: "A journey through time",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// SSR theme handling: read persisted theme cookie (set on client) so server markup matches client.
	// next/headers cookies() in Next 15 returns a Plain object directly (or promise in edge); we safely await for compatibility.
	const jar = await cookies();
	const themeCookie = jar.get("theme")?.value;
	const initialTheme =
		themeCookie === "dark"
			? "dark"
			: themeCookie === "light"
				? "light"
				: undefined;
	return (
		<html
			lang="en"
			className={initialTheme}
			suppressHydrationWarning
			style={initialTheme ? { colorScheme: initialTheme } : undefined}
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
			>
				<ThemeProvider>
					<AuthSessionProvider>
						<Navbar />
						{children}
					</AuthSessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
