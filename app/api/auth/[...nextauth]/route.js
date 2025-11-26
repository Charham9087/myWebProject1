import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SaveUSertoDB } from "@/components/saveUsertoDB";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    // ✅ VERY IMPORTANT FIX: Use JWT strategy
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }) {
            console.log("signIn callback - user:", user);
            return true;
        },

        async jwt({ token, user }) {
            console.log("jwt callback - entry token:", token, "user:", user);
            if (user) {
                try {
                    const dbUser = await SaveUSertoDB(user);
                    console.log("jwt callback - dbUser:", dbUser);

                    // Put only safe values in JWT
                    token.id = dbUser._id?.toString() || dbUser.id;
                    token.role = dbUser.role || "user";

                    console.log("jwt callback - token after set:", { id: token.id, role: token.role });

                } catch (error) {
                    console.error("❌ Error saving user to DB:", error);
                    token.error = "SaveUserError";
                }
            }
            return token;
        },

        async session({ session, token }) {
            console.log("session callback - incoming token:", token, "session before:", session);
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            console.log("session callback - session after:", session);
            return session;
        },
    },

    // Required
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
