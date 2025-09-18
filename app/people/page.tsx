import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function People() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/");
	}
	return (
		<main className="p-4">People Page (Hello {session.user.username})</main>
	);
}
