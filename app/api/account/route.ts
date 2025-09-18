import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongo";
import { UpdateCredentialsSchema } from "@/lib/schemas/Auth.schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
	const session = await getServerSession();
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}
	const body = await req.json();
	const parsed = UpdateCredentialsSchema.safeParse(body);
	if (!parsed.success) {
		return new Response(JSON.stringify(parsed.error.format()), {
			status: 400,
		});
	}
	const { current_password, new_password, new_email } = parsed.data;
	if (!new_password && !new_email) {
		return new Response("Nothing to update", { status: 400 });
	}
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);
	const user = await db
		.collection("users")
		.findOne({ _id: new ObjectId(session.user.id) });
	if (!user) return new Response("Not found", { status: 404 });
	const passwordOk = await verifyPassword(current_password, user.password);
	if (!passwordOk)
		return new Response("Invalid credentials", { status: 403 });
	const update: Record<string, unknown> = { updated_at: new Date() };
	if (new_password) update["password"] = await hashPassword(new_password);
	if (new_email) update["profile.email"] = new_email;
	await db.collection("users").updateOne({ _id: user._id }, { $set: update });
	return Response.json({ success: true });
}
