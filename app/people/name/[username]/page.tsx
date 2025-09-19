import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/users";
import ProfileCard from "@/components/people/profile-card";

export const dynamic = "force-dynamic";

export default async function UserProfile({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const session = await getServerSession(authOptions);
	if (!session) redirect("/");
	const user = await getUserByUsername(username);
	if (!user) notFound();
	return (
		<main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-24 pt-8 lg:px-8">
			<ProfileCard
				user={user}
				isSelf={session.user.username === user.username}
			/>
		</main>
	);
}
