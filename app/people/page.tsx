import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/data/users";
import PeopleGrid from "@/components/people/people-grid";
import Link from "next/link";

export const dynamic = "force-dynamic"; // always show freshest roster

export default async function People() {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/");
	const users = await getUsers();
	return (
		<main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 pt-8 lg:px-8">
			<header className="relative z-10 flex flex-col gap-3">
				<h1 className="text-balance bg-gradient-to-r from-amber-500 via-pink-500 to-violet-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-5xl">
					The 25th Slambook
				</h1>
				<p className="text-muted-foreground max-w-prose text-sm md:text-base">
					Flip through memories & vibes. Browse everyone below or jump
					straight into a group.
				</p>
				<nav className="flex flex-wrap gap-2 pt-2">
					{["student", "teacher", "other"].map((t) => (
						<Link
							key={t}
							href={`/people/name/${t}`}
							className="rounded-full border border-border/60 bg-gradient-to-r from-background to-background/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-foreground/80 transition hover:from-amber-500/10 hover:to-pink-500/10 hover:text-foreground"
						>
							{t}
						</Link>
					))}
				</nav>
			</header>
			<PeopleGrid users={users} title="All People" />
		</main>
	);
}
