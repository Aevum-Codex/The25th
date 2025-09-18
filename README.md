This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication

This project uses `next-auth` with two providers:

1. Google OAuth (only for emails that already exist on a manually created user)
2. Custom Username + Password (credentials provider)

### Flow

- User documents are created manually (e.g. via a script or admin interface) and include `username`, a `password` hash, and optionally `profile.email`.
- Google sign-in is allowed only if the Google account email matches `profile.email` of an existing active user.
- Credentials sign-in verifies the bcrypt hash.
- Sessions use the JWT strategy; session user object is enriched with `id`, `username`, and `user_type`.

### Updating Email / Password

Endpoint: `PATCH /api/account/credentials`

Body (any of `new_password` or `new_email` must be provided):

```json
{
	"current_password": "oldPass123!",
	"new_password": "NewPass456!",
	"new_email": "new@example.com"
}
```

Validation is performed with Zod. The user must be authenticated and the current password must verify. Passwords are hashed with bcrypt (default cost 12, override via `BCRYPT_SALT_ROUNDS`).

### Environment Variables

Add the following to your `.env.local` (example values shown):

```
MONGO_URI=mongodb+srv://user:pass@cluster/db
DB_NAME=the25th
NEXTAUTH_SECRET=your-long-random-string
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
BCRYPT_SALT_ROUNDS=12
```

Generate a secure `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 48`).

### Creating Users Manually

You can insert a user via a simple Node.js script or Mongo shell. Ensure you hash the password with bcrypt using the same cost factor.

Example (Node REPL):

```js
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
async function run(){
	const client = await new MongoClient(process.env.MONGO_URI).connect();
	const db = client.db(process.env.DB_NAME);
	const password = await bcrypt.hash('Passw0rd!', 12);
	await db.collection('users').insertOne({
		username: 'jdoe',
		password,
		user_type: 'STUDENT',
		is_active: true,
		profile: { name: 'John Doe', display_name: 'John', email: 'john@example.com' },
		created_at: new Date(),
		updated_at: null,
	});
	console.log('User inserted');
	await client.close();
}
run();
```

After creation, the user can sign in either via credentials (username/password) or Google (if the Google account email matches `profile.email`).
