import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { sanitizeNextPath } from "../../../lib/authRedirects";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next") ?? "");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = new URL(next, request.url);
      return NextResponse.redirect(dest);
    }
  }

  const fail = new URL("/auth/signin", request.url);
  fail.searchParams.set("error", "oauth");
  return NextResponse.redirect(fail);
}
