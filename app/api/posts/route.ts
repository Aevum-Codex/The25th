import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { z } from "zod";
import PostSchema from "@/lib/schemas/Post.schema";

export async function GET() {
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
	const body = await req.json();
	const parsed = PostSchema.safeParse(body);

	if (!parsed.success) {
		return new Response(JSON.stringify(parsed.error.format()), { status: 400 });
	}

	const data = parsed.data as z.infer<typeof PostSchema>;
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);

	// Convert author_id to ObjectId if your schema holds object ids as strings client-side
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const authorId = typeof (data as any).author_id === "string" ? new ObjectId((data as any).author_id) : (data as any).author_id;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
