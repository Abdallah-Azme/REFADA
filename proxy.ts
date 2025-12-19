import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Debugging
  // console.log("Middleware running for:", pathname);

  // 1. Check for protected routes (Dashboard)
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    // A. Unauthenticated check
    // If no access token, check for refresh token
    // If refresh token exists, allow access - client-side will handle refresh
    if (!token) {
      const refreshToken = request.cookies.get("refresh_token")?.value;

      if (!refreshToken) {
        // No access token AND no refresh token - redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
      // Has refresh token - allow through, client will refresh
      // Note: Role checks below may fail without userRole, but client will handle
    }

    // B. Role-based protection
    if (userRole) {
      // Admin Protection
      if (
        pathname.startsWith("/dashboard/admin") ||
        pathname.startsWith("/dashboard/(superadmin)")
      ) {
        if (userRole !== "admin") {
          return redirectToDashboard(request, userRole);
        }
      }

      // Delegate Protection
      else if (
        pathname.startsWith("/dashboard/delegate") ||
        pathname.startsWith("/dashboard/(representative)")
      ) {
        if (userRole !== "delegate") {
          return redirectToDashboard(request, userRole);
        }
      }

      // Contributor Protection
      else if (
        pathname.startsWith("/dashboard/contributor") ||
        pathname.startsWith("/dashboard/(contributor)")
      ) {
        if (userRole !== "contributor") {
          return redirectToDashboard(request, userRole);
        }
      }
    }
  }

  // 2. Prevent authenticated users from accessing auth pages
  const authPages = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/verify-code",
    "/reset-password",
  ];

  if (authPages.some((page) => pathname.startsWith(page))) {
    const token = request.cookies.get("auth_token")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    if (token && userRole) {
      return redirectToDashboard(request, userRole);
    }
  }

  return NextResponse.next();
}

function redirectToDashboard(request: NextRequest, role: string) {
  const url = request.nextUrl.clone();

  switch (role) {
    case "admin":
      url.pathname = "/dashboard/admin";
      break;
    case "delegate":
      url.pathname = "/dashboard/families"; // Delegate dashboard - using families as default landing page
      break;
    case "contributor":
      url.pathname = "/dashboard/contributor";
      break;
    default:
      url.pathname = "/dashboard";
  }

  return NextResponse.redirect(url);
}

export const config = {
  // Matcher ignoring `/_next/`, and `/api/`
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
