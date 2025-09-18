import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public paths allowed without auth
const publicPaths: RegExp[] = [
	/^\/$/, // landing page
	/^\/api\/auth\//, // next-auth endpoints
	/^\/favicon.ico$/,
	/^\/public\//,
	/^\/.*\.(png|jpg|jpeg|svg|webp|ico)$/,
];

function isPublic(pathname: string) {
	return publicPaths.some((r) => r.test(pathname));
}

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		if (isPublic(pathname)) {
			return NextResponse.next();
		}
		// If we reached here user is authenticated by withAuth
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const pathname = req.nextUrl.pathname;
				if (isPublic(pathname)) return true;
				return !!token; // require auth otherwise
			},
		},
	}
);

export const config = {
	matcher: ["/((?!_next/static|_next/image|.*\\.json).*)"],
};
