import clientPromise from "@/lib/mongo";

export default async function Home() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const posts = await db.collection("posts").find({}).sort({ created_at: -1 }).limit(20).toArray();

  interface BaseObject {
    _id: { toString: () => string };
    created_at: string;
    content: string;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Slambook</h1>
      <form action="/api/posts" method="post" className="space-y-2">
        <input name="author_id" placeholder="author_id (ObjectId string)" className="border p-2 block w-full" />
        <textarea name="content" placeholder="Say hi..." className="border p-2 block w-full" />
        <button className="border px-4 py-2">Create post</button>
      </form>

      <ul className="space-y-3">
        {posts.map((p: any ) => (
          <li key={p._id} className="border p-3 rounded">
            <div className="text-sm opacity-70">{new Date(p.created_at).toLocaleString()}</div>
            <div className="font-medium">{p.content}</div>
            <div className="text-xs break-all opacity-60">_id: {p._id.toString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
