# Install NextAuth

`npm install next-auth`

# Create a Auth API route

`/pages/api/auth/[...nextauth]/route.ts`

# write logic on `[...nextauth]/route.ts` file

# .env.local file
```
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Adding OAuth to external [github/google]

```
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
```

`[...nextauth]/route.ts`

```
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// ... your other imports

export default NextAuth({
  providers: [
    CredentialsProvider({
      // ... your existing Credentials config
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // ... your session strategy, pages, secret, callbacks
});
```

## .env.local

```
+
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```