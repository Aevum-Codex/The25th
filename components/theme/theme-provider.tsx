"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ThemeProviderProps {
	children: React.ReactNode;
	enableSystem?: boolean; // allow system preference
	attribute?: "class" | "data-theme"; // attribute strategy
	defaultTheme?: string; // light | dark | system
	storageKey?: string; // localStorage key
}

export function ThemeProvider({
	children,
	enableSystem = true,
	attribute = "class",
	defaultTheme = "system",
	storageKey = "theme",
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute={attribute}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
			storageKey={storageKey}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
