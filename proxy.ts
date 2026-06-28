import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  let modified = false;

  // 1. Redirect legacy AMP path suffixes (e.g. /some-post/amp/ or /some-post/amp)
  if (url.pathname.endsWith("/amp") || url.pathname.endsWith("/amp/")) {
    const cleanPath = url.pathname.replace(/\/amp\/?$/, "");
    url.pathname = cleanPath || "/";
    modified = true;
  }

  // 2. Redirect legacy AMP query parameters (e.g. ?amp=1 or ?amp)
  if (url.searchParams.has("amp")) {
    url.searchParams.delete("amp");
    modified = true;
  }

  if (modified) {
    // 301 Permanent Redirect to transfer SEO authority to clean page URL
    return NextResponse.redirect(url, 301);
  }

  // 3. Protect all routes under /admin
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
          const res = NextResponse.next();
          // Set a secure HTTP-only cookie containing the auth token for Server Actions
          res.cookies.set("admin_token", authValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
          });
          return res;
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
