import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// import { compare } from "bcrypt";
import { User, UserRole } from "@/types/userTypes";
import axios from "axios";
const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try{
            const res = await axios.post(`${baseURL}/api/auth/login`, {
              email: credentials.email,
              password: credentials.password,
              mode: "Credentials",
            });
          if (res.status === 200) {
            if(res.data.message === "login successful"){
              const user = res.data.UserData as User;
              return user;
            }
            else{
              throw new Error(res.data.message || "Invalid credentials");
            }
          }
          return null;
        }
        catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed. Please check your credentials.");
        }
      },
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
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error="error_code"
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user,  }) {
      // For credentials
      if (user) {
        token.user = user as User;
        return token;
      }

      return token;
    },

  async session({ session, token }) {

    // Ensure we only run the OAuth fetch if needed
    if (!token.user?.access && token.email) {
      try {
        const res = await axios.post(`${baseURL}/api/auth/login`, {
          email: token.email,
          mode: "OAuth",
        });

        // console.log("OAuth login response:", res.data);

        if (res.status === 200) {
          if (res.data.message === "login successful") {
            const userData = res.data.UserData as User;
            token.user = userData;
            token.isNewUser = false;
          } else if (res.data.message === "New User") {
            token.isNewUser = true;
            token.user = {
              id: "",
              firstname: token.name || "",
              lastname: "",
              email: token.email || "",
              organizationId: "",
              role: UserRole.USER,
              isActive: true,
              isEmailVerified: true,
              isPhoneVerified: false,
              phoneNumber: "",
              profilePicture: token.picture || "",
              lastLogin: "",
              access: {
                userRole: UserRole.USER,
                accessProjects: true,
                accessTeam: true,
                accessTimeline: true,
                accessActivities: true,
                accessResources: true,
                manageResources: true,
                deleteResources: false,
                accessTasks: true,
                hold_cancle_tasks: false,
                assignTasks: false,
                accessCalendar: true,
                manageCalendar: false,
                accessChat: true,
                createGroups: false,
                manageGroups: true,
                createOrganization: false,
                accessOrganization: false,
                manageOrganization: false,
                createOrganizationManagers: false,
                accessOrganizationManagers: false,
                createOrganizationUsers: false,
                accessOrganizationUsers: false,
                createProjects: false,
                editProjects: false,
                deleteProjects: false,
                mapTeam: false,
                manageTimeline: false,
                manageActivities: false
              },
            };
          }
        }
      } catch (error) {
        console.error("Error during OAuth user fetch:", error);
      }
    }
    if (token.user) {
      session.user = token.user as User;
    }

    // console.log("Final session object:", session);
    return session;
  }
  },
});

export { handler as GET, handler as POST };
