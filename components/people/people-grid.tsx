import { LeanUser } from "@/lib/data/users";
import PeopleSparkleCard from "@/components/people/people-sparkle-card";
import { Suspense } from "react";

export default function PeopleGrid({
	users,
	title,
}: {
	users: LeanUser[];
	title: string;
}) {
	return (
		<section className="relative">
			<h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground/90">
				{title}
			</h2>
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<Suspense fallback={<div>Loading...</div>}>
					{users.map((u) => (
						<PeopleSparkleCard key={u.id || u.username} user={u} />
					))}
				</Suspense>
			</div>
		</section>
	);
}
