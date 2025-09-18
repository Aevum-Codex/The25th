import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import CommentSchema from "@/lib/schemas/Comment.schema";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  let _id: ObjectId;
  try {
    _id = new ObjectId(postId);
  } catch {
    return new Response("Invalid post id", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const items = await db
    .collection("comments")
    .find({ post_id: _id })
    .sort({ created_at: -1 })
    .limit(100)
    .toArray();

  return Response.json(items);
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const body = await req.json();

  // Force post_id from path param
  body.post_id = params.postId;

  const parsed = CommentSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.format()), { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const doc = {
    ...parsed.data,
    post_id: new ObjectId(parsed.data.target_id as unknown as string),
    author_id: new ObjectId(parsed.data.author_id as unknown as string),
    created_at: new Date(),
    reactions: [],
  };

  const result = await db.collection("comments").insertOne(doc);
  return Response.json({ insertedId: result.insertedId }, { status: 201 });
}
