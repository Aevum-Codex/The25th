import { DefaultSession } from "next-auth";

// Augment session and JWT to include our user fields

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username: string;
			user_type: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		username: string;
		user_type: string;
		profile?: unknown;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username: string;
		user_type: string;
	}
}
