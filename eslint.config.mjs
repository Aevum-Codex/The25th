import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends(
		"next/core-web-vitals",
		"next/typescript",
		"plugin:prettier/recommended"
	),
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
	{
		rules: {
			"prettier/prettier": "error", // Use Prettier for formatting
			"no-mixed-spaces-and-tabs": "error", // Prevent mixing spaces and tabs
			quotes: ["error", "double"], // Enforce double quotes for strings
			"jsx-quotes": ["error", "prefer-double"], // Enforce double quotes in JSX
			"@typescript-eslint/no-explicit-any": "off", // Allow usage of 'any' type in TypeScript
		},
	},
];

export default eslintConfig;
