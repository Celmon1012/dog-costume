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
  const existingVoter = request.cookies.get(VOTER_COOKIE)?.value;
  const voterId = existingVoter ?? crypto.randomUUID();

  let supabaseResponse = NextResponse.next({ request });
  if (!existingVoter) {
    supabaseResponse.cookies.set(VOTER_COOKIE, voterId, voterCookieOptions);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return supabaseResponse;
  }

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
        if (!existingVoter) {
          supabaseResponse.cookies.set(
            VOTER_COOKIE,
            voterId,
            voterCookieOptions,
          );
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/admin") &&
    path !== "/admin/login" &&
    !path.startsWith("/admin/login/")
  ) {
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const email = user?.email?.toLowerCase();
    if (!email || !adminEmails.includes(email)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = email ? "?error=unauthorized" : "";
      const redirect = NextResponse.redirect(loginUrl);
      if (!existingVoter) {
        redirect.cookies.set(VOTER_COOKIE, voterId, voterCookieOptions);
      }
      return redirect;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
