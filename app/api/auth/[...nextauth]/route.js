import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// It's recommended to move database logic out of the /components directory.
// A good practice is to have it in a /lib or /server folder.
// e.g., import { saveUserToDB } from "@/lib/db";
import { SaveUSertoDB } from "@/components/saveUsertoDB";



export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // The signIn callback is used to control if a user is allowed to sign in.
        async signIn({ user }) {
            // You can add logic here to prevent sign-in for certain users.
            // For now, we'll allow everyone and handle user creation/update in the jwt callback.
            return true;
        },
        async jwt({ token, user }) {
            // This callback is called whenever a JWT is created or updated.
            // `user` is only available on the first call after a successful sign-in.
            if (user) {
                try {
                    const dbUser = await SaveUSertoDB(user);
                    // Add custom properties to the token from your database user.
                    // These will be persisted in the JWT.
                    token.id = dbUser.id; // Assuming your user model has an id
                    token.role = dbUser.role; // e.g., 'admin', 'user'
                } catch (error) {
                    console.error("Error saving user to DB or enriching token:", error);
                    return { ...token, error: "SaveUserError" };
                }
            }
            return token;
        },
        async session({ session, token }) {
            // This callback is called whenever a session is checked.
            // We add the custom properties from the token to the session object.
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
        
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };