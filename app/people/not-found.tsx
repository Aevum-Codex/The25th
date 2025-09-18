import Link from "next/link";

export default function PeopleNotFound() {
	return (
		<div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
			<h1 className="text-4xl font-extrabold tracking-tight">
				Not Found
			</h1>
			<p className="text-muted-foreground text-sm">
				That person or group doesn&apos;t exist (yet). Try heading back
				to the people roster.
			</p>
			<Link
				href="/people"
				className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-amber-500/10"
			>
				Back to people
			</Link>
		</div>
	);
}
