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
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    let isAuthenticated = false;
    let authValue = "";

    // Check Basic Auth header first (for API / automated scripts)
    const basicAuth = req.headers.get("authorization");
    if (basicAuth) {
      authValue = basicAuth.split(" ")[1];
    } else {
      // Otherwise check cookie
      const adminTokenCookie = req.cookies.get("admin_token");
      if (adminTokenCookie) {
        authValue = adminTokenCookie.value;
      }
    }

    if (authValue) {
      try {
        const [user, pwd] = atob(authValue).split(":");
        if (user === adminUser && pwd === adminPassword) {
          isAuthenticated = true;
        }
      } catch (e) {
        console.error("Failed to verify admin auth in middleware", e);
      }
    }

    // Exclude /admin/login from blocking
    if (url.pathname === "/admin/login") {
      if (isAuthenticated) {
        // Already authenticated, redirect to /admin dashboard
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      // Redirect unauthenticated standard users to login dashboard page
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
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
