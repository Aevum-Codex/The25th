import "server-only"; // ensure this module never bundles into the client
import bcrypt from "bcryptjs";
import NextAuth, { type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { CredentialsLoginSchema } from "@/lib/schemas/Auth.schema";
import clientPromise from "@/lib/mongo"; // direct DB access strictly on server (authorize + callbacks)
import UserSchema from "@/lib/schemas/User.schema";

// Work factor: 12 is a good balance; can tune via BCRYPT_SALT_ROUNDS env.
const DEFAULT_ROUNDS = 12;
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || DEFAULT_ROUNDS;

export async function hashPassword(plain: string): Promise<string> {
	const saltRounds = Number(BCRYPT_SALT_ROUNDS);
	return await bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(
	plain: string,
	hash: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(plain, hash);
	} catch {
		return false;
	}
}

export function sanitizeUser(dbUser: any) {
	if (!dbUser) return null;
	const clone = { ...dbUser };
	delete clone.password;
	return {
		id: dbUser._id?.toString?.() || dbUser._id,
		...clone,
	};
}

// Normalize a raw Mongo user document so it matches the Zod schema expectations (string dates, string _id)
function normalizeUserForSchema(user: any) {
	if (!user) return user;
	const out: any = { ...user };
	if (out._id && typeof out._id !== "string") out._id = out._id.toString();
	if (out.created_at instanceof Date)
		out.created_at = out.created_at.toISOString();
	if (out.updated_at instanceof Date)
		out.updated_at = out.updated_at.toISOString();
	if (out.profile) {
		out.profile = { ...out.profile };
		if (out.profile.dob instanceof Date)
			out.profile.dob = out.profile.dob.toISOString();
	}
	return out;
}

// IMPORTANT: This object is server-only. Do not import it inside a "use client" file.
// If client code needs session/user info, call an API route (e.g. /api/me) or use next-auth hooks.
export const authOptions: AuthOptions = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: false, // we enforce manual linking only
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(raw) {
				const parsed = CredentialsLoginSchema.safeParse(raw);
				if (!parsed.success) return null;
				const { username, password } = parsed.data;
				const mongoClient = await clientPromise;
				const db = mongoClient.db(process.env.DB_NAME);
				const user = await db.collection("users").findOne({ username });
				if (!user) return null;
				if (!user.is_active) return null;
				const valid = await verifyPassword(password, user.password);
				if (!valid) return null;
				// runtime validation (optional)
				const normalized = normalizeUserForSchema(user);
				const zParsed = UserSchema.safeParse(normalized);
				if (!zParsed.success) {
					console.warn(
						"User schema validation failed",
						zParsed.error.flatten()
					);
					return null;
				}
				return sanitizeUser(normalized) as any;
			},
		}),
	],
	session: { strategy: "jwt" },
	pages: {},
	callbacks: {
		async signIn({ user, account, profile }) {
			// For Google sign-in, ensure email exists in a pre-created user doc.
			if (account?.provider === "google") {
				const email = profile?.email;
				if (!email) return false;
				const client = await clientPromise;
				const db = client.db(process.env.DB_NAME);
				const existing = await db
					.collection("users")
					.findOne({ "profile.email": email });
				if (!existing) return false; // Not linked
				if (!existing.is_active) return false;
				user.id = existing._id.toString();
				user.username = existing.username;
				user.user_type = existing.user_type;
				return true;
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id;
				token.username = (user as any).username;
				token.user_type = (user as any).user_type;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.username = token.username as string;
				session.user.user_type = token.user_type as string;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

export const authHandler = NextAuth(authOptions);
