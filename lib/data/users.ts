import "server-only";
import clientPromise from "@/lib/mongo";
import UserSchema from "@/lib/schemas/User.schema";
import { z } from "zod";

// Shared projection to avoid leaking sensitive info
const baseProjection = {
	password: 0,
};

export type LeanUser = z.infer<typeof UserSchema> & { id?: string };

function normalize(raw: any): LeanUser {
	if (!raw) return raw;
	// Shallow clone
	const out: any = { ...raw };
	// Convert Mongo ObjectId to string id and remove original _id to avoid non-plain objects
	if (out._id) {
		try {
			out.id = out._id.toString();
		} catch {
			out.id = String(out._id);
		}
		delete out._id; // important for Next: remove non-serializable ObjectId
	}
	// Convert Date instances (if any) to ISO strings
	if (out.created_at instanceof Date)
		out.created_at = out.created_at.toISOString();
	if (out.updated_at instanceof Date)
		out.updated_at = out.updated_at.toISOString();
	// Defensive deep-ish scrub for profile sub-doc
	if (out.profile) {
		out.profile = { ...out.profile };
		if (out.profile.dob instanceof Date)
			out.profile.dob = out.profile.dob.toISOString();
	}
	return out;
}

export async function getUsers(filter: Partial<LeanUser> = {}) {
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);
	const query: any = {};
	if (filter.user_type) query.user_type = filter.user_type;
	const docs = await db
		.collection("users")
		.find(query, { projection: baseProjection })
		.sort({ "profile.name": 1 })
		.limit(500)
		.toArray();
	return docs.map((d) => JSON.parse(JSON.stringify(normalize(d))));
}

export async function getUserByUsername(username: string) {
	const client = await clientPromise;
	const db = client.db(process.env.DB_NAME);
	const doc = await db
		.collection("users")
		.findOne({ username }, { projection: baseProjection });
	return doc ? JSON.parse(JSON.stringify(normalize(doc))) : null;
}
