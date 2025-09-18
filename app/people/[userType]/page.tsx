import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getUsers } from "@/lib/data/users";
import PeopleGrid from "@/components/people/people-grid";

export const dynamic = "force-dynamic";

const valid = ["student", "teacher", "other"] as const;

export default async function PeopleByType({
	params,
}: {
	params: { userType: string };
}) {
	const { userType } = params;
	if (!valid.includes(userType as any)) notFound();
	const session = await getServerSession(authOptions);
	if (!session) redirect("/");
	const users = await getUsers({ user_type: userType.toUpperCase() as any });
	return (
		<main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 pt-8 lg:px-8">
			<PeopleGrid users={users} title={`${userType} roster`} />
		</main>
	);
}
