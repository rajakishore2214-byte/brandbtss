import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // Protect all routes under /admin
  if (url.pathname.startsWith("/admin")) {
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
      try {
        const authValue = basicAuth.split(" ")[1];
        // Decode Basic Auth header: Username:Password
        const [user, pwd] = atob(authValue).split(":");

        // Retrieve admin credentials from environment variables
        // Defaults to 'admin' / 'password123' if not set in environment
        const adminUser = process.env.ADMIN_USER || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "password123";

        if (user === adminUser && pwd === adminPassword) {
          return NextResponse.next();
        }
      } catch (e) {
        console.error("Failed to parse basic authorization header", e);
      }
    }

    // Return a 401 Unauthorized response to trigger the browser's credential prompt
    return new NextResponse("Authentication Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
