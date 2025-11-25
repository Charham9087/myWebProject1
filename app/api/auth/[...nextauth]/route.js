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
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                try {
                    const dbUser = await SaveUSertoDB(user);

                    // Put only safe values in JWT
                    token.id = dbUser._id?.toString() || dbUser.id;
                    token.role = dbUser.role || "user";

                } catch (error) {
                    console.error("❌ Error saving user to DB:", error);
                    token.error = "SaveUserError";
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },

    // Required
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
