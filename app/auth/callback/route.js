import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import {
  OAUTH_RETURN_PATH_COOKIE,
  sanitizeNextPath,
} from "../../../lib/authRedirects";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  let raw = nextParam ?? "";
  if (raw === "") {
    raw = request.cookies.get(OAUTH_RETURN_PATH_COOKIE)?.value ?? "";
  }
  const next = sanitizeNextPath(raw);

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = new URL(next, request.url);
      const res = NextResponse.redirect(dest);
      res.cookies.set(OAUTH_RETURN_PATH_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  const fail = new URL("/auth/signin", request.url);
  fail.searchParams.set("error", "oauth");
  const res = NextResponse.redirect(fail);
  res.cookies.set(OAUTH_RETURN_PATH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
