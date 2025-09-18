export default function LoadingPeople() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16">
			<div className="h-8 w-72 animate-pulse rounded bg-amber-500/20" />
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="h-40 animate-pulse rounded-xl border bg-background/40"
					/>
				))}
			</div>
		</div>
	);
}
