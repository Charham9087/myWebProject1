import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return new NextResponse("<h1>403 Not allowed</h1>", {
        status: 403,
        headers: { "Content-Type": "text/html" },
      });
    }

    console.log(`✅ Admin access granted to ${token.email} at UNIX time: ${Date.now()}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
