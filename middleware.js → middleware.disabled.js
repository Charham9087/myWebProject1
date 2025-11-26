import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  console.log("Middleware - incoming pathname:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware - token fetched:", token);

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      console.log("Middleware - blocking admin access; token:", token);
      return new NextResponse("<h1>403 Not allowed</h1>", {
        status: 403,
        headers: { "Content-Type": "text/html" },
      });
    }

    console.log(`✅ Admin access granted to ${token.email} (role: ${token.role}) at UNIX time: ${Date.now()}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
