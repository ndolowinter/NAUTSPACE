import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { EXECUTIVE_ROLES, SUPERUSER_EMAIL } from "@/lib/types/database";

const EXECUTIVE_PREFIX = "/executive";
const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/auth/login";
const ENROLL_2FA_PATH = "/auth/enroll-2fa";
const VERIFY_2FA_PATH = "/auth/verify-2fa";

// Marketing tabs that stay in the nav for everyone, but whose content is
// members-only: an anonymous click redirects to sign-in (then sign-up),
// landing back on the page once an account exists. Products & Services
// (/services) is public.
const MEMBERS_ONLY_PREFIXES = ["/research"];

function requireTwoFactor(request: NextRequest, isEnrolled: boolean, pathname: string) {
  if (!isEnrolled) {
    const redirectUrl = new URL(ENROLL_2FA_PATH, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  const twoFaVerified = request.cookies.get("nautspace_2fa_verified")?.value === "true";
  if (!twoFaVerified) {
    const redirectUrl = new URL(VERIFY_2FA_PATH, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isExecutiveRoute = pathname.startsWith(EXECUTIVE_PREFIX);
  const isMembersOnlyRoute = MEMBERS_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // /admin restricted to the single superuser account, not just any
  // privileged role (unlike /executive below). No 2FA step here: sign-in
  // alone is sufficient once the account matches SUPERUSER_EMAIL.
  if (isAdminRoute) {
    if (!user || !supabase) {
      const redirectUrl = new URL(LOGIN_PATH, request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user.email?.toLowerCase() !== SUPERUSER_EMAIL.toLowerCase()) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  }

  if (isMembersOnlyRoute) {
    if (!user) {
      const redirectUrl = new URL(LOGIN_PATH, request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  if (!isExecutiveRoute) {
    return response;
  }

  // 1. Must be authenticated (also covers Supabase being unconfigured
  //    updateSession() returns a null user in that case).
  if (!user || !supabase) {
    const redirectUrl = new URL(LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Must carry a government/executive/admin role (RBAC).
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_2fa_enabled")
    .eq("id", user.id)
    .single();

  if (!profile || !EXECUTIVE_ROLES.includes(profile.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3 & 4. Must have 2FA enrolled and verified for this session.
  const twoFaRedirect = requireTwoFactor(request, profile.is_2fa_enabled, pathname);
  if (twoFaRedirect) return twoFaRedirect;

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets, so the session cookie stays
     * fresh everywhere, but only /admin/* and /executive/* trigger the
     * RBAC/2FA gates above.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
