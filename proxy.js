import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabaseConfigSafe } from "./lib/supabase/env";

const PROTECTED_PREFIXES = ["/reviser", "/fiche", "/paywall"];

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request) {
  const config = getSupabaseConfigSafe();
  if (!config) {
    return NextResponse.next({ request });
  }

  const { url, anonKey } = config;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        if (headers && typeof headers === "object") {
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
      },
    },
  });

  await supabase.auth.getClaims();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = new URL("/auth/signin", request.url);
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    redirectUrl.searchParams.set("next", nextPath || "/reviser");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
