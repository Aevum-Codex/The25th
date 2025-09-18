import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";
import PostSchema from "@/lib/schemas/Post.schema";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session) return new Response("Unauthorized", { status: 401 });
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);
	const items = await db
		.collection("posts")
		.find({})
		.sort({ created_at: -1 })
		.limit(50)
		.toArray();

	return Response.json(items);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return new Response("Unauthorized", { status: 401 });
	const body = await req.json();
	const parsed = PostSchema.safeParse(body);

	if (!parsed.success) {
		return new Response(JSON.stringify(parsed.error.format()), {
			status: 400,
		});
	}

	const data = parsed.data as z.infer<typeof PostSchema>;
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);

	// Convert author_id to ObjectId if your schema holds object ids as strings client-side

	function getAuthorId(data: any): ObjectId {
		return typeof data.author_id === "string"
			? new ObjectId(data.author_id)
			: data.author_id;
	}

	const authorId = getAuthorId(data);

	const doc: any = {
		...data,
		author_id: authorId,
		created_at: new Date(),
		updated_at: null,
		reactions: [],
	};

	const result = await db.collection("posts").insertOne(doc);
	return Response.json({ insertedId: result.insertedId }, { status: 201 });
}
