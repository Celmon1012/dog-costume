import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { VOTER_COOKIE } from "@/lib/voter";

const voterCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const existingVoter = request.cookies.get(VOTER_COOKIE)?.value;
  const voterId = existingVoter ?? crypto.randomUUID();

  // Public pages skip Supabase auth — that extra round-trip made every click lag.
  if (!path.startsWith("/admin")) {
    const response = NextResponse.next({ request });
    if (!existingVoter && (path === "/vote" || path.startsWith("/vote/") || path === "/contest" || path.startsWith("/contest/"))) {
      response.cookies.set(VOTER_COOKIE, voterId, voterCookieOptions);
    }
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[],
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const isLogin = path === "/admin/login" || path.startsWith("/admin/login/");
  if (isLogin) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = user?.email?.toLowerCase();
  if (!email || !adminEmails.includes(email)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = email ? "?error=unauthorized" : "";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/vote", "/vote/:path*", "/contest", "/contest/:path*"],
};
